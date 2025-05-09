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

  // create all attendance records for student for some campaign in one group
  //

  getMatchingDaysBetweenDates = (startDate: string, endDate: string, days: string[]) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayMap = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    };

    const selectedDays = days?.map((day) => dayMap[day]);
    const result = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (selectedDays.includes(d.getDay())) {
        result.push(new Date(d).toISOString().split('T')[0]); // Returns date in YYYY-MM-DD format
      }
    }

    return result;
  };

  async createAll(campaignId: number, groupId: number, studentId: number) {
    const campaign = await this.prisma.campaign.findUnique({
      where: {
        id: Number(campaignId),
      },
    });

    // divide days from start date of that campaign to the end date
    const startDate = campaign.startDate;
    const endDate = campaign.endDate;
    const days = campaign.days.split(',');


    const attendDays = this.getMatchingDaysBetweenDates(String(startDate), String(endDate), days as any)

    for (const day of attendDays) {
      await this.prisma.attendance.create({
        data: {
          studentId: Number(studentId),
          groupId: Number(groupId),
          campaignId: Number(campaignId),
          takenDate: new Date(day).toISOString(),
          delayTime: -1,
          status: 'NOT_TAKEN'
        }
      })
    }
  }
r
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

  // get the records depending on campaignId and groupID and the date of today
  async getByGroup(campaignId: number, groupId: number) {
    const res = await this.prisma.attendance.findMany({
      where: {
        campaignId: Number(campaignId),
        groupId: Number(groupId),
        takenDate: new Date()
      }
    })

    return res
  }
}

