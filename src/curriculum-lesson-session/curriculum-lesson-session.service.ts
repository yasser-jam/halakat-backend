import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { 
  CreateCurriculumLessonSessionDto, 
  UpdateCurriculumLessonSessionDto, 
  CurriculumLessonSessionResponseDto 
} from '../dto/curriculum-lesson-session.dto';
import { NodeStatus } from '@prisma/client';

@Injectable()
export class CurriculumLessonSessionService {
  constructor(private prisma: PrismaService) {}

  async create(createSessionDto: CreateCurriculumLessonSessionDto): Promise<CurriculumLessonSessionResponseDto> {
    // Verify lesson node exists and get its lesson_span
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

    // Determine if this lesson is late (exceeds node's lesson_span)
    const isLate = lessonNode.lesson_span ? createSessionDto.session_number > lessonNode.lesson_span : false;

    const sessionData = {
      ...createSessionDto,
      date: createSessionDto.date ? new Date(createSessionDto.date) : null,
      is_late: createSessionDto.is_late !== undefined ? createSessionDto.is_late : isLate,
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

    // Update node status if this is the first late lesson
    if (isLate && lessonNode.status !== NodeStatus.LATE) {
      await this.updateNodeStatusIfNeeded(createSessionDto.node_id, createSessionDto.group_id);
    }

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
      include: { lesson_node: true },
    });

    if (!existingSession) {
      throw new NotFoundException('Lesson session not found');
    }

    // Verify lesson node exists if provided
    let lessonNode = existingSession.lesson_node;
    if (updateSessionDto.node_id && updateSessionDto.node_id !== existingSession.node_id) {
      lessonNode = await this.prisma.curriculumTemplateNode.findUnique({
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

      // Check if session becomes late due to updates
      if (updateSessionDto.session_number && lessonNode?.lesson_span) {
        const wouldBeLate = sessionNumber > lessonNode.lesson_span;
        if (updateSessionDto.is_late === undefined) {
          updateSessionDto.is_late = wouldBeLate;
        }
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

    // Update node status if needed
    if (updateSessionDto.is_late || (updateSessionDto.session_number && lessonNode?.lesson_span && updateSessionDto.session_number > lessonNode.lesson_span)) {
      await this.updateNodeStatusIfNeeded(session.node_id, session.group_id);
    }

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
      is_late: session.is_late,
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

  /**
   * Updates node status based on lesson progress
   * Sets status to LATE if any lessons exceed the span
   * Sets status to IN_PROGRESS if lessons exist but within span
   */
  private async updateNodeStatusIfNeeded(nodeId: number, groupId: number): Promise<void> {
    const node = await this.prisma.curriculumTemplateNode.findUnique({
      where: { id: nodeId },
    });

    if (!node || !node.lesson_span) {
      return; // No span defined, no status update needed
    }

    // Check if there are any late lessons for this node and group
    const lateLessonsCount = await this.prisma.curriculumLessonSession.count({
      where: {
        node_id: nodeId,
        group_id: groupId,
        is_late: true,
      },
    });

    // Check total lessons for this node and group
    const totalLessonsCount = await this.prisma.curriculumLessonSession.count({
      where: {
        node_id: nodeId,
        group_id: groupId,
      },
    });

    let newStatus = node.status;

    if (lateLessonsCount > 0) {
      newStatus = NodeStatus.LATE;
    } else if (totalLessonsCount > 0 && node.status === NodeStatus.PLANNED) {
      newStatus = NodeStatus.IN_PROGRESS;
    }

    // Update node status if it changed
    if (newStatus !== node.status) {
      await this.prisma.curriculumTemplateNode.update({
        where: { id: nodeId },
        data: { status: newStatus },
      });
    }
  }

  /**
   * Get node information including lesson span
   */
  async getNodeInfo(nodeId: number): Promise<{ lesson_span: number | null } | null> {
    const node = await this.prisma.curriculumTemplateNode.findUnique({
      where: { id: nodeId },
      select: { lesson_span: true },
    });
    
    return node;
  }

  /**
   * Get all lessons for a specific group across all nodes
   */
  async findAllByGroup(groupId: number): Promise<CurriculumLessonSessionResponseDto[]> {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const sessions = await this.prisma.curriculumLessonSession.findMany({
      where: {
        group_id: groupId,
      },
      include: {
        lesson_node: true,
        group: true,
        teacher: true,
        campaign: true,
      },
      orderBy: [
        { lesson_node: { order_index: 'asc' } },
        { session_number: 'asc' },
        { created_at: 'asc' },
      ],
    });

    return sessions.map(session => this.mapToResponseDto(session));
  }

  /**
   * Get the current node for a group (the most recent node with lessons)
   */
  async getCurrentNodeForGroup(groupId: number): Promise<{
    node: {
      id: number;
      name: string;
      description?: string;
      node_type?: string;
      order_index: number;
      lesson_span?: number;
      status: string;
    };
    progress: {
      total_lessons: number;
      completed_lessons: number;
      late_lessons: number;
      is_over_span: boolean;
      last_lesson_date?: Date;
    };
  } | null> {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Find the most recent lesson session for this group
    const latestSession = await this.prisma.curriculumLessonSession.findFirst({
      where: {
        group_id: groupId,
      },
      include: {
        lesson_node: true,
      },
      orderBy: [
        { created_at: 'desc' },
        { session_number: 'desc' },
      ],
    });

    if (!latestSession) {
      return null; // No lessons yet for this group
    }

    const currentNode = latestSession.lesson_node;

    // Get all lessons for this node and group to calculate progress
    const nodeLessons = await this.prisma.curriculumLessonSession.findMany({
      where: {
        node_id: currentNode.id,
        group_id: groupId,
      },
      orderBy: { session_number: 'asc' },
    });

    const totalLessons = nodeLessons.length;
    const completedLessons = nodeLessons.filter(lesson => lesson.is_finished).length;
    const lateLessons = nodeLessons.filter(lesson => lesson.is_late).length;
    const isOverSpan = currentNode.lesson_span ? totalLessons > currentNode.lesson_span : false;
    const lastLessonDate = nodeLessons.length > 0 ? 
      nodeLessons[nodeLessons.length - 1].date || nodeLessons[nodeLessons.length - 1].created_at : 
      undefined;

    return {
      node: {
        id: currentNode.id,
        name: currentNode.name,
        description: currentNode.description,
        node_type: currentNode.node_type,
        order_index: currentNode.order_index,
        lesson_span: currentNode.lesson_span,
        status: currentNode.status,
      },
      progress: {
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        late_lessons: lateLessons,
        is_over_span: isOverSpan,
        last_lesson_date: lastLessonDate,
      },
    };
  }
}
