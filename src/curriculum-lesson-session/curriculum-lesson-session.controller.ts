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
  CurriculumLessonSessionResponseDto 
} from '../dto/curriculum-lesson-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Permission } from '../role/permissions.enum';

@ApiTags('Curriculum Management')
@Controller('curriculum-lesson-session')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CurriculumLessonSessionController {
  constructor(private readonly curriculumLessonSessionService: CurriculumLessonSessionService) {}

  @Post()
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async create(@Body() createSessionDto: CreateCurriculumLessonSessionDto): Promise<CurriculumLessonSessionResponseDto> {
    return this.curriculumLessonSessionService.create(createSessionDto);
  }

  @Get()
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findAll(
    @Query('campaignId') campaignId?: string,
    @Query('groupId') groupId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('nodeId') nodeId?: string
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
    @Param('groupId', ParseIntPipe) groupId: number
  ): Promise<CurriculumLessonSessionResponseDto[]> {
    return this.curriculumLessonSessionService.findByNodeAndGroup(nodeId, groupId);
  }

  @Get(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CurriculumLessonSessionResponseDto> {
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
    @Body() finishData: { duration_minutes?: number; notes?: string }
  ): Promise<CurriculumLessonSessionResponseDto> {
    return this.curriculumLessonSessionService.markAsFinished(
      id, 
      finishData.duration_minutes, 
      finishData.notes
    );
  }

  @Delete(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.curriculumLessonSessionService.remove(id);
    return { message: 'Lesson session deleted successfully' };
  }
}
