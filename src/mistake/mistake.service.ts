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
}
