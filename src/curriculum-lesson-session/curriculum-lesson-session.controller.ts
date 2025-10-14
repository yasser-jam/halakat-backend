import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurriculumLessonSessionService } from './curriculum-lesson-session.service';
import {
  CreateCurriculumLessonSessionDto,
  UpdateCurriculumLessonSessionDto,
  CurriculumLessonSessionResponseDto,
} from '../dto/curriculum-lesson-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Curriculum Management')
@Controller('curriculum-lesson-session')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CurriculumLessonSessionController {
  constructor(
    private readonly curriculumLessonSessionService: CurriculumLessonSessionService,
  ) {}

  @Post()
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async create(
    @Body() createSessionDto: CreateCurriculumLessonSessionDto,
  ): Promise<CurriculumLessonSessionResponseDto> {
    return this.curriculumLessonSessionService.create(createSessionDto);
  }

  @Get()
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findAll(
    @Query('campaignId') campaignId?: string,
    @Query('groupId') groupId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('nodeId') nodeId?: string,
  ): Promise<CurriculumLessonSessionResponseDto[]> {
    const campId = campaignId ? parseInt(campaignId, 10) : undefined;
    const grpId = groupId ? parseInt(groupId, 10) : undefined;
    const tId = teacherId ? parseInt(teacherId, 10) : undefined;
    const nId = nodeId ? parseInt(nodeId, 10) : undefined;

    return this.curriculumLessonSessionService.findAll(campId, grpId, tId, nId);
  }

  @Get('by-node-group/:nodeId/:groupId')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findByNodeAndGroup(
    @Param('nodeId', ParseIntPipe) nodeId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<CurriculumLessonSessionResponseDto[]> {
    return this.curriculumLessonSessionService.findByNodeAndGroup(
      nodeId,
      groupId,
    );
  }

  @Get('group/:groupId')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findAllByGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<CurriculumLessonSessionResponseDto[]> {
    return this.curriculumLessonSessionService.findAllByGroup(groupId);
  }

  @Get('group/:groupId/current-node')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async getCurrentNodeForGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<{
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
    return this.curriculumLessonSessionService.getCurrentNodeForGroup(groupId);
  }

  @Get('progress/:nodeId/:groupId')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async getLessonProgress(
    @Param('nodeId', ParseIntPipe) nodeId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<{
    total_lessons: number;
    late_lessons: number;
    lesson_span?: number;
    is_over_span: boolean;
    sessions: CurriculumLessonSessionResponseDto[];
  }> {
    const sessions =
      await this.curriculumLessonSessionService.findByNodeAndGroup(
        nodeId,
        groupId,
      );
    const lateLessons = sessions.filter((session) => session.is_late).length;

    // Get node lesson span directly from service if needed
    let lessonSpan: number | undefined;
    let isOverSpan = false;

    if (sessions.length > 0) {
      // Get the lesson span from the node
      const nodeInfo =
        await this.curriculumLessonSessionService.getNodeInfo(nodeId);
      lessonSpan = nodeInfo?.lesson_span || undefined;
      isOverSpan = lessonSpan ? sessions.length > lessonSpan : false;
    }

    return {
      total_lessons: sessions.length,
      late_lessons: lateLessons,
      lesson_span: lessonSpan,
      is_over_span: isOverSpan,
      sessions,
    };
  }

  @Get(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CurriculumLessonSessionResponseDto> {
    return this.curriculumLessonSessionService.findOne(id);
  }

  @Patch(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateCurriculumLessonSessionDto,
  ): Promise<CurriculumLessonSessionResponseDto> {
    return this.curriculumLessonSessionService.update(id, updateSessionDto);
  }

  @Patch(':id/finish')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async markAsFinished(
    @Param('id', ParseIntPipe) id: number,
    @Body() finishData: { duration_minutes?: number; notes?: string },
  ): Promise<CurriculumLessonSessionResponseDto> {
    return this.curriculumLessonSessionService.markAsFinished(
      id,
      finishData.duration_minutes,
      finishData.notes,
    );
  }

  @Delete(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.curriculumLessonSessionService.remove(id);
    return { message: 'Lesson session deleted successfully' };
  }
}
