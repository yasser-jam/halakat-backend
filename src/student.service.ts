/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import {  AssignToGroupDto, UpdateStudentDto, ValidateStudentIdDto } from './dto/student.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.student.findMany();
  }

  async create(createStudentDto) {
    return this.prisma.student.create({
      data: createStudentDto,
    });
  }

  async findOne(params: ValidateStudentIdDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: Number(params.id) },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${params.id} not found`);
    }

    return student;
  }

  async update(params: ValidateStudentIdDto, updateStudentDto: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: Number(params.id) },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${Number(params.id)} not found`);
    }

    return this.prisma.student.update({
      where: { id: Number(params.id) },
      data: updateStudentDto,
    });
  }

  async delete(params: ValidateStudentIdDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: Number(params.id) },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${params.id} not found`);
    }

    return this.prisma.student.delete({
      where: { id: Number(params.id) },
    });
  }

  // assign student to group
  async assign(params: ValidateStudentIdDto, assignDto: AssignToGroupDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(assignDto.groupId) },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${assignDto.groupId} not found`);
    }

    // Check if the student exists
    const student = await this.prisma.student.findUnique({
      where: { id: Number(params.id) },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with ID ${params.id} not found`,
      );
    }

    return this.prisma.student.update({
      where: { id: Number(params.id) },
      data: {
        // group: {
        //   connect: { id: Number(assignDto.groupId) },
        // },
      },
    });
  }

  // unassign student from group
  async unassign(params: ValidateStudentIdDto) {

    // Check if the student exists
    const student = await this.prisma.student.findUnique({
      where: { id: Number(params.id) },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with ID ${params.id} not found`,
      );
    }

    return this.prisma.student.update({
      where: { id: Number(params.id) },
      data: {
        // groupId: null
      },
    });
  }
}
