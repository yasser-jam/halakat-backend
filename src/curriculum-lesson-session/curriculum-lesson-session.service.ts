import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { 
  CreateCurriculumLessonSessionDto, 
  UpdateCurriculumLessonSessionDto, 
  CurriculumLessonSessionResponseDto 
} from '../dto/curriculum-lesson-session.dto';

@Injectable()
export class CurriculumLessonSessionService {
  constructor(private prisma: PrismaService) {}

  async create(createSessionDto: CreateCurriculumLessonSessionDto): Promise<CurriculumLessonSessionResponseDto> {
    // Verify lesson node exists
    const lessonNode = await this.prisma.curriculumTemplateNode.findUnique({
      where: { id: createSessionDto.node_id },
    });
    if (!lessonNode) {
      throw new BadRequestException('Lesson node not found');
    }

    // Verify group exists
    const group = await this.prisma.group.findUnique({
      where: { id: createSessionDto.group_id },
    });
    if (!group) {
      throw new BadRequestException('Group not found');
    }

    // Verify teacher exists
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: createSessionDto.teacher_id },
    });
    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }

    // Verify campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createSessionDto.campaign_id },
    });
    if (!campaign) {
      throw new BadRequestException('Campaign not found');
    }

    // Check if session with same node_id, group_id, and session_number already exists
    const existingSession = await this.prisma.curriculumLessonSession.findUnique({
      where: {
        node_id_group_id_session_number: {
          node_id: createSessionDto.node_id,
          group_id: createSessionDto.group_id,
          session_number: createSessionDto.session_number,
        },
      },
    });

    if (existingSession) {
      throw new BadRequestException('Session with this number already exists for this node and group');
    }

    const sessionData = {
      ...createSessionDto,
      date: createSessionDto.date ? new Date(createSessionDto.date) : null,
    };

    const session = await this.prisma.curriculumLessonSession.create({
      data: sessionData,
      include: {
        lesson_node: true,
        group: true,
        teacher: true,
        campaign: true,
      },
    });

    return this.mapToResponseDto(session);
  }

  async findAll(
    campaignId?: number,
    groupId?: number,
    teacherId?: number,
    nodeId?: number
  ): Promise<CurriculumLessonSessionResponseDto[]> {
    const where: any = {};
    if (campaignId) where.campaign_id = campaignId;
    if (groupId) where.group_id = groupId;
    if (teacherId) where.teacher_id = teacherId;
    if (nodeId) where.node_id = nodeId;

    const sessions = await this.prisma.curriculumLessonSession.findMany({
      where,
      include: {
        lesson_node: true,
        group: true,
        teacher: true,
        campaign: true,
      },
      orderBy: [
        { date: 'desc' },
        { session_number: 'asc' },
      ],
    });

    return sessions.map(session => this.mapToResponseDto(session));
  }

  async findOne(id: number): Promise<CurriculumLessonSessionResponseDto> {
    const session = await this.prisma.curriculumLessonSession.findUnique({
      where: { id },
      include: {
        lesson_node: true,
        group: true,
        teacher: true,
        campaign: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Lesson session not found');
    }

    return this.mapToResponseDto(session);
  }

  async findByNodeAndGroup(nodeId: number, groupId: number): Promise<CurriculumLessonSessionResponseDto[]> {
    const sessions = await this.prisma.curriculumLessonSession.findMany({
      where: {
        node_id: nodeId,
        group_id: groupId,
      },
      include: {
        lesson_node: true,
        group: true,
        teacher: true,
        campaign: true,
      },
      orderBy: { session_number: 'asc' },
    });

    return sessions.map(session => this.mapToResponseDto(session));
  }

  async update(id: number, updateSessionDto: UpdateCurriculumLessonSessionDto): Promise<CurriculumLessonSessionResponseDto> {
    const existingSession = await this.prisma.curriculumLessonSession.findUnique({
      where: { id },
    });

    if (!existingSession) {
      throw new NotFoundException('Lesson session not found');
    }

    // Verify lesson node exists if provided
    if (updateSessionDto.node_id) {
      const lessonNode = await this.prisma.curriculumTemplateNode.findUnique({
        where: { id: updateSessionDto.node_id },
      });
      if (!lessonNode) {
        throw new BadRequestException('Lesson node not found');
      }
    }

    // Verify group exists if provided
    if (updateSessionDto.group_id) {
      const group = await this.prisma.group.findUnique({
        where: { id: updateSessionDto.group_id },
      });
      if (!group) {
        throw new BadRequestException('Group not found');
      }
    }

    // Verify teacher exists if provided
    if (updateSessionDto.teacher_id) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: updateSessionDto.teacher_id },
      });
      if (!teacher) {
        throw new BadRequestException('Teacher not found');
      }
    }

    // Verify campaign exists if provided
    if (updateSessionDto.campaign_id) {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: updateSessionDto.campaign_id },
      });
      if (!campaign) {
        throw new BadRequestException('Campaign not found');
      }
    }

    // Check for unique constraint if key fields are being updated
    if (updateSessionDto.node_id || updateSessionDto.group_id || updateSessionDto.session_number) {
      const nodeId = updateSessionDto.node_id || existingSession.node_id;
      const groupId = updateSessionDto.group_id || existingSession.group_id;
      const sessionNumber = updateSessionDto.session_number || existingSession.session_number;

      const conflictingSession = await this.prisma.curriculumLessonSession.findUnique({
        where: {
          node_id_group_id_session_number: {
            node_id: nodeId,
            group_id: groupId,
            session_number: sessionNumber,
          },
        },
      });

      if (conflictingSession && conflictingSession.id !== id) {
        throw new BadRequestException('Session with this number already exists for this node and group');
      }
    }

    const updateData = {
      ...updateSessionDto,
      date: updateSessionDto.date ? new Date(updateSessionDto.date) : undefined,
    };

    const session = await this.prisma.curriculumLessonSession.update({
      where: { id },
      data: updateData,
      include: {
        lesson_node: true,
        group: true,
        teacher: true,
        campaign: true,
      },
    });

    return this.mapToResponseDto(session);
  }

  async remove(id: number): Promise<void> {
    const session = await this.prisma.curriculumLessonSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Lesson session not found');
    }

    await this.prisma.curriculumLessonSession.delete({
      where: { id },
    });
  }

  async markAsFinished(id: number, duration_minutes?: number, notes?: string): Promise<CurriculumLessonSessionResponseDto> {
    const session = await this.prisma.curriculumLessonSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Lesson session not found');
    }

    const updatedSession = await this.prisma.curriculumLessonSession.update({
      where: { id },
      data: {
        is_finished: true,
        duration_minutes,
        notes,
        date: session.date || new Date(), // Set date to now if not already set
      },
      include: {
        lesson_node: true,
        group: true,
        teacher: true,
        campaign: true,
      },
    });

    return this.mapToResponseDto(updatedSession);
  }

  private mapToResponseDto(session: any): CurriculumLessonSessionResponseDto {
    return {
      id: session.id,
      node_id: session.node_id,
      group_id: session.group_id,
      teacher_id: session.teacher_id,
      campaign_id: session.campaign_id,
      session_number: session.session_number,
      date: session.date,
      is_finished: session.is_finished,
      duration_minutes: session.duration_minutes,
      notes: session.notes,
      created_at: session.created_at,
      updated_at: session.updated_at,
      lesson_node: session.lesson_node ? {
        id: session.lesson_node.id,
        name: session.lesson_node.name,
        description: session.lesson_node.description,
        node_type: session.lesson_node.node_type,
        status: session.lesson_node.status,
      } : undefined,
      group: session.group ? {
        id: session.group.id,
        title: session.group.title,
      } : undefined,
      teacher: session.teacher ? {
        id: session.teacher.id,
        first_name: session.teacher.first_name,
        last_name: session.teacher.last_name,
      } : undefined,
      campaign: session.campaign ? {
        id: session.campaign.id,
        name: session.campaign.name,
      } : undefined,
    };
  }
}
