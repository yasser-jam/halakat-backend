/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTeacherDto, ValidateTeacherIdDto } from './../dto/teacher.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from './../prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async findAll(campaignId?: number) {
    let res : any = await this.prisma.teacher.findMany({
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
                    campaignId: Number(campaignId),
                  },
                },
              },
            },
          },
        },
        teacherRoles: {
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
      teacherRoles: undefined,
      groups: item.groups.map((gr) => gr.group),
      roles: item.teacherRoles.map((tr) => ({
        role: tr.role.name,
        campaign: tr.campaign.name,
        group: tr.group.title,
      })),
    }));

    return res;
  }

  async create(CreateTeacherDto) {
    const { roleAssignments = [], ...data } = CreateTeacherDto;

    const newTeacher = await this.prisma.teacher.create({
      data: {
        ...data,
        password: await bcrypt.hash('password', 10),
      },
    });

    for (const assignment of roleAssignments) {
      await this.prisma.teacherRole.create({
        data: {
          teacherId: newTeacher.id,
          roleId: assignment.roleId,
          groupId: assignment.groupId,
          campaignId: assignment.campaignId,
        },
      });
    }

    return newTeacher;
  }

  async findOne(params: ValidateTeacherIdDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(params.id) },
      include: {
        teacherRoles: {
          include: {
            role: true,
            campaign: true,
            group: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${params.id} not found`);
    }

    return {
      ...teacher,
      teacherRoles: undefined,
      roles: teacher.teacherRoles.map((tr) => ({
        role: tr.role.name,
        campaign: tr.campaign.name,
        group: tr.group.title,
      })),
    };
  }

  async findInfo(params: ValidateTeacherIdDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(params.id) },
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
          where: {
            group: {
              campaigns: {
                some: {
                  campaignId: params.campaign_id,
                },
              },
            },
          },
        },
        teacherRoles: {
          include: {
            role: true,
            campaign: true,
            group: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${params.id} not found`);
    }

    teacher.groups = teacher.groups.map((g: any) => {
      g.group.students = g.group.students.map((stud) => stud.student);
      return g.group;
    });

    return {
      ...teacher,
      roles: teacher.teacherRoles.map((tr) => ({
        role: tr.role.name,
        campaign: tr.campaign.name,
        group: tr.group.title,
      })),
    };
  }

  async update(params: ValidateTeacherIdDto, updateTeacherDto: UpdateTeacherDto) {
    const { teacherRoles = [], ...data } = updateTeacherDto;

    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(params.id) },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${params.id} not found`);
    }

    const updated = await this.prisma.teacher.update({
      where: { id: Number(params.id) },
      data,
    });

    // optional: delete existing roles first (if full replace strategy)
    await this.prisma.teacherRole.deleteMany({
      where: { teacherId: updated.id },
    });

    // then insert new roles
    for (const assignment of teacherRoles) {
      await this.prisma.teacherRole.create({
        data: {
          teacherId: updated.id,
          roleId: assignment.roleId,
          groupId: assignment.groupId,
          campaignId: assignment.campaignId,
        },
      });
    }

    return updated;
  }

  async delete(params: ValidateTeacherIdDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(params.id) },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${params.id} not found`);
    }

    return this.prisma.teacher.delete({
      where: { id: Number(params.id) },
    });
  }
}
