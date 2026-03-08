/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LogService } from '../log/log.service';
import { BulkUpdateAttendanceDto, UpdateAttendanceDto } from './attendance.dto';
// 
@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

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
    console.log(studentId, campaignId, groupId);
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
    let groupId: number | null = null;
    let teacherId: number | null = null;
    let campaignId: number | null = null;
    let groupTitle: string | null = null;
    let updatedCount = 0;

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
        include: {
          student: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
          group: {
            select: {
              id: true,
              title: true,
              current_teacher_id: true,
            },
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

      // Store group and teacher info for batch log (use first successful record)
      if (groupId === null) {
        groupId = attendance.group_id;
        teacherId = attendance.group.current_teacher_id;
        campaignId = record.campaign_id;
        groupTitle = attendance.group.title;
      }

      await this.prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          status: record.status,
          delay_time: record.delay,
        },
      });

      updatedCount++;

      results.push({
        student_id: record.student_id,
        campaign_id: record.campaign_id,
        date: record.date,
        data: record.status
      });
    }

    // Create single log entry for the entire batch update
    if (updatedCount > 0 && groupId && teacherId && campaignId) {
      try {
        await this.logService.create(
          {
            event: 'ATTENDANCE_MARKED',
            teacher_id: teacherId,
            group_id: groupId,
            notes: `تم تسجيل حضور ${updatedCount} طالب في المجموعة ${groupTitle}`,
            metadata: {
              group_id: groupId,
              students_count: updatedCount,
            },
          },
          campaignId,
        );
      } catch (error) {
        console.error('Failed to create log for attendance batch update:', error);
        // Don't throw error to avoid breaking the main flow
      }
    }

    return results;
  }

  async getAllAttendanceByCampaign(campaignId: number) {
    const attendances = await this.prisma.attendance.findMany({
      where: {
        campaign_id: Number(campaignId),
      },
      include: {
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            educational_class: true
          }
        },
        group: {
          select: {
            id: true,
            title: true,
            teachers: {
              include: {
                teacher: {
                  select: {
                    first_name: true,
                    last_name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: [
        { group_id: 'asc' },
        { taken_date: 'asc' }
      ]
    });

    // Group attendances by group
    const groupedAttendances = {};
    
    for (const attendance of attendances) {
      const groupKey = `group-${attendance.group_id}`;
      
      if (!groupedAttendances[groupKey]) {
        groupedAttendances[groupKey] = [];
      }
      
      // Map the attendance record to include teacher names
      const mappedAttendance = {
        ...attendance,
        group: {
          ...attendance.group,
          teachers: attendance.group.teachers.map(teacherGroup => 
            `${teacherGroup.teacher.first_name} ${teacherGroup.teacher.last_name}`
          )
        }
      };
      
      groupedAttendances[groupKey].push(mappedAttendance);
    }

    // Convert to array of objects with group details
    const result = Object.entries(groupedAttendances).map(([groupKey, attendances]) => {
      // Get group details from the first attendance record (all records in a group have same group info)
      const groupInfo = (attendances as any[])[0]?.group;
      
      return {
        groupId: groupInfo?.id,
        groupKey,
        groupTitle: groupInfo?.title || '',
        groupTeachers: groupInfo?.teachers || [],
        attendances: (attendances as any[]).map((attendance: any) => ({
          ...attendance,
          group: {
            id: attendance.group.id,
            title: attendance.group.title
          }
        }))
      };
    });

    return result;
  }

  async getAttendanceById(id: number) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id: Number(id) },
      include: {
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            educational_class: true
          }
        },
        group: {
          select: {
            id: true,
            title: true,
            teachers: {
              include: {
                teacher: {
                  select: {
                    first_name: true,
                    last_name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    // Map teachers to names
    const mappedAttendance = {
      ...attendance,
      group: {
        ...attendance.group,
        teachers: attendance.group.teachers.map(teacherGroup => 
          `${teacherGroup.teacher.first_name} ${teacherGroup.teacher.last_name}`
        )
      }
    };

    return mappedAttendance;
  }

  // Simple API to get all attendances by campaign
  async getAttendancesByCampaign(campaignId: number) {
    return await this.prisma.attendance.findMany({
      where: {
        campaign_id: Number(campaignId),
      },
      include: {
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            educational_class: true
          }
        },
        group: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: [
        { taken_date: 'desc' }
      ]
    });
  }

  // Simple API to create or update a single attendance record
  async createOrUpdateAttendance(data: {
    student_id: number;
    group_id: number;
    campaign_id: number;
    taken_date: string;
    status: string;
    delay_time?: number;
  }) {
    // Check if attendance record already exists
    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        student_id: Number(data.student_id),
        group_id: Number(data.group_id),
        campaign_id: Number(data.campaign_id),
        taken_date: {
          gte: new Date(data.taken_date + 'T00:00:00.000Z'),
          lt: new Date(data.taken_date + 'T23:59:59.999Z'),
        },
      },
    });

    if (existingAttendance) {
      // Update existing record
      return await this.prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          status: data.status,
          delay_time: data.delay_time ?? -1,
        },
        include: {
          student: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              educational_class: true
            }
          },
          group: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });
    } else {
      // Create new record
      return await this.prisma.attendance.create({
        data: {
          student_id: Number(data.student_id),
          group_id: Number(data.group_id),
          campaign_id: Number(data.campaign_id),
          taken_date: new Date(data.taken_date).toISOString(),
          status: data.status,
          delay_time: data.delay_time ?? -1,
        },
        include: {
          student: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              educational_class: true
            }
          },
          group: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });
    }
  }
}
