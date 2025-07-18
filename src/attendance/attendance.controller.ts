import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { BulkUpdateAttendanceDto, UpdateAttendanceDto } from './attendance.dto';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOperation({
    summary: 'Get all attendance records for group and campaign',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all records',
  })
  @Get('group/:groupId')
  async findAll(
    @Headers('campaign_id') campaignId: number,
    @Param('groupId') groupId: number,
  ) {
    return this.attendanceService.findAll(campaignId, groupId);
  }

  @ApiOperation({ summary: 'Update Attendance Status' })
  @ApiResponse({
    status: 200,
    description: 'Update attendance status',
    type: UpdateAttendanceDto,
  })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @ApiOperation({ summary: 'Create Attendance Records' })
  @ApiResponse({
    status: 200,
    description: 'Create attendance',
    type: UpdateAttendanceDto,
  })
  @Post('group/:groupId/:studentId')
  async createAll(
    @Param('campaignId') campaignId: number,
    @Param('groupId') groupId: number,
    @Param('studentId') studentId: number,
  ) {
    return this.attendanceService.createAll(campaignId, groupId, studentId);
  }

  @ApiOperation({ summary: 'List Attendance Records for group and date' })
  @ApiResponse({
    status: 200,
    description: 'List attendance',
  })
  @Get('group/:groupId')
  async listByGroup(
    @Headers('campaign_id') campaignId: number,
    @Param('groupId') groupId: number,
  ) {
    return this.attendanceService.getByGroup(campaignId, groupId);
  }

  @ApiOperation({
    summary: 'Get attendance statistics for all groups in a campaign',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns attendance statistics for each group',
  })
  @ApiQuery({ name: 'startDate', required: true, type: Date })
  @ApiQuery({ name: 'endDate', required: true, type: Date })
  @Get('stats/:campaignId')
  async getGroupStats(
    @Param('campaignId') campaignId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.getGroupAttendanceStats(
      campaignId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @ApiOperation({
    summary: 'List Attendance Records for student, group, and campaign',
  })
  @ApiResponse({
    status: 200,
    description: 'List attendance by student, group, and campaign',
  })
  @Get('/group/:groupId/student/:studentId')
  async listByStudentGroupCampaign(
    @Headers('campaign_id') campaignId: number,
    @Param('groupId') groupId: number,
    @Param('studentId') studentId: number,
  ) {
    return this.attendanceService.getByStudentAndGroupAndCampaign(
      studentId,
      campaignId,
      groupId,
    );
  }

  @ApiTags('Attendance')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: BulkUpdateAttendanceDto, isArray: true })
  @Post('batch-update')
  async updateAttendanceBatch(@Body() updates: BulkUpdateAttendanceDto[]) {
    return this.attendanceService.batchUpdate(updates);
  }

  @ApiOperation({
    summary: 'Get all attendance records for a campaign grouped by groups',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all attendance records grouped by groups',
  })
  @Get('campaign/all')
  async getAllAttendanceByCampaign(@Headers('campaign_id') campaignId: number) {
    return this.attendanceService.getAllAttendanceByCampaign(campaignId);
  }

  @ApiOperation({
    summary: 'Get attendance record by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns attendance record by ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Attendance record not found',
  })
  @Get(':id')
  async getAttendanceById(@Param('id') id: number) {
    return this.attendanceService.getAttendanceById(id);
  }
}
