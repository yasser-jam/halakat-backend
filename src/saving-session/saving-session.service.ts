import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import {
  CreateSavingSessionDto,
  FilterSavingSessionDto,
} from '../dto/saving.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SavingSessionService {
  constructor(private prisma: PrismaService) {}

  async createSavingSession(dto: CreateSavingSessionDto) {
    const {
      mistakes,
      teacherId,
      studentId,
      campaign_id,
      ...savingSessionData
    } = dto;

    return this.prisma.savingSession.create({
      data: {
        ...savingSessionData,
        teacher_id: teacherId,
        student_id: studentId,
        campaign_id: campaign_id,
        mistakes_in_session: {
          create: mistakes.map((m) => ({
            page: m.pageNumber,
            mistake: {
              connect: {
                id: m.mistakeId,
              },
            },
          })),
        },
      },
      include: {
        mistakes_in_session: {
          include: { mistake: true },
        },
        evaluation: true,
        student: true,
        teacher: true,
        campaign: true,
      },
    });
  }

  async getAll() {
    return this.prisma.savingSession.findMany({
      include: {
        mistakes_in_session: {
          include: { mistake: true },
        },
        student: true,
        teacher: true,
        campaign: true,
      },
    });
  }

  async getById(id: number) {
    return this.prisma.savingSession.findUnique({
      where: { id: Number(id) },
      include: {
        mistakes_in_session: {
          include: { mistake: true },
        },
        student: true,
        teacher: true,
        campaign: true,
      },
    });
  }

  async filter(dto: FilterSavingSessionDto) {
    const { studentId, teacherId, mistakeId, campaign_id, dateFrom, dateTo } =
      dto;

    const where: Prisma.SavingSessionWhereInput = {
      ...(studentId ? { studentId: Number(studentId) } : {}),
      ...(teacherId ? { teacherId: Number(teacherId) } : {}),
      ...(campaign_id ? { campaignId: Number(campaign_id) } : {}),
      ...(dateFrom || dateTo
        ? {
            created_at: {
              ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
              ...(dateTo ? { lte: new Date(dateTo) } : {}),
            },
          }
        : {}),
      ...(mistakeId
        ? {
            MistakeInSession: {
              some: {
                mistakeId: Number(mistakeId),
              },
            },
          }
        : {}),
    };

    const res = await this.prisma.savingSession.findMany({
      where,
      include: {
        mistakes_in_session: {
          include: { mistake: true },
        },
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
        evaluation: {
          select: {
            title: true,
            points: true,
          },
        },
      },
    });

    return res.map((el) => ({
      ...el,
      MistakeInSession: undefined,
      mistakes: el.mistakes_in_session?.map((item) => ({
        id: item.id,
        page: item.page,
        title: item.mistake?.title,
      })),
    }));
  }

  async remove(id: number) {
    return this.prisma.savingSession.delete({
      where: { id },
    });
  }
}
