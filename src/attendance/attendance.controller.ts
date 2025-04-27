import { Controller, Get, Body, Param, Put, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { UpdateAttendanceDto } from './attendance.dto';

@ApiTags('attendance')
@Controller('attendance/:groupId/:campaignId')
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
    @Param('campaignId') campaignId: number,
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
  @Post('attendance/:campaignId/:groupId/:studentId')
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
}
