import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCampaignDto } from './campaign.dto';
import { UpdateCampaignDto } from '../dto/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async findAll(mosqueId?: number) {
    const campaigns = await this.prisma.campaign.findMany({
      where: { mosque_id: mosqueId },
    });
    return { message: 'All campaigns', data: campaigns };
  }

  async create(createDto: CreateCampaignDto) {
    const campaign = await this.prisma.campaign.create({ data: createDto });
    return { message: 'Campaign created', data: campaign };
  }

  async findOne(id: number) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return campaign;
  }

  async update(id: number, updateCampaignDto: UpdateCampaignDto) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: updateCampaignDto,
    });
    return { message: `Campaign ${id} updated`, data: updated };
  }

  async delete(id: number) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    await this.prisma.campaign.delete({ where: { id } });
    return { message: `Campaign ${id} deleted` };
  }

  // Additional methods for future use
  async current(id: number) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      return false;
    }
    // Example logic: check if current time is within campaign's start and end time
    const currentTime = new Date();
    const startTime = campaign.start_time
      ? new Date(`1970-01-01T${campaign.start_time}:00Z`)
      : null;
    const endTime = campaign.end_time
      ? new Date(`1970-01-01T${campaign.end_time}:00Z`)
      : null;
    if (
      startTime &&
      endTime &&
      currentTime >= startTime &&
      currentTime <= endTime
    ) {
      return campaign;
    }
    return false;
  }

  async findByTeacherId(
    teacherId: number,
    userRole: string,
    mosqueId?: number,
  ) {
    // If user is ORGANIZATION_ADMIN
    if (userRole === 'ORGANIZATION_ADMIN') {
      // If no mosque_id provided, return empty array
      if (!mosqueId) {
        return [];
      }

      // Return all campaigns for the specified mosque
      const campaigns = await this.prisma.campaign.findMany({
        where: {
          mosque_id: mosqueId,
        },
        select: {
          id: true,
          days: true,
          name: true,
          mosque: true,
        },
      });

      return campaigns;
    }

    // For other roles, return campaigns the teacher is assigned to
    const whereClause: any = {
      teacher_assignments: {
        some: {
          teacher_id: teacherId,
        },
      },
    };

    // Optionally filter by mosque_id if provided
    if (mosqueId) {
      whereClause.mosque_id = mosqueId;
    }

    const campaigns = await this.prisma.campaign.findMany({
      where: whereClause,
      select: {
        id: true,
        days: true,
        name: true,
        mosque: true,
      },
    });

    return campaigns;
  }

  async findByStudent(studentId: number) {
    // Find all campaignIds for this student
    const studentGroups = await this.prisma.studentGroup.findMany({
      where: { student_id: Number(studentId) },
      select: { campaign_id: true },
    });
    const campaignIds = studentGroups.map((sg) => sg.campaign_id);
    if (campaignIds.length === 0) return [];
    // Return all campaigns for these campaignIds
    return this.prisma.campaign.findMany({
      where: { id: { in: campaignIds } },
    });
  }
}
