import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEvaluationDto, UpdateEvaluationDto } from './evaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateEvaluationDto) {
    return this.prisma.evaluation.create({ data });
  }

  async findAll(campaignId: string) {
    const evaluations = await this.prisma.evaluation.findMany({
      where: {
        campaign_id: Number(campaignId),
      },
      include: {
        sessions: true,
        portions: true,
        _count: {
          select: {
            sessions: true,
            portions: true,
          },
        },
      },
    });

    return evaluations.map((el) => ({
      ...el,
      sessions: undefined,
      portions: undefined,
      _count: undefined,
      is_related: !!el.sessions?.length || !!el.portions?.length,
      sessions_count: el._count.sessions,
      session_portions_count: el._count.portions,
    }));
  }

  async findByCampaign(campaignId: number) {
    return this.prisma.evaluation.findMany({
      where: { campaign_id: campaignId },
      include: {
        _count: {
          select: {
            sessions: true,
            portions: true,
          },
        },
      },
    });
  }

  async assert(campaignId: number, evaluations: UpdateEvaluationDto[]) {
    // 1. Get current evaluations for this campaign
    const existing = await this.prisma.evaluation.findMany({
      where: { campaign_id: campaignId },
    });

    const incomingIds = new Set(
      evaluations.filter((e) => e.id).map((e) => e.id),
    );
    const existingIds = new Set(existing.map((e) => e.id));

    // 2. Update or create
    for (const item of evaluations) {
      if (item.id && existingIds.has(item.id)) {
        const current = existing.find((e) => e.id === item.id);
        if (
          current?.title !== item.title ||
          current?.points !== item.points ||
          current?.minimum_marks !== item.minimum_marks ||
          current?.is_passed !== item.is_passed
        ) {
          await this.prisma.evaluation.update({
            where: { id: item.id },
            data: {
              title: item.title,
              points: item.points,
              minimum_marks: item.minimum_marks,
              is_passed: item.is_passed,
            },
          });
        }
      } else {
        await this.prisma.evaluation.create({
          data: {
            campaign_id: campaignId,
            title: item.title,
            points: item.points,
            minimum_marks: item.minimum_marks,
            is_passed: item.is_passed ?? true,
          },
        });
      }
    }

    // 3. Delete evaluations not in incoming list (only if they're not being used)
    const toDelete = existing.filter((e) => !incomingIds.has(e.id));
    for (const e of toDelete) {
      const usage = await this.prisma.evaluation.findUnique({
        where: { id: e.id },
        include: {
          _count: {
            select: {
              sessions: true,
              portions: true,
            },
          },
        },
      });

      if (
        usage &&
        (usage._count.sessions > 0 || usage._count.portions > 0)
      ) {
        throw new Error(
          `Cannot delete evaluation "${e.title}" as it is being used in ${usage._count.sessions} sessions and ${usage._count.portions} portions.`,
        );
      }

      await this.prisma.evaluation.delete({ where: { id: e.id } });
    }

    return { message: 'Campaign evaluations synced successfully.' };
  }

  async findById(id: number) {
    return this.prisma.evaluation.findUnique({
      where: { id },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            sessions: true,
            portions: true,
          },
        },
      },
    });
  }

  async update(id: number, data: Partial<CreateEvaluationDto>) {
    return this.prisma.evaluation.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            sessions: true,
            portions: true,
          },
        },
      },
    });

    if (!evaluation) {
      throw new Error('Evaluation not found');
    }

    if (
      evaluation._count.sessions > 0 ||
      evaluation._count.portions > 0
    ) {
      throw new Error(
        `Cannot delete evaluation "${evaluation.title}" as it is being used in ${evaluation._count.sessions} sessions and ${evaluation._count.portions} portions.`,
      );
    }

    return this.prisma.evaluation.delete({
      where: { id },
    });
  }

  async getEvaluationStats(campaignId: number) {
    const evaluations = await this.prisma.evaluation.findMany({
      where: { campaign_id: campaignId },
      include: {
        _count: {
          select: {
            sessions: true,
            portions: true,
          },
        },
      },
    });

    const totalEvaluations = evaluations.length;
    const usedEvaluations = evaluations.filter(
      (e) => e._count.sessions > 0 || e._count.portions > 0,
    ).length;
    const totalSessions = evaluations.reduce(
      (sum, e) => sum + e._count.sessions,
      0,
    );
    const totalPortions = evaluations.reduce(
      (sum, e) => sum + e._count.portions,
      0,
    );

    return {
      totalEvaluations,
      usedEvaluations,
      unusedEvaluations: totalEvaluations - usedEvaluations,
      totalSessions,
      totalPortions,
      evaluations: evaluations.map((e) => ({
        id: e.id,
        title: e.title,
        points: e.points,
        minimum_marks: e.minimum_marks,
        is_passed: e.is_passed,
        sessions_count: e._count.sessions,
        session_portions_count: e._count.portions,
        is_used: e._count.sessions > 0 || e._count.portions > 0,
      })),
    };
  }
}
