import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLogDto } from './log.dto';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async create(createLogDto: CreateLogDto, campaignId: number) {
    const log = await this.prisma.log.create({
      data: {
        event: createLogDto.event,
        teacher_id: createLogDto.teacher_id,
        student_id: createLogDto.student_id,
        notes: createLogDto.notes,
        metadata: createLogDto.metadata,
        // Note: campaign_id and group_id will be available after Prisma client regeneration
        // For now, we'll add them manually to the data object
        campaign_id: campaignId,
        group_id: createLogDto.group_id,
      } as any, // Using 'as any' temporarily until Prisma client is regenerated
      include: {
        teacher: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            mobile_phone_number: true,
          },
        },
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            student_mobile: true,
          },
        },
      } as any, // Using 'as any' temporarily until Prisma client is regenerated
    });

    return { message: 'Log created successfully', data: log };
  }

  async delete(id: number) {
    const log = await this.prisma.log.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!log) {
      throw new NotFoundException(`Log with ID ${id} not found`);
    }

    await this.prisma.log.delete({ where: { id } });

    return {
      message: `Log ${id} deleted successfully`,
      data: log,
    };
  }

  async findAll(campaignId?: number) {
    const whereClause = campaignId ? { campaign_id: campaignId } : {};

    const logs = await this.prisma.log.findMany({
      where: whereClause as any, // Using 'as any' temporarily until Prisma client is regenerated
      include: {
        teacher: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            mobile_phone_number: true,
          },
        },
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            student_mobile: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return { message: 'Logs retrieved successfully', data: logs };
  }

  async findOne(id: number) {
    const log = await this.prisma.log.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            mobile_phone_number: true,
          },
        },
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            student_mobile: true,
          },
        },
      },
    });

    if (!log) {
      throw new NotFoundException(`Log with ID ${id} not found`);
    }

    return { message: 'Log retrieved successfully', data: log };
  }

  async findByCampaign(campaignId: number) {
    const logs = await this.prisma.log.findMany({
      where: { campaign_id: campaignId } as any, // Using 'as any' temporarily until Prisma client is regenerated
      include: {
        teacher: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            mobile_phone_number: true,
          },
        },
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            student_mobile: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      message: `Logs for campaign ${campaignId} retrieved successfully`,
      data: logs,
    };
  }
}
