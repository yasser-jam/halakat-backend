/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ValidateTeacherIdDto } from './../dto/teacher.dto';
import { PrismaService } from './../prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.teacher.findMany({
      where: {
        role: 'TEACHER'
      }
    });
  }

  async create(CreateTeacherDto) {
    return this.prisma.teacher.create({
      data: {
        ...CreateTeacherDto,
        password: 'password'
      },
    });
  }

  async findOne(params: ValidateTeacherIdDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(params.id) },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${params.id} not found`);
    }

    return teacher;
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
                    student: true
                  }
                }
              }
            }
          },
        },
      }
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${params.id} not found`);
    }
    
    teacher.groups = teacher.groups.map((g: any) => {
      g.group.students = g.group.students.map(stud => stud.student) as any

      return g.group
    }) as any

    return teacher;
  }

  async update(params: ValidateTeacherIdDto, updateTeacherDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(params.id) },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${Number(params.id)} not found`);
    }

    return this.prisma.teacher.update({
      where: { id: Number(params.id) },
      data: updateTeacherDto,
    });
  }

  async delete(params: ValidateTeacherIdDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(params.id) },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${Number(params.id)} not found`);
    }

    return this.prisma.teacher.delete({
      where: { id: Number(params.id) },
    });
  }
}
