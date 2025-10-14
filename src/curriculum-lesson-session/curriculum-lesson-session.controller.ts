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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { CurriculumLessonSessionService } from './curriculum-lesson-session.service';
import {
  CreateCurriculumLessonSessionDto,
  UpdateCurriculumLessonSessionDto,
  CurriculumLessonSessionResponseDto,
} from '../dto/curriculum-lesson-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Curriculum Management')
@ApiBearerAuth()
@Controller('curriculum-lesson-session')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CurriculumLessonSessionController {
  constructor(
    private readonly curriculumLessonSessionService: CurriculumLessonSessionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new curriculum lesson session',
    description:
      'Creates a new lesson session for a specific curriculum node, group, and teacher',
  })
  @ApiBody({
    type: CreateCurriculumLessonSessionDto,
    description: 'Lesson session creation data',
  })
  @ApiCreatedResponse({
    description: 'Lesson session created successfully',
    type: CurriculumLessonSessionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async create(
    @Body() createSessionDto: CreateCurriculumLessonSessionDto,
  ): Promise<CurriculumLessonSessionResponseDto> {
    return this.curriculumLessonSessionService.create(createSessionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all curriculum lesson sessions',
    description:
      'Retrieves all lesson sessions with optional filtering by campaign, group, teacher, or node',
  })
  @ApiQuery({
    name: 'campaignId',
    required: false,
    type: 'string',
    description: 'Filter by campaign ID',
  })
  @ApiQuery({
    name: 'groupId',
    required: false,
    type: 'string',
    description: 'Filter by group ID',
  })
  @ApiQuery({
    name: 'teacherId',
    required: false,
    type: 'string',
    description: 'Filter by teacher ID',
  })
  @ApiQuery({
    name: 'nodeId',
    required: false,
    type: 'string',
    description: 'Filter by curriculum node ID',
  })
  @ApiOkResponse({
    description: 'List of lesson sessions retrieved successfully',
    type: [CurriculumLessonSessionResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
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
  @ApiOperation({
    summary: 'Get lesson sessions by node and group',
    description:
      'Retrieves all lesson sessions for a specific curriculum node and group combination',
  })
  @ApiParam({
    name: 'nodeId',
    type: 'number',
    description: 'The curriculum node ID',
  })
  @ApiParam({
    name: 'groupId',
    type: 'number',
    description: 'The group ID',
  })
  @ApiOkResponse({
    description: 'Lesson sessions retrieved successfully',
    type: [CurriculumLessonSessionResponseDto],
  })
  @ApiNotFoundResponse({ description: 'Node or group not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
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
  @ApiOperation({
    summary: 'Get all lesson sessions for a group',
    description:
      'Retrieves all lesson sessions for a specific group across all curriculum nodes',
  })
  @ApiParam({
    name: 'groupId',
    type: 'number',
    description: 'The group ID',
  })
  @ApiOkResponse({
    description: 'Group lesson sessions retrieved successfully',
    type: [CurriculumLessonSessionResponseDto],
  })
  @ApiNotFoundResponse({ description: 'Group not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findAllByGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<CurriculumLessonSessionResponseDto[]> {
    return this.curriculumLessonSessionService.findAllByGroup(groupId);
  }

  @Get('group/:groupId/current-node')
  @ApiOperation({
    summary: 'Get current curriculum node for a group',
    description:
      'Retrieves the current curriculum node and progress information for a specific group',
  })
  @ApiParam({
    name: 'groupId',
    type: 'number',
    description: 'The group ID',
  })
  @ApiOkResponse({
    description: 'Current node and progress retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        node: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            node_type: { type: 'string', nullable: true },
            order_index: { type: 'number' },
            lesson_span: { type: 'number', nullable: true },
            status: { type: 'string' },
          },
        },
        progress: {
          type: 'object',
          properties: {
            total_lessons: { type: 'number' },
            completed_lessons: { type: 'number' },
            late_lessons: { type: 'number' },
            is_over_span: { type: 'boolean' },
            last_lesson_date: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },
      },
      nullable: true,
    },
  })
  @ApiNotFoundResponse({ description: 'Group not found or no current node' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
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
  @ApiOperation({
    summary: 'Get lesson progress for a node and group',
    description:
      'Retrieves detailed progress information including session count, late lessons, and span status for a specific node and group',
  })
  @ApiParam({
    name: 'nodeId',
    type: 'number',
    description: 'The curriculum node ID',
  })
  @ApiParam({
    name: 'groupId',
    type: 'number',
    description: 'The group ID',
  })
  @ApiOkResponse({
    description: 'Lesson progress retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total_lessons: {
          type: 'number',
          description: 'Total number of lessons',
        },
        late_lessons: { type: 'number', description: 'Number of late lessons' },
        lesson_span: {
          type: 'number',
          nullable: true,
          description: 'Expected lesson span for the node',
        },
        is_over_span: {
          type: 'boolean',
          description: 'Whether the lessons exceed the expected span',
        },
        sessions: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/CurriculumLessonSessionResponseDto',
          },
          description: 'List of lesson sessions',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Node or group not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
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
  @ApiOperation({
    summary: 'Get a lesson session by ID',
    description: 'Retrieves a specific lesson session by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The lesson session ID',
  })
  @ApiOkResponse({
    description: 'Lesson session retrieved successfully',
    type: CurriculumLessonSessionResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Lesson session not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CurriculumLessonSessionResponseDto> {
    return this.curriculumLessonSessionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a lesson session',
    description: 'Updates an existing lesson session with new data',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The lesson session ID to update',
  })
  @ApiBody({
    type: UpdateCurriculumLessonSessionDto,
    description: 'Updated lesson session data',
  })
  @ApiOkResponse({
    description: 'Lesson session updated successfully',
    type: CurriculumLessonSessionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Lesson session not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateCurriculumLessonSessionDto,
  ): Promise<CurriculumLessonSessionResponseDto> {
    return this.curriculumLessonSessionService.update(id, updateSessionDto);
  }

  @Patch(':id/finish')
  @ApiOperation({
    summary: 'Mark a lesson session as finished',
    description:
      'Marks a lesson session as completed with optional duration and notes',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The lesson session ID to mark as finished',
  })
  @ApiBody({
    description: 'Finish data including duration and notes',
    schema: {
      type: 'object',
      properties: {
        duration_minutes: {
          type: 'number',
          nullable: true,
          description: 'Duration of the lesson in minutes',
        },
        notes: {
          type: 'string',
          nullable: true,
          description: 'Additional notes about the lesson',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Lesson session marked as finished successfully',
    type: CurriculumLessonSessionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Lesson session not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
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
  @ApiOperation({
    summary: 'Delete a lesson session',
    description: 'Permanently deletes a lesson session by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The lesson session ID to delete',
  })
  @ApiOkResponse({
    description: 'Lesson session deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Lesson session deleted successfully',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Lesson session not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.curriculumLessonSessionService.remove(id);
    return { message: 'Lesson session deleted successfully' };
  }
}
