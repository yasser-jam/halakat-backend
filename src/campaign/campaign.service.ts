import { CreateCampaignDto } from './../dto/campaign.dto';
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import { ValidateCampaginIdDto } from 'src/dto/campaign.dto';
import { Campaign } from '@prisma/client';

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
      //   groups: {
        // include: {
      //     include: { group: true },
      //   },
      // },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${params.id} not found`);
    }

    return {
      ...campaign,
      // groups: campaign.groups.map(el => el.group)
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

  async current(params: { id: number }): Promise<Campaign | boolean> {

    // Fetch the campaign by ID
    const campaign = await this.prisma.campaign.findUnique({
      where: {
        id: Number(params.id)
      }
    });
    
    if (!campaign) {
      return false; // Campaign not found, return false
    }

    const currentTime = new Date(); // Get current time
    const startTime = new Date(campaign.startTime); // Convert startTime from ISO string to Date
    const endTime = new Date(campaign.endTime); // Convert endTime from ISO string to Date

    // Check if current time is within the campaign's start and end time
    if (currentTime >= startTime && currentTime <= endTime) {
      return campaign; // Campaign is active, return campaign data
    }

    return false; // Campaign is not active, return false
  }

}



