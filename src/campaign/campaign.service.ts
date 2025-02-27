import { CreateCampaignDto } from './../dto/campaign.dto';
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import { ValidateCampaginIdDto } from 'src/dto/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.campaign.findMany();
  }

  async create(createDto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: createDto
    });
  }

  async findOne(params: ValidateCampaginIdDto) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: Number(params.id) },
      include: {
        groups: {
          include: { group: true },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${params.id} not found`);
    }

    return {
      ...campaign,
      groups: campaign.groups.map(el => el.group)
    };
  }

  async update(params: ValidateCampaginIdDto, updateCampaignDto) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: Number(params.id) },
    });

    if (!campaign) {
      throw new NotFoundException(
        `Campaign with ID ${Number(params.id)} not found`,
      );
    }

    return this.prisma.campaign.update({
      where: { id: Number(params.id) },
      data: updateCampaignDto,
    });
  }

  async delete(params: ValidateCampaginIdDto) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: Number(params.id) },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${params.id} not found`);
    }

    return this.prisma.campaign.delete({
      where: { id: Number(params.id) },
    });
  }
}
