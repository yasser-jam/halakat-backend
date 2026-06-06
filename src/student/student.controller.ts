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
  ApiQuery,
} from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto, ListStudentsQueryDto } from './student.dto';
import { UpdateStudentDto } from '../dto/student.dto';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}

  @Get('all')
  @ApiOperation({
    summary: 'Get all students (paginated, all mosques)',
    description:
      'Returns all students across all mosques with pagination, search, and filters',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by first name, last name, or mobile',
  })
  @ApiQuery({
    name: 'mosqueIds',
    required: false,
    type: String,
    description: 'Comma-separated mosque IDs',
  })
  @ApiQuery({ name: 'educational_class', required: false, type: Number })
  @ApiQuery({ name: 'in_another_mosque', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Paginated list of all students' })
  async findAll(@Query() query: ListStudentsQueryDto) {
    const filters: {
      mosqueIds?: number[];
      search?: string;
      educational_class?: number;
      in_another_mosque?: boolean;
      page?: number;
      limit?: number;
    } = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    };

    if (query.mosqueIds) {
      filters.mosqueIds = query.mosqueIds.split(',').map((id) => Number(id));
    }

    if (query.search) {
      filters.search = query.search;
    }

    if (query.educational_class !== undefined) {
      filters.educational_class = Number(query.educational_class);
    }

    if (query.in_another_mosque !== undefined) {
      filters.in_another_mosque =
        query.in_another_mosque === true ||
        String(query.in_another_mosque) === 'true';
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
  @ApiHeader({
    name: 'campaign_id',
    description: 'Campaign ID to auto-enroll the student (optional)',
    required: false,
  })
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Headers('campaign_id') campaignId?: string,
  ) {
    return this.studentService.create(
      createStudentDto,
      campaignId ? Number(campaignId) : undefined,
    );
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
