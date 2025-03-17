import { Controller, Get, Body, Param, Put } from '@nestjs/common';
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
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }
}
