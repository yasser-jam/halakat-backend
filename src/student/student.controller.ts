import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Headers,
  BadRequestException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './student.dto';
import { UpdateStudentDto } from '../dto/student.dto';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, description: 'Return all students' })
  async findAll(@Query('mosqueIds') mosqueIds?: string) {
    const filters: { mosqueIds?: number[] } = {};

    // Parse mosque IDs if provided
    if (mosqueIds) {
      filters.mosqueIds = mosqueIds.split(',').map((id) => Number(id));
    }

    return this.studentService.findAll(filters);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully created.',
  })
  @ApiBody({ type: CreateStudentDto })
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Headers('campaign_id') campaignId: string,
  ) {
    if (!campaignId) {
      throw new BadRequestException('Campaign ID is required in headers');
    }
    return this.studentService.create(createStudentDto, Number(campaignId));
  }

  // List students for campaign
  @Get('')
  @ApiOperation({ summary: 'List students for campaign' })
  @ApiResponse({
    status: 200,
    description: 'List of students for the campaign',
  })
  async listStudentsForCampaign(@Headers('campaign_id') campaignId: string) {
    if (!campaignId) {
      throw new BadRequestException('Campaign ID is required in headers');
    }
    return this.studentService.findAllCampaign(campaignId);
  }

  // List un assigned
  @Get('unassigned')
  @ApiOperation({ summary: 'List un-assigned students in campaign' })
  @ApiHeader({ name: 'campaign_id' })
  @ApiResponse({ status: 200, description: 'List of unassigned students' })
  async listUnassigned(@Headers('campaign_id') campaignId: number) {
    return this.studentService.listUnassigned(Number(campaignId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return the student with the given ID',
  })
  async findOne(@Param('id') id: number) {
    return this.studentService.findOne(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a student by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully updated.',
  })
  @ApiBody({ type: UpdateStudentDto })
  async update(
    @Param('id') id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(Number(id), updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully deleted.',
  })
  async delete(@Param('id') id: number) {
    return this.studentService.delete(Number(id));
  }
}
