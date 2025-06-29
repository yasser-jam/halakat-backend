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
    const { mistakes, ...savingSessionData } = dto;
    // 1. Calculate total reduced points from mistake list
    let totalReduced = 0;
    for (const m of mistakes) {
      const mistake = await this.prisma.mistake.findUnique({
        where: { id: m.mistakeId },
      });
      if (mistake) totalReduced += mistake.removed_points;
    }

    // 2. Fetch all evaluations for this campaign
    const evaluations = await this.prisma.evaluation.findMany({
      where: { campaignId: dto.campaignId },
      orderBy: { reducedAmount: 'desc' }, // get the highest matching evaluation first
    });

    const matchedEvaluation = evaluations.find(
      (ev) => totalReduced >= ev.reducedAmount,
    );

    return this.prisma.savingSession.create({
      data: {
        ...savingSessionData,
        evaluationId: matchedEvaluation.id,
        MistakeInSession: {
          create: mistakes.map((m) => ({
            page: m.pageNumber,
            mistake: { connect: { id: m.mistakeId } },
          })),
        },
      },
      include: {
        MistakeInSession: {
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
        MistakeInSession: {
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
        MistakeInSession: {
          include: { mistake: true },
        },
        student: true,
        teacher: true,
        campaign: true,
      },
    });
  }

  async filter(dto: FilterSavingSessionDto) {
    const { studentId, teacherId, mistakeId, campaignId, dateFrom, dateTo } =
      dto;

    const where: Prisma.SavingSessionWhereInput = {
      ...(studentId ? { studentId: Number(studentId) } : {}),
      ...(teacherId ? { teacherId: Number(teacherId) } : {}),
      ...(campaignId ? { campaignId: Number(campaignId) } : {}),
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
        MistakeInSession: {
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
      mistakes: el.MistakeInSession?.map((item) => ({
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
