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
import { SubjectSessionService } from './subject-session.service';
import {
  CreateSubjectSessionDto,
  UpdateSubjectSessionDto,
  SubjectSessionResponseDto,
} from '../dto/subject-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Curriculum Management')
@ApiBearerAuth()
@Controller('subject-session')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectSessionController {
  constructor(private readonly subjectSessionService: SubjectSessionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new subject session',
    description:
      'Creates a new session for a specific subject, group, and campaign',
  })
  @ApiBody({
    type: CreateSubjectSessionDto,
    description: 'Subject session creation data',
  })
  @ApiCreatedResponse({
    description: 'Subject session created successfully',
    type: SubjectSessionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(
    @Body() createSessionDto: CreateSubjectSessionDto,
  ): Promise<SubjectSessionResponseDto> {
    return this.subjectSessionService.create(createSessionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all subject sessions',
    description:
      'Retrieves all subject sessions with optional filtering by campaign, group, or subject',
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
    name: 'subjectId',
    required: false,
    type: 'string',
    description: 'Filter by subject ID',
  })
  @ApiOkResponse({
    description: 'List of subject sessions retrieved successfully',
    type: [SubjectSessionResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async findAll(
    @Query('campaignId') campaignId?: string,
    @Query('groupId') groupId?: string,
    @Query('subjectId') subjectId?: string,
  ): Promise<SubjectSessionResponseDto[]> {
    const campId = campaignId ? parseInt(campaignId, 10) : undefined;
    const grpId = groupId ? parseInt(groupId, 10) : undefined;
    const subId = subjectId ? parseInt(subjectId, 10) : undefined;

    return this.subjectSessionService.findAll(campId, grpId, subId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a subject session by ID',
    description: 'Retrieves a single subject session by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The subject session ID',
  })
  @ApiOkResponse({
    description: 'Subject session retrieved successfully',
    type: SubjectSessionResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Subject session not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SubjectSessionResponseDto> {
    return this.subjectSessionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a subject session',
    description: 'Updates an existing subject session',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The subject session ID',
  })
  @ApiBody({
    type: UpdateSubjectSessionDto,
    description: 'Subject session update data',
  })
  @ApiOkResponse({
    description: 'Subject session updated successfully',
    type: SubjectSessionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Subject session not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSubjectSessionDto,
  ): Promise<SubjectSessionResponseDto> {
    return this.subjectSessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a subject session',
    description: 'Deletes a subject session by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The subject session ID',
  })
  @ApiOkResponse({ description: 'Subject session deleted successfully' })
  @ApiNotFoundResponse({ description: 'Subject session not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.subjectSessionService.remove(id);
    return { message: 'Subject session deleted successfully' };
  }
}
