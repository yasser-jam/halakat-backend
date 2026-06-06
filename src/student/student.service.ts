import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStudentDto } from './student.dto';
import { UpdateStudentDto } from '../dto/student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    mosqueIds?: number[];
    search?: string;
    educational_class?: number;
    in_another_mosque?: boolean;
    page?: number;
    limit?: number;
  }) {
    const whereClause: any = {};

    if (filters?.mosqueIds && filters.mosqueIds.length > 0) {
      whereClause.mosque_id = { in: filters.mosqueIds };
    }

    if (filters?.educational_class !== undefined) {
      whereClause.educational_class = filters.educational_class;
    }

    if (filters?.in_another_mosque !== undefined) {
      whereClause.in_another_mosque = filters.in_another_mosque;
    }

    if (filters?.search) {
      whereClause.OR = [
        { first_name: { contains: filters.search, mode: 'insensitive' } },
        { last_name: { contains: filters.search, mode: 'insensitive' } },
        { student_mobile: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where: whereClause,
        include: {
          mosque: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.student.count({ where: whereClause }),
    ]);

    return {
      data: students,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllCampaign(campaignId?: string) {
    const students = await this.prisma.student.findMany({
      // where: {
      //   campaign_enrollments: {
      //     some: {
      //       campaign_id: Number(campaignId),
      //     },
      //   },
      // },
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

  async create(createStudentDto: CreateStudentDto, campaignId?: number) {
    const student = await this.prisma.student.create({
      data: createStudentDto,
    });

    if (campaignId) {
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

    return {
      message: 'Student created',
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
