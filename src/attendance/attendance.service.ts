/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BulkUpdateAttendanceDto, UpdateAttendanceDto } from './attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(campaignId: number, groupId: number) {
    return await this.prisma.attendance.findMany({
      where: {
        group_id:Number(groupId), 
        campaign_id: Number(campaignId),
      },
      include: {
        student: {
          select: {
            first_name: true,
            last_name: true,
            educational_class: true
          }
        },
      },
    });
  }

  // create all attendance records for student for some campaign in one group
  //

  getMatchingDaysBetweenDates = (
    startDate: string,
    endDate: string,
    days: string[],
  ) => {
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
    const startDate = campaign.start_date;
    const endDate = campaign.end_date;
    const days = campaign.days.split(',');

    const attendDays = this.getMatchingDaysBetweenDates(
      String(startDate),
      String(endDate),
      days as any,
    );

    for (const day of attendDays) {
      await this.prisma.attendance.create({
        data: {
          student_id: Number(studentId),
          group_id: Number(groupId),
          campaign_id: Number(campaignId),
          taken_date: new Date(day).toISOString(),
          delay_time: -1,
          status: 'NOT_TAKEN',
        },
      });
    }
  }
  r;
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
  async getByGroup(
    campaignId: number,
    groupId: number,
    date: string = new Date().toISOString().split('T')[0], // default: today in YYYY-MM-DD
  ) {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);
    const res = await this.prisma.attendance.findMany({
      where: {
        campaign_id: Number(campaignId),
        group_id: Number(groupId),
        taken_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        student: true,
      },
    });

    return res;
  }

  async getGroupAttendanceStats(
    campaignId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const attendances = await this.prisma.attendance.findMany({
      where: {
        campaign_id: Number(campaignId),
        taken_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        campaign_id: true,
        student: true,
        group: true,
        group_id: true,
        status: true,
        student_id: true,
      },
    });

    // Group the attendances by group
    const groupStats = new Map();

    for (const attendance of attendances) {
      const groupId = attendance.group_id;
      if (!groupStats.has(groupId)) {
        groupStats.set(groupId, {
          groupId,
          groupName: attendance.group.title,
          attended: 0,
          missed: 0,
          delayed: 0,
        });
      }

      const stats = groupStats.get(groupId);

      if (attendance.status === 'ATTEND') {
        stats.attended++;
      } else if (attendance.status === 'MISSED') {
        stats.missed++;
      } else if (attendance.status === 'DELAY') {
        stats.delayed++;
      }
    }

    return Array.from(groupStats.values());
  }

  // List attendance records by studentId, campaignId, and groupId
  async getByStudentAndGroupAndCampaign(
    studentId: number,
    campaignId: number,
    groupId: number,
  ) {
    return this.prisma.attendance.findMany({
      where: {
        student_id: Number(studentId),
        campaign_id: Number(campaignId),
        group_id: Number(groupId),
        status: {
          not: 'NOT_TAKEN',
        },
      },
    });
  }

  async batchUpdate(data: BulkUpdateAttendanceDto[]) {
    const results = [];

    for (const record of data) {
      const attendance = await this.prisma.attendance.findFirst({
        where: {
          student_id: record.student_id,
          campaign_id: record.campaign_id,
          taken_date: {
            gte: new Date(record.date + 'T00:00:00.000Z'),
            lt: new Date(record.date + 'T23:59:59.999Z'),
          },
        },
      });

      if (!attendance) {
        results.push({
          student_id: record.student_id,
          campaign_id: record.campaign_id,
          date: record.date,
          status: 'NOT_FOUND',
        });
        continue;
      }

      await this.prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          status: record.status,
          delay_time: record.delay,
        },
      });

      results.push({
        student_id: record.student_id,
        campaign_id: record.campaign_id,
        date: record.date,
        data: record.status
      });
    }

    return results;
  }
}
