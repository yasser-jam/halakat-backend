import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTeacherDto } from './teacher.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async findAll(campaignId?: number) {
    let res: any = await this.prisma.teacher.findMany({
      where: {
        role: 'TEACHER',
      },
      include: {
        groups: {
          include: {
            group: {
              include: {
                campaigns: {
                  where: {
                    campaign_id: Number(campaignId),
                  },
                },
              },
            },
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

    res = res.map((item) => ({
      ...item,
      teacher_roles: undefined,
      groups: item.groups.map((gr) => gr.group),
      roles: item.teacher_roles.map((tr) => ({
        role: tr.role.name,
        campaign: tr.campaign.name,
        group: tr.group.title,
      })),
    }));

    return { message: 'All teachers', data: res };
  }

  async create(createTeacherDto: CreateTeacherDto) {
    const { roleAssignments = [], ...data } = createTeacherDto as any;

    const newTeacher = await this.prisma.teacher.create({
      data: {
        ...data,
        password: await bcrypt.hash('password', 10),
      },
    });

    for (const assignment of roleAssignments) {
      await this.prisma.teacherRole.create({
        data: {
          teacher_id: newTeacher.id,
          role_id: assignment.roleId,
          group_id: assignment.groupId,
          campaign_id: assignment.campaignId,
        },
      });
    }

    return { message: 'Teacher created', data: newTeacher };
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(id) },
      include: {
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
        group: tr.group.title,
      })),
    };

    return { message: `Teacher ${id} found`, data: result };
  }

  async findInfo(id: number, campaign_id: number) {
    // Fetch teacher with roles and groups for the campaign
    console.log(campaign_id);
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(id) },
      include: {
        teacher_roles: {
          where: { campaign_id },
          include: {
            role: true,
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
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    // Get the first (should be only) teacher_role for this campaign
    const teacherRole = teacher.teacher_roles[0];
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
      if (teacherRole.group) {
        group = {
          id: teacherRole.group.id,
          title: teacherRole.group.title,
          class: teacherRole.group.class,
          // Add other group fields as needed
          students: teacherRole.group.students.map((stud: any) => {
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
      data,
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
}
