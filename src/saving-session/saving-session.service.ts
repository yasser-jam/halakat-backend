import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LogService } from '../log/log.service';

import {
  CreateRecitationSessionDto,
  FilterSavingSessionDto,
} from '../dto/saving.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SavingSessionService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

  private transformSession(raw: any) {
    return {
      id: raw.id,
      teacherId: raw.teacher_id,
      studentId: raw.student_id,
      campaignId: raw.campaign_id,
      evaluationId: raw.evaluation_id,
      rating: raw.rating,
      duration: raw.duration,
      totalScore: raw.total_score,
      status: raw.status,
      notes: raw.notes,
      created_at: raw.created_at,
      student: raw.student
        ? { id: raw.student.id, firstName: raw.student.first_name, lastName: raw.student.last_name }
        : undefined,
      teacher: raw.teacher
        ? { id: raw.teacher.id, firstName: raw.teacher.first_name, lastName: raw.teacher.last_name }
        : undefined,
      campaign: raw.campaign
        ? { id: raw.campaign.id, name: raw.campaign.name }
        : undefined,
      evaluation: raw.evaluation
        ? { id: raw.evaluation.id, title: raw.evaluation.title }
        : undefined,
      portions: raw.portions?.map((p: any) => ({
        id: p.id,
        portionType: p.portion_type,
        surahId: p.surah_id,
        surahNumber: p.surah?.surahNumber,
        surahName: p.surah?.surahName,
        surahWeight: p.surah?.weight,
        startPage: p.start_page,
        endPage: p.end_page,
        portionScore: p.portion_score,
        status: p.status,
        evaluationId: p.evaluation_id,
        notes: p.notes,
        errors: p.errors?.map((e: any) => ({
          id: e.id,
          mistakeId: e.mistake_id,
          pageNumber: e.page_number,
          title: e.mistake?.title,
          reducedMarks: e.mistake?.reduced_marks,
        })),
      })),
    };
  }

  async create(dto: CreateRecitationSessionDto) {
    const sessionEval = await this.prisma.evaluation.findUnique({
      where: { id: dto.evaluation_id },
    });
    if (!sessionEval) {
      throw new BadRequestException('Evaluation not found');
    }

    const seen = new Set<string>();
    const uniquePages = dto.pages.filter((p) => {
      const key = `${p.surah_number}-${p.page_number}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const templates = await this.prisma.sessionSurahTemplate.findMany({
      where: {
        OR: uniquePages.map((p) => ({
          surahNumber: p.surah_number,
          pageNumber: p.page_number,
        })),
      },
    });

    const templateMap = new Map<string, typeof templates[0]>();
    for (const t of templates) {
      templateMap.set(`${t.surahNumber}-${t.pageNumber}`, t);
    }

    for (const page of uniquePages) {
      if (!templateMap.has(`${page.surah_number}-${page.page_number}`)) {
        throw new BadRequestException(
          `لا يوجد قالب للسورة ${page.surah_number} والصفحة ${page.page_number}`,
        );
      }
    }

    const requestedIds = [...new Set(templates.map((t) => t.id))];
    if (requestedIds.length > 0) {
      const existing = await this.prisma.sessionPortion.findFirst({
        where: {
          surah_id: { in: requestedIds },
          session: {
            student_id: dto.studentId,
            campaign_id: dto.campaign_id,
          },
        },
      });
      if (existing) {
        throw new BadRequestException(
          'الطالب سمع هذا القسم خلال هذه الدورة من قبل',
        );
      }
    }

    const session = await this.prisma.recitationSession.create({
      data: {
        teacher_id: dto.teacherId,
        student_id: dto.studentId,
        campaign_id: dto.campaign_id,
        evaluation_id: dto.evaluation_id,
        rating: dto.rating,
        duration: dto.duration,
        notes: dto.notes,
        total_score: 100,
        status: 'PASSED',
      },
    });

    const sortedPages = [...uniquePages].sort(
      (a, b) => a.page_number - b.page_number,
    );

    let totalScore = 100;
    let hasFailedPortion = false;
    const portionRecords = [];

    for (const page of sortedPages) {
      if (hasFailedPortion) break;

      const template = templateMap.get(
        `${page.surah_number}-${page.page_number}`,
      )!;

      const evalId = page.evaluation_id ?? dto.evaluation_id;
      const evalRecord =
        evalId === dto.evaluation_id
          ? sessionEval
          : await this.prisma.evaluation.findUnique({ where: { id: evalId } });

      if (!evalRecord) {
        throw new BadRequestException(
          `التقييم ${evalId} غير موجود للصفحة ${page.page_number}`,
        );
      }

      let sumDeductions = 0;
      if (page.mistake_ids.length > 0) {
        const mistakes = await this.prisma.mistake.findMany({
          where: { id: { in: page.mistake_ids } },
        });
        sumDeductions = mistakes.reduce(
          (sum, m) => sum + m.reduced_marks,
          0,
        );
      }

      const pageScore = Math.max(0, 100 - sumDeductions);
      totalScore = Math.max(0, totalScore - sumDeductions);
      const passed = pageScore >= evalRecord.minimum_marks;

      if (!passed) {
        hasFailedPortion = true;
      }

      const portion = await this.prisma.sessionPortion.create({
        data: {
          session_id: session.id,
          portion_type: 'FULL_PAGE',
          surah_id: template.id,
          start_page: page.page_number,
          end_page: page.page_number,
          portion_score: pageScore,
          status: passed ? 'PASSED' : 'FAILED',
          evaluation_id: evalId,
          errors: {
            create: page.mistake_ids.map((mid) => ({
              mistake_id: mid,
              page_number: page.page_number,
            })),
          },
        },
        include: {
          errors: { include: { mistake: true } },
          surah: true,
          evaluation: true,
        },
      });
      portionRecords.push(portion);
    }

    const hasPassedPortion = portionRecords.some(
      (p) => p.status === 'PASSED',
    );
    let sessionStatus: string = 'PASSED';
    if (hasFailedPortion && hasPassedPortion) {
      sessionStatus = 'PARTIALLY_PASSED';
    } else if (hasFailedPortion && !hasPassedPortion) {
      sessionStatus = 'FAILED';
    }

    const updatedSession = await this.prisma.recitationSession.update({
      where: { id: session.id },
      data: {
        total_score: totalScore,
        status: sessionStatus as any,
      },
      include: {
        portions: {
          include: {
            errors: { include: { mistake: true } },
            surah: true,
            evaluation: true,
          },
        },
        evaluation: { select: { id: true, title: true } },
        student: { select: { id: true, first_name: true, last_name: true } },
        teacher: { select: { id: true, first_name: true, last_name: true } },
        campaign: { select: { id: true, name: true } },
      },
    });

    try {
      await this.logService.create(
        {
          event: 'SAVING_SESSION_CREATED',
          teacher_id: dto.teacherId,
          student_id: dto.studentId,
          notes: `تم إنشاء جلسة تسميع جديدة للطالب - التقييم: ${sessionEval.title} - الحالة: ${sessionStatus}`,
          metadata: {
            recitation_session_id: session.id,
            total_score: totalScore,
            status: sessionStatus,
          },
        },
        dto.campaign_id,
      );
    } catch (error) {
      console.error('Failed to create log for saving session:', error);
    }

    return this.transformSession(updatedSession);
  }

  async getAll() {
    const rows = await this.prisma.recitationSession.findMany({
      include: {
        portions: {
          include: {
            errors: { include: { mistake: true } },
            surah: true,
            evaluation: { select: { id: true, title: true } },
          },
        },
        evaluation: { select: { id: true, title: true } },
        student: { select: { id: true, first_name: true, last_name: true } },
        teacher: { select: { id: true, first_name: true, last_name: true } },
        campaign: { select: { id: true, name: true } },
      },
    });
    return rows.map((r) => this.transformSession(r));
  }

  async getById(id: number) {
    const raw = await this.prisma.recitationSession.findUnique({
      where: { id: Number(id) },
      include: {
        portions: {
          include: {
            errors: { include: { mistake: true } },
            surah: true,
            evaluation: { select: { id: true, title: true } },
          },
        },
        evaluation: { select: { id: true, title: true } },
        student: { select: { id: true, first_name: true, last_name: true } },
        teacher: { select: { id: true, first_name: true, last_name: true } },
        campaign: { select: { id: true, name: true } },
      },
    });
    return raw ? this.transformSession(raw) : null;
  }

  async filter(dto: FilterSavingSessionDto) {
    const { studentId, teacherId, mistakeId, campaign_id, evaluationId, dateFrom, dateTo } = dto;

    const where: Prisma.RecitationSessionWhereInput = {
      ...(studentId ? { student_id: Number(studentId) } : {}),
      ...(teacherId ? { teacher_id: Number(teacherId) } : {}),
      ...(campaign_id ? { campaign_id: Number(campaign_id) } : {}),
      ...(evaluationId ? { evaluation_id: Number(evaluationId) } : {}),
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
            portions: {
              some: {
                errors: {
                  some: {
                    mistake_id: Number(mistakeId),
                  },
                },
              },
            },
          }
        : {}),
    };

    const res = await this.prisma.recitationSession.findMany({
      where,
      include: {
        portions: {
          include: {
            errors: { include: { mistake: true } },
            surah: true,
            evaluation: { select: { id: true, title: true } },
          },
        },
        student: { select: { id: true, first_name: true, last_name: true } },
        teacher: { select: { id: true, first_name: true, last_name: true } },
        campaign: { select: { id: true, name: true } },
        evaluation: { select: { id: true, title: true } },
      },
    });

    return res.map((el) => this.transformSession(el));
  }

  async remove(id: number) {
    return this.prisma.recitationSession.delete({
      where: { id },
    });
  }
}
