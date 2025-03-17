/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateAttendanceDto } from './attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(campaignId: number, groupId: number) {
    return await this.prisma.attendance.findMany({
      where: {
        groupId: Number(groupId),
        campaignId: Number(campaignId),
      },
    });
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id: Number(id) },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${Number(id)} not found`);
    }

    return this.prisma.attendance.update({
      where: { id: Number(id) },
      data: updateAttendanceDto,
    });
  }
}
