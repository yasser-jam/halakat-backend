import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStudentDto } from './student.dto';
import { UpdateStudentDto } from '../dto/student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const students = await this.prisma.student.findMany();
    return { message: 'All students', data: students };
  }

  async create(createStudentDto: CreateStudentDto) {
    const student = await this.prisma.student.create({
      data: createStudentDto,
    });
    return { message: 'Student created', data: student };
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return { message: `Student ${id} found`, data: student };
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    const updated = await this.prisma.student.update({
      where: { id: Number(id) },
      data: updateStudentDto,
    });

    return { message: `Student ${id} updated`, data: updated };
  }

  async delete(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    await this.prisma.student.delete({
      where: { id: Number(id) },
    });

    return { message: `Student ${id} deleted` };
  }

  // assign student to group
  async assign(id: number, assignDto: { groupId: number; campaignId: number }) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(assignDto.groupId) },
    });

    if (!group) {
      throw new NotFoundException(
        `Group with ID ${assignDto.groupId} not found`,
      );
    }

    // Check if the student exists
    const student = await this.prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Create student group assignment
    const studentGroup = await this.prisma.studentGroup.create({
      data: {
        student_id: Number(id),
        group_id: Number(assignDto.groupId),
        campaign_id: Number(assignDto.campaignId),
      },
    });

    return { message: 'Student assigned to group', data: studentGroup };
  }

  // unassign student from group
  async unassign(id: number, campaignId: number) {
    // Check if the student exists
    const student = await this.prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Remove student group assignment
    await this.prisma.studentGroup.deleteMany({
      where: {
        student_id: Number(id),
        campaign_id: Number(campaignId),
      },
    });

    return { message: 'Student unassigned from group' };
  }

  // List unassigned students for a campaign
  async listUnassigned(campaignId: number) {
    const assignedStudents = await this.prisma.studentGroup.findMany({
      where: {
        campaign_id: Number(campaignId),
      },
    });

    const allStudents = await this.prisma.student.findMany();

    const unassignedStudents = allStudents.filter(
      (stud) => !assignedStudents.find((item) => item.student_id == stud.id),
    );

    return { message: 'Unassigned students', data: unassignedStudents };
  }
}
