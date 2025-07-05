import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Delete,
  Put,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { GroupService } from './group.service';
import { CreateGroupDto } from './group.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupService) {}

  @Get('')
  @ApiQuery({ name: 'campaignId' })
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, description: 'Return all groups' })
  async findAll(@Query('campaignId') campaignId?: string) {
    const campaignIdNumber = campaignId ? Number(campaignId) : undefined;
    return this.groupService.findAll(campaignIdNumber);
  }

  // Assign student
  @Get('/assign/:groupId/:studentId/:campaignId')
  @ApiOperation({ summary: 'Assign student into group' })
  @ApiParam({ name: 'groupId', type: Number })
  @ApiParam({ name: 'studentId', type: Number })
  @ApiParam({ name: 'campaignId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The student has been assigned successfully.',
  })
  async assign(
    @Param('groupId') groupId: number,
    @Param('studentId') studentId: number,
    @Param('campaignId') campaignId: number,
  ) {
    return this.groupService.assign({ groupId, studentId, campaignId });
  }

  // UnAssign student
  @Get('/unassign/:groupId/:studentId/:campaignId')
  @ApiOperation({ summary: 'Un-assign student from group' })
  @ApiParam({ name: 'groupId', type: Number })
  @ApiParam({ name: 'studentId', type: Number })
  @ApiParam({ name: 'campaignId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The student has been un-assigned successfully.',
  })
  async unassign(
    @Param('groupId') groupId: number,
    @Param('studentId') studentId: number,
    @Param('campaignId') campaignId: number,
  ) {
    return this.groupService.unassign({ groupId, studentId, campaignId });
  }

  @Post(':campaignId')
  @ApiOperation({ summary: 'Create a new group' })
  @ApiParam({ name: 'campaignId', type: Number })
  @ApiResponse({
    status: 201,
    description: 'The group has been successfully created.',
  })
  @ApiBody({ type: CreateGroupDto })
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Param('campaignId') campaignId: number,
  ) {
    return this.groupService.create(createGroupDto, campaignId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/my-groups')
  @ApiOperation({
    summary:
      'List all groups for the authenticated teacher in the specified campaign',
  })
  @ApiHeader({
    name: 'campaign-id',
    description: 'Campaign ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      'Return all groups for the authenticated teacher in the given campaign',
  })
  async findByTeacherAndCampaign(
    @Request() req,
    @Headers('campaign-id') campaignId: string,
  ) {
    console.log('hello test');
    const teacherId = req.user.id;
    return this.groupService.findByTeacherAndCampaign(
      Number(teacherId),
      Number(campaignId),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return the group with the given ID',
  })
  async findOne(@Param('id') id: number) {
    return this.groupService.findOne(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a group by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The group has been successfully updated.',
  })
  @ApiBody({ type: CreateGroupDto })
  async update(
    @Param('id') id: number,
    @Body() updateGroupDto: CreateGroupDto,
  ) {
    return this.groupService.update(Number(id), updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a group by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The group has been successfully deleted.',
  })
  async delete(@Param('id') id: number) {
    return this.groupService.delete(Number(id));
  }

  // Additional endpoints from original implementation
  @Get('details/:id')
  @ApiOperation({ summary: 'Get group details by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns group details including teacher and students',
  })
  async getGroupById(@Param('id') id: number) {
    return this.groupService.getGroupById(Number(id));
  }

  @Get('/byteacher/:teacherId')
  @ApiOperation({ summary: 'List all groups by teacher' })
  @ApiParam({ name: 'teacherId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return all groups for the given teacher',
  })
  async findByTeacher(@Param('teacherId') teacherId: number) {
    return this.groupService.findByTeacher(Number(teacherId));
  }

  @Get('/bystudent/:studentId/campaign/:campaignId')
  @ApiOperation({ summary: 'List all groups by student and campaign' })
  @ApiParam({ name: 'studentId', type: Number })
  @ApiParam({ name: 'campaignId', type: Number })
  @ApiResponse({
    status: 200,
    description:
      'Return all groups for the given student in the given campaign',
  })
  async findByStudentAndCampaign(
    @Param('studentId') studentId: number,
    @Param('campaignId') campaignId: number,
  ) {
    return this.groupService.findByStudentAndCampaign(
      Number(studentId),
      Number(campaignId),
    );
  }
}
