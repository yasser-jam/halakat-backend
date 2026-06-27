import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LogService } from '../log/log.service';
import {
  CreateSubjectSessionDto,
  UpdateSubjectSessionDto,
  SubjectSessionResponseDto,
} from '../dto/subject-session.dto';
import { Group, Subject } from '@prisma/client';

@Injectable()
export class SubjectSessionService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

  async create(
    createSessionDto: CreateSubjectSessionDto,
  ): Promise<SubjectSessionResponseDto> {
    const { subject, group } = await this.validateSessionRelations(
      createSessionDto.subject_id,
      createSessionDto.group_id,
      createSessionDto.campaign_id,
    );

    const session = await this.prisma.subjectSession.create({
      data: createSessionDto,
    });

    try {
      await this.logService.create(
        {
          event: 'SESSION_CREATED',
          group_id: group.id,
          notes: `تم إنشاء جلسة جديدة: ${session.title}`,
          metadata: {
            subject_session_id: session.id,
            session_title: session.title,
            subject_title: subject.title,
            group: {
              id: group.id,
              title: group.title,
              class: group.class,
            },
          },
        },
        createSessionDto.campaign_id,
      );
    } catch (error) {
      console.error('Failed to create log for subject session:', error);
    }

    return this.mapToResponseDto(session);
  }

  async findAll(
    campaignId?: number,
    groupId?: number,
    subjectId?: number,
  ): Promise<SubjectSessionResponseDto[]> {
    const where: {
      campaign_id?: number;
      group_id?: number;
      subject_id?: number;
    } = {};
    if (campaignId) where.campaign_id = campaignId;
    if (groupId) where.group_id = groupId;
    if (subjectId) where.subject_id = subjectId;

    const sessions = await this.prisma.subjectSession.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return sessions.map((session) => this.mapToResponseDto(session));
  }

  async findOne(id: number): Promise<SubjectSessionResponseDto> {
    const session = await this.prisma.subjectSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Subject session not found');
    }

    return this.mapToResponseDto(session);
  }

  async update(
    id: number,
    updateSessionDto: UpdateSubjectSessionDto,
  ): Promise<SubjectSessionResponseDto> {
    const existingSession = await this.prisma.subjectSession.findUnique({
      where: { id },
    });

    if (!existingSession) {
      throw new NotFoundException('Subject session not found');
    }

    const subjectId = updateSessionDto.subject_id ?? existingSession.subject_id;
    const groupId = updateSessionDto.group_id ?? existingSession.group_id;
    const campaignId =
      updateSessionDto.campaign_id ?? existingSession.campaign_id;

    if (
      updateSessionDto.subject_id ||
      updateSessionDto.group_id ||
      updateSessionDto.campaign_id
    ) {
      await this.validateSessionRelations(subjectId, groupId, campaignId);
    }

    const session = await this.prisma.subjectSession.update({
      where: { id },
      data: updateSessionDto,
    });

    return this.mapToResponseDto(session);
  }

  async remove(id: number): Promise<void> {
    const session = await this.prisma.subjectSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Subject session not found');
    }

    await this.prisma.subjectSession.delete({
      where: { id },
    });
  }

  private async validateSessionRelations(
    subjectId: number,
    groupId: number,
    campaignId: number,
  ): Promise<{ subject: Subject; group: Group }> {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new BadRequestException('Subject not found');
    }

    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) {
      throw new BadRequestException('Group not found');
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { mosque: true },
    });
    if (!campaign) {
      throw new BadRequestException('Campaign not found');
    }

    const groupCampaign = await this.prisma.groupCampaigns.findUnique({
      where: {
        group_id_campaign_id: {
          group_id: groupId,
          campaign_id: campaignId,
        },
      },
    });
    if (!groupCampaign) {
      throw new BadRequestException('Group is not enrolled in this campaign');
    }

    if (
      subject.organization_id !== null &&
      subject.organization_id !== campaign.mosque.organization_id
    ) {
      throw new BadRequestException(
        'Subject does not belong to the same organization as the campaign',
      );
    }

    return { subject, group };
  }

  private mapToResponseDto(session: {
    id: number;
    subject_id: number;
    group_id: number;
    campaign_id: number;
    title: string;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
  }): SubjectSessionResponseDto {
    return {
      id: session.id,
      subject_id: session.subject_id,
      group_id: session.group_id,
      campaign_id: session.campaign_id,
      title: session.title,
      notes: session.notes ?? undefined,
      created_at: session.created_at,
      updated_at: session.updated_at,
    };
  }
}
