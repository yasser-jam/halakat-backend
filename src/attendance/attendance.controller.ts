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
@Controller('attendance/:groupId')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOperation({
    summary: 'Get all attendance records for group and campaign',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all records',
  })
  @Get()
  async findAll(
    @Headers('campaignId') campaignId: number,
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
  @Put('attendance/:id')
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
  @Post('attendance/:groupId/:studentId')
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
  @Get('attendance/group/:campaignId/:groupId')
  async listByGroup(
    @Param('campaignId') campaignId: number,
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
  @Get('student/:studentId')
  async listByStudentGroupCampaign(
    @Headers('campaignId') campaignId: number,
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
}
