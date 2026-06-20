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
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { StudentService } from './student.service';
import {
  CreateStudentDto,
  ListStudentsQueryDto,
  AssignStudentCampaignDto,
  PaginatedStudentsBasicResponseDto,
} from './student.dto';
import { UpdateStudentDto } from '../dto/student.dto';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}

  @Get('all')
  @ApiOperation({
    summary: 'Get all students (paginated, all mosques)',
    description:
      'Returns students with basic profile fields. Supports pagination, search, and filters. When campaign_id is provided, results are limited to students enrolled in that campaign and include their assigned group.',
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
  @ApiQuery({
    name: 'campaign_id',
    required: false,
    type: Number,
    description:
      'Filter by campaign enrollment. When provided, each student includes their group assignment for this campaign.',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of students with basic profile fields',
    type: PaginatedStudentsBasicResponseDto,
  })
  async findAll(@Query() query: ListStudentsQueryDto) {
    const filters: {
      mosqueIds?: number[];
      search?: string;
      educational_class?: number;
      in_another_mosque?: boolean;
      campaign_id?: number;
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

    if (query.campaign_id !== undefined) {
      filters.campaign_id = Number(query.campaign_id);
    }

    return this.studentService.findAll(filters);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new student',
    description:
      'Creates a student profile. Optionally enroll the student in a campaign by passing `campaign_id` in the request body or `campaign_id` header.',
  })
  @ApiCreatedResponse({
    description:
      'Student created. Message indicates whether the student was also enrolled in a campaign.',
  })
  @ApiBody({ type: CreateStudentDto })
  @ApiHeader({
    name: 'campaign_id',
    description:
      'Optional campaign ID — used when `campaign_id` is not provided in the body',
    required: false,
    schema: { type: 'integer', example: 1 },
  })
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Headers('campaign_id') campaignIdHeader?: string,
  ) {
    const campaignId =
      createStudentDto.campaign_id ??
      (campaignIdHeader ? Number(campaignIdHeader) : undefined);

    return this.studentService.create({
      ...createStudentDto,
      campaign_id: campaignId,
    });
  }

  @Post(':id/assign-campaign')
  @ApiOperation({
    summary: 'Assign an existing student to a campaign',
    description:
      'Enrolls a student in the given campaign. A student may only be actively enrolled in one campaign at a time. Returns 409 if the student is already enrolled in this campaign or another active campaign.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Student ID', example: 5 })
  @ApiBody({ type: AssignStudentCampaignDto })
  @ApiCreatedResponse({
    description: 'Student assigned to campaign successfully',
  })
  @ApiNotFoundResponse({ description: 'Student or campaign not found' })
  @ApiConflictResponse({
    description:
      'Student is already assigned to this campaign or enrolled in another campaign',
  })
  async assignToCampaign(
    @Param('id') id: number,
    @Body() dto: AssignStudentCampaignDto,
  ) {
    return this.studentService.assignToCampaign(Number(id), dto.campaign_id);
  }

  // List students for campaign
  @Get('')
  @ApiOperation({
    summary: 'List students enrolled in a campaign',
    description:
      'Returns students with an active enrollment in the campaign, including their assigned group when applicable.',
  })
  @ApiHeader({
    name: 'campaign_id',
    description: 'Campaign ID to list students for',
    required: true,
    schema: { type: 'integer', example: 1 },
  })
  @ApiResponse({
    status: 200,
    description: 'List of students for the campaign',
  })
  @ApiBadRequestResponse({ description: 'Campaign ID is required in headers' })
  async listStudentsForCampaign(@Headers('campaign_id') campaignId: string) {
    if (!campaignId) {
      throw new BadRequestException('Campaign ID is required in headers');
    }
    return this.studentService.findAllCampaign(campaignId);
  }

  // List un assigned
  @Get('unassigned')
  @ApiOperation({
    summary: 'List students in a campaign with no group assignment',
    description:
      'Returns students enrolled in the campaign who are not yet assigned to a group.',
  })
  @ApiHeader({
    name: 'campaign_id',
    description: 'Campaign ID to filter unassigned students',
    required: true,
    schema: { type: 'integer', example: 1 },
  })
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
