import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma.service';
import { CreateStudentDto } from './student.dto';
import { UpdateStudentDto } from '../dto/student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  private generatePlaceholderMobile(): string {
    const suffix = String(randomInt(0, 100_000_000)).padStart(8, '0');
    return `00${suffix}`;
  }

  private async resolveStudentMobile(mobile?: string): Promise<string> {
    if (mobile?.trim()) {
      return mobile.trim();
    }

    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = this.generatePlaceholderMobile();
      const existing = await this.prisma.student.findUnique({
        where: { student_mobile: candidate },
        select: { id: true },
      });
      if (!existing) {
        return candidate;
      }
    }

    throw new ConflictException(
      'Failed to generate a unique placeholder student mobile',
    );
  }

  async findAll(filters?: {
    mosqueIds?: number[];
    search?: string;
    educational_class?: number;
    in_another_mosque?: boolean;
    campaign_id?: number;
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

    if (filters?.campaign_id !== undefined) {
      whereClause.campaign_enrollments = {
        some: {
          campaign_id: filters.campaign_id,
          is_active: true,
        },
      };
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
    const includeGroup = filters?.campaign_id !== undefined;

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where: whereClause,
        select: {
          id: true,
          first_name: true,
          last_name: true,
          father_name: true,
          student_mobile: true,
          educational_class: true,
          birth_date: true,
          ...(includeGroup && {
            groups: {
              where: { campaign_id: filters.campaign_id },
              take: 1,
              select: {
                group: {
                  select: { id: true, title: true },
                },
              },
            },
          }),
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.student.count({ where: whereClause }),
    ]);

    const data = students.map((student) => {
      const { groups, ...basic } = student as typeof student & {
        groups?: { group: { id: number; title: string } }[];
      };

      if (!includeGroup) {
        return basic;
      }

      const assignedGroup = groups?.[0]?.group;

      return {
        ...basic,
        group: assignedGroup
          ? { id: assignedGroup.id, name: assignedGroup.title }
          : null,
      };
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllCampaign(campaignId?: string) {
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

    return students.map((el) => ({
      ...el,
      groups: undefined,
      group: el.groups?.[0]?.group ?? null,
    }));
  }

  async create(createStudentDto: CreateStudentDto) {
    const { campaign_id, ...studentData } = createStudentDto;
    const data = {
      ...studentData,
      student_mobile: await this.resolveStudentMobile(
        studentData.student_mobile,
      ),
    };

    if (campaign_id) {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: Number(campaign_id) },
      });

      if (!campaign) {
        throw new NotFoundException(
          `Campaign with ID ${campaign_id} not found`,
        );
      }

      const student = await this.prisma.$transaction(async (tx) => {
        const created = await tx.student.create({ data });
        await tx.studentCampaign.create({
          data: {
            student_id: created.id,
            campaign_id: Number(campaign_id),
          },
        });
        return created;
      });

      return {
        message: 'Student created and assigned to campaign',
        data: student,
      };
    }

    const student = await this.prisma.student.create({
      data,
    });

    return {
      message: 'Student created',
      data: student,
    };
  }

  async assignToCampaign(studentId: number, campaignId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    const existingEnrollment = await this.prisma.studentCampaign.findUnique({
      where: {
        student_id_campaign_id: {
          student_id: studentId,
          campaign_id: campaignId,
        },
      },
    });

    if (existingEnrollment?.is_active) {
      throw new ConflictException(
        `Student ${studentId} is already assigned to campaign ${campaignId}`,
      );
    }

    const otherCampaignEnrollment = await this.prisma.studentCampaign.findFirst(
      {
        where: {
          student_id: studentId,
          campaign_id: { not: campaignId },
          is_active: true,
        },
      },
    );

    if (otherCampaignEnrollment) {
      throw new ConflictException(
        `Student ${studentId} is already enrolled in campaign ${otherCampaignEnrollment.campaign_id}`,
      );
    }

    const enrollment = existingEnrollment
      ? await this.prisma.studentCampaign.update({
          where: {
            student_id_campaign_id: {
              student_id: studentId,
              campaign_id: campaignId,
            },
          },
          data: { is_active: true },
        })
      : await this.prisma.studentCampaign.create({
          data: {
            student_id: studentId,
            campaign_id: campaignId,
          },
        });

    return {
      message: 'Student assigned to campaign',
      data: enrollment,
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
