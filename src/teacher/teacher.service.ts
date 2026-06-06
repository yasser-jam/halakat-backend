import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTeacherDto } from './teacher.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async findAll({
    page = 1,
    limit = 20,
  }: {
    page?: number;
    limit?: number;
  }) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where: {
          role: 'TEACHER',
        },
        orderBy: {
          first_name: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.teacher.count({
        where: {
          role: 'TEACHER',
        },
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(createTeacherDto: CreateTeacherDto, campaignId?: number) {
    const { role, password, ...rest } = createTeacherDto as any;
    const data: any = {
      ...rest,
      password: await bcrypt.hash(password || 'password', 10),
    };
    if (role) {
      data.role = role;
    }

    const newTeacher = await this.prisma.teacher.create({ data });

    if (campaignId) {
      await this.assignToCampaign(newTeacher.id, campaignId);
    }

    return { message: 'Teacher created', data: newTeacher };
  }

  async assignToCampaign(
    teacherId: number,
    campaignId: number,
    roleId: number = 1,
  ) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    const existing = await this.prisma.teacherCampaign.findUnique({
      where: {
        teacher_id_campaign_id: {
          teacher_id: teacherId,
          campaign_id: campaignId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Teacher ${teacherId} is already assigned to campaign ${campaignId}`,
      );
    }

    await this.prisma.teacherCampaign.create({
      data: {
        teacher_id: teacherId,
        campaign_id: campaignId,
      },
    });

    await this.prisma.teacherRole.create({
      data: {
        teacher_id: teacherId,
        role_id: roleId,
        campaign_id: campaignId,
      },
    });

    return {
      message: 'Teacher assigned to campaign',
      data: { teacher_id: teacherId, campaign_id: campaignId, role_id: roleId },
    };
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(id) },
      include: {
        groups: {
          include: {
            group: true,
          },
        },
        teacher_roles: {
          include: {
            role: true,
            campaign: true,
            group: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    const result = {
      ...teacher,
      teacher_roles: undefined,
      roles: teacher.teacher_roles.map((tr) => ({
        role: tr.role.name,
        campaign: tr.campaign.name,
        group: tr.group,
      })),
    };

    return result;
  }

  async findInfo(id: number, campaign_id: string) {
    // Fetch teacher with roles and groups for the campaign
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(id) },
      include: {
        groups: {
          include: {
            group: {
              include: {
                students: {
                  include: {
                    student: true,
                  },
                },
              },
            },
          },
        },
        teacher_roles: {
          where: { campaign_id: Number(campaign_id) },
          include: {
            role: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    // Get the first (should be only) teacher_role for this campaign
    const teacherRole = teacher.teacher_roles[0];
    const teacherGroup = teacher.groups?.[0];
    let role = null;
    let group = null;

    if (teacherRole) {
      // Role info
      const permissions = Array.isArray(teacherRole.role.permissions)
        ? teacherRole.role.permissions
        : typeof teacherRole.role.permissions === 'string'
          ? JSON.parse(teacherRole.role.permissions)
          : [];
      role = {
        name: teacherRole.role.name,
        permissions,
      };

      // Group info
      if (teacherGroup?.group) {
        group = {
          id: teacherGroup.group.id,
          title: teacherGroup.group.title,
          class: teacherGroup.group.class,
          // Add other group fields as needed
          students: teacherGroup.group.students.map((stud: any) => {
            return {
              first_name: stud.student.first_name,
              last_name: stud.student.last_name,
              image: stud.student.image_url,
              mobile_phone: stud.student.student_mobile,
              class: stud.student.educational_class,
            };
          }),
        };
      }
    }

    // Prepare teacher data (remove sensitive fields)
    const teacherData = { ...teacher };
    delete teacherData.password;
    delete teacherData.teacher_roles;
    delete teacherData.groups;

    return {
      ...teacherData,
      role,
      group,
    };
  }

  async update(id: number, updateTeacherDto: CreateTeacherDto) {
    const { teacherRoles = [], ...data } = updateTeacherDto as any;

    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(id) },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    const updated = await this.prisma.teacher.update({
      where: { id: Number(id) },
      data: {
        ...data,
        id: undefined,
        roles: undefined,
      },
    });

    // optional: delete existing roles first (if full replace strategy)
    await this.prisma.teacherRole.deleteMany({
      where: { teacher_id: updated.id },
    });

    // then insert new roles
    for (const assignment of teacherRoles) {
      await this.prisma.teacherRole.create({
        data: {
          teacher_id: updated.id,
          role_id: assignment.roleId,
          group_id: assignment.groupId,
          campaign_id: assignment.campaignId,
        },
      });
    }

    return { message: `Teacher ${id} updated`, data: updated };
  }

  async delete(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(id) },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    await this.prisma.teacher.delete({
      where: { id: Number(id) },
    });

    return { message: `Teacher ${id} deleted` };
  }

  // List unassigned teachers for a campaign (simplified)
  async listUnassigned(campaignId: number) {
    const unassignedTeachers = await this.prisma.teacher.findMany({
      where: {
        campaign_assignments: {
          some: { campaign_id: Number(campaignId) },
        },
        role: 'TEACHER',
        groups: {
          none: { campaign_id: Number(campaignId) },
        },
      },
    });
    return unassignedTeachers;
  }
}
