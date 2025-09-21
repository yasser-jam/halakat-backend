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
      sessionSurahs,
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
        session_surahs: {
          create: sessionSurahs.map((surah) => ({
            template_id: surah.templateId,
            isPassed: surah.isPassed,
            score: surah.score,
            notes: surah.notes,
            mistakes: {
              create: surah.mistakes?.map((mistake) => ({
                mistake_id: mistake.mistakeId,
              })) || [],
            },
          })),
        },
      },
      include: {
        session_surahs: {
          include: {
            template: true,
            mistakes: {
              include: { mistake: true },
            },
          },
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
        session_surahs: {
          include: {
            template: true,
            mistakes: {
              include: { mistake: true },
            },
          },
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
        session_surahs: {
          include: {
            template: true,
            mistakes: {
              include: { mistake: true },
            },
          },
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
      ...(studentId ? { student_id: Number(studentId) } : {}),
      ...(teacherId ? { teacher_id: Number(teacherId) } : {}),
      ...(campaign_id ? { campaign_id: Number(campaign_id) } : {}),
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
            session_surahs: {
              some: {
                mistakes: {
                  some: {
                    mistake_id: Number(mistakeId),
                  },
                },
              },
            },
          }
        : {}),
    };

    const res = await this.prisma.savingSession.findMany({
      where,
      include: {
        session_surahs: {
          include: {
            template: true,
            mistakes: {
              include: { mistake: true },
            },
          },
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
      sessionSurahs: el.session_surahs?.map((surah) => ({
        id: surah.id,
        templateId: surah.template_id,
        isPassed: surah.isPassed,
        score: surah.score,
        notes: surah.notes,
        surahNumber: surah.template.surahNumber,
        pageNumber: surah.template.pageNumber,
        weight: surah.template.weight,
        mistakes: surah.mistakes?.map((mistake) => ({
          id: mistake.id,
          title: mistake.mistake?.title,
          reducedMarks: mistake.mistake?.reduced_marks,
        })),
      })),
    }));
  }

  async remove(id: number) {
    return this.prisma.savingSession.delete({
      where: { id },
    });
  }
}
