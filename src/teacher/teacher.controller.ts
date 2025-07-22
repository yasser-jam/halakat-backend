import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './teacher.dto';

@ApiTags('teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiResponse({ status: 200, description: 'Return all teachers' })
  async findAll(@Headers('campaign_id') campaignId: string) {
    return this.teacherService.findAll(Number(campaignId));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiResponse({
    status: 201,
    description: 'The teacher has been successfully created.',
  })
  @ApiBody({ type: CreateTeacherDto })
  @ApiHeader({
    name: 'campaign_id',
    description: 'Campaign ID to filter permissions',
    required: true,
  })
  async create(
    @Body() createTeacherDto: CreateTeacherDto,
    @Headers('campaign_id') campaignId: string,
  ) {
    return this.teacherService.create(createTeacherDto, Number(campaignId));
  }

  @Get('unassigned')
  @ApiOperation({
    summary: 'List teachers in a campaign with no group assignments',
  })
  @ApiHeader({
    name: 'campaign_id',
    description: 'Campaign ID to filter teachers',
    required: true,
  })
  async listUnassigned(@Headers('campaign_id') campaignId: string) {
    return this.teacherService.listUnassigned(Number(campaignId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiHeader({ name: 'campaign_id' })
  @ApiResponse({
    status: 200,
    description: 'Return the teacher with the given ID',
  })
  async findOne(
    @Param('id') id: number,
    @Headers('campaign_id') campaign_id: string,
  ) {
    return this.teacherService.findOne(Number(id), campaign_id);
  }

  @Get('mobile/:id')
  @ApiOperation({ summary: 'Get a full teacher info by ID (for mobile)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return the teacher info with the given ID',
  })
  async findInfo(
    @Param('id') id: number,
    @Query('campaign_id') campaign_id: string,
  ) {
    return this.teacherService.findInfo(Number(id), campaign_id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a teacher by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The teacher has been successfully updated.',
  })
  @ApiBody({ type: CreateTeacherDto })
  async update(
    @Param('id') id: number,
    @Body() updateTeacherDto: CreateTeacherDto,
  ) {
    return this.teacherService.update(Number(id), updateTeacherDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The teacher has been successfully deleted.',
  })
  async delete(@Param('id') id: number) {
    return this.teacherService.delete(Number(id));
  }
}
