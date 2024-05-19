/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import {  ValidateStudentIdDto } from './dto/student.dto';
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
      where: { id: params.id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${params.id} not found`);
    }

    return student;
  }

  async update(params: ValidateStudentIdDto, updateStudentDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${params.id} not found`);
    }

    return this.prisma.student.update({
      where: { id: params.id },
      data: updateStudentDto,
    });
  }

  async delete(params: ValidateStudentIdDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${params.id} not found`);
    }

    return this.prisma.student.delete({
      where: { id: params.id },
    });
  }
}
