import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateMistakeDto,
  UpdateMistakeDto,
  ValidateMistakeIdDto,
} from '../dto/mistake.dto';

@Injectable()
export class MistakeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMistakeDto) {
    return this.prisma.mistake.create({
      data: {
        campaignId: dto.campaign_id,
        title: dto.title,
        removed_points: dto.removed_points,
      },
    });
  }

  async findAll() {
    return this.prisma.mistake.findMany();
  }

  async findOne(params: ValidateMistakeIdDto) {
    const mistake = await this.prisma.mistake.findUnique({
      where: { id: params.id },
    });

    if (!mistake) {
      throw new NotFoundException(`Mistake with ID ${params.id} not found`);
    }

    return mistake;
  }

  async update(params: ValidateMistakeIdDto, dto: UpdateMistakeDto) {
    const mistake = await this.prisma.mistake.findUnique({
      where: { id: params.id },
    });

    if (!mistake) {
      throw new NotFoundException(`Mistake with ID ${params.id} not found`);
    }

    return this.prisma.mistake.update({
      where: { id: params.id },
      data: dto,
    });
  }

  async delete(params: ValidateMistakeIdDto) {
    const mistake = await this.prisma.mistake.findUnique({
      where: { id: params.id },
    });

    if (!mistake) {
      throw new NotFoundException(`Mistake with ID ${params.id} not found`);
    }

    return this.prisma.mistake.delete({
      where: { id: params.id },
    });
  }

  async findByCampaign(campaignId: number) {
    return this.prisma.mistake.findMany({
      where: { campaignId: Number(campaignId) },
    });
  }

  async assertCampaignMistakes(
    campaignId: number,
    mistakes: Array<{ id?: number; title: string; removed_points: number }>,
  ) {
    // 1. Get current mistakes for this campaign
    const existing = await this.prisma.mistake.findMany({
      where: { campaignId },
    });

    const incomingIds = new Set(mistakes.filter((m) => m.id).map((m) => m.id));
    const existingIds = new Set(existing.map((m) => m.id));

    // 2. Update or create
    for (const item of mistakes) {
      if (item.id && existingIds.has(item.id)) {
        const current = existing.find((m) => m.id === item.id);
        if (
          current?.title !== item.title ||
          current?.removed_points !== item.removed_points
        ) {
          await this.prisma.mistake.update({
            where: { id: item.id },
            data: {
              title: item.title,
              removed_points: item.removed_points,
            },
          });
        }
      } else {
        await this.prisma.mistake.create({
          data: {
            campaignId,
            title: item.title,
            removed_points: item.removed_points,
          },
        });
      }
    }

    // 3. Delete mistakes not in incoming list
    const toDelete = existing.filter((m) => !incomingIds.has(m.id));
    for (const m of toDelete) {
      await this.prisma.mistake.delete({ where: { id: m.id } });
    }

    return { message: 'Campaign mistakes synced successfully.' };
  }
}
