import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStudentDto } from './student.dto';
import { UpdateStudentDto } from '../dto/student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async findAll(campaignId: string) {
    const students = await this.prisma.student.findMany({
      where: {
        campaign_enrollments: {
          some: {
            campaign_id: Number(campaignId),
          },
        },
      },
      include: {
        groups: {
          where: {
            campaign_id: Number(campaignId),
          },
          include: {
            group: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    return students.map((el) => ({
      ...el,
      groups: undefined,
      group_title: el.groups?.[0]?.group?.title,
    }));
  }

  async create(createStudentDto: CreateStudentDto, campaignId: number) {
    const student = await this.prisma.student.create({
      data: createStudentDto,
    });
    // Assign student to campaign
    await this.prisma.studentCampaign.create({
      data: {
        student_id: student.id,
        campaign_id: campaignId,
      },
    });
    return {
      message: 'Student created and assigned to campaign',
      data: student,
    };
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
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

  // List students for a specific campaign
  async listStudentsForCampaign(campaignId: number) {
    const students = await this.prisma.student.findMany({
      where: {
        campaign_enrollments: {
          some: {
            campaign_id: Number(campaignId),
            is_active: true,
          },
        },
      },
      include: {
        campaign_enrollments: {
          where: {
            campaign_id: Number(campaignId),
            is_active: true,
          },
          select: {
            enrolled_date: true,
            is_active: true,
          },
        },
        groups: {
          where: {
            campaign_id: Number(campaignId),
          },
          include: {
            group: {
              select: {
                id: true,
                title: true,
                class: true,
              },
            },
          },
        },
      },
    });

    return students;
  }
}
