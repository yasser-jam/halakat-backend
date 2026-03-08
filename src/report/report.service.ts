import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GetReportDto, ReportResponseDto } from './report.dto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async generateCampaignReport(dto: GetReportDto): Promise<ReportResponseDto> {
    const { campaign_id, start_date, end_date } = dto;
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Execute all queries in parallel for better performance
    const [
      globalInfo,
      lessons,
      savingSessions,
      missedStudents,
      delayedStudents,
    ] = await Promise.all([
      this.getGlobalInfo(campaign_id, startDate, endDate),
      this.getLessonsData(campaign_id, startDate, endDate),
      this.getSavingSessionsData(campaign_id, startDate, endDate),
      this.getMissedStudents(campaign_id, startDate, endDate),
      this.getDelayedStudents(campaign_id, startDate, endDate),
    ]);

    return {
      globalInfo,
      lessons,
      savingSessions,
      missedStudents,
      delayedStudents,
    };
  }

  private async getGlobalInfo(
    campaignId: number,
    startDate: Date,
    endDate: Date,
  ) {
    // Count students in campaign
    const studentsCount = await this.prisma.studentCampaign.count({
      where: { campaign_id: Number(campaignId), is_active: true },
    });

    // Count teachers in campaign
    const teachersCount = await this.prisma.teacherCampaign.count({
      where: { campaign_id: Number(campaignId), is_active: true },
    });

    // Count distinct students who attended at least once
    const attendStudentsResult = await this.prisma.attendance.findMany({
      where: {
        campaign_id: Number(campaignId),
        status: 'ATTEND',
        taken_date: { gte: startDate, lte: endDate },
      },
      select: {
        student_id: true,
      },
      distinct: ['student_id'],
    });
    const attendStudents = attendStudentsResult.length;

    // Count total delay occurrences
    const delayedStudentsCount = await this.prisma.attendance.count({
      where: {
        campaign_id: Number(campaignId),
        status: 'DELAY',
        taken_date: { gte: startDate, lte: endDate },
      },
    });

    return {
      studentsCount,
      teachersCount,
      attendStudents,
      delayedStudentsCount,
    };
  }

  private async getLessonsData(
    campaignId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const lessons = await this.prisma.curriculumLessonSession.findMany({
      where: {
        campaign_id: Number(campaignId),
        created_at: { gte: startDate, lte: endDate },
      },
      include: {
        lesson_node: {
          include: {
            template: {
              include: {
                curriculum: {
                  include: {
                    categories: {
                      include: {
                        category: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        group: true,
      },
    });

    // Group lessons by category and group
    const lessonMap = new Map<string, number>();

    lessons.forEach((lesson) => {
      const categoryName =
        lesson.lesson_node.template.curriculum.categories[0]?.category.name ||
        'Uncategorized';
      const groupTitle = lesson.group.title;
      const key = `${categoryName}|${groupTitle}`;

      lessonMap.set(key, (lessonMap.get(key) || 0) + 1);
    });

    return Array.from(lessonMap.entries()).map(([key, count]) => {
      const [categoryName, groupTitle] = key.split('|');
      return {
        categoryName,
        groupTitle,
        lessonsCount: count,
      };
    });
  }

  private async getSavingSessionsData(
    campaignId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const savingSessions = await this.prisma.savingSession.findMany({
      where: {
        campaign_id: Number(campaignId),
        created_at: { gte: startDate, lte: endDate },
      },
      include: {
        session_surahs: {
          select: {
            isPassed: true,
          },
        },
      },
    });

    let passed = 0;
    let notPassed = 0;

    savingSessions.forEach((session) => {
      if (session.session_surahs.length === 0) {
        notPassed++;
        return;
      }

      const allPassed = session.session_surahs.every(
        (surah) => surah.isPassed === true,
      );
      if (allPassed) {
        passed++;
      } else {
        notPassed++;
      }
    });

    return {
      total: savingSessions.length,
      passed,
      notPassed,
    };
  }

  private async getMissedStudents(
    campaignId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const missedAttendances = await this.prisma.attendance.findMany({
      where: {
        campaign_id: Number(campaignId),
        status: 'MISSED',
        taken_date: { gte: startDate, lte: endDate },
      },
      include: {
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            student_mobile: true,
            father_phone_number: true,
            mother_phone_number: true,
            student_mobile_number: true,
            student_home_number: true,
            mother_home_number: true,
            father_work_number: true,
          },
        },
        group: {
          select: {
            title: true,
          },
        },
      },
    });

    // Group by student
    const studentMap = new Map<number, any>();

    missedAttendances.forEach((attendance) => {
      const studentId = attendance.student.id;

      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          studentId: attendance.student.id,
          firstName: attendance.student.first_name,
          lastName: attendance.student.last_name,
          phoneNumbers: {
            studentMobile: attendance.student.student_mobile,
            fatherPhone: attendance.student.father_phone_number,
            motherPhone: attendance.student.mother_phone_number,
            studentMobileNumber: attendance.student.student_mobile_number,
            studentHomeNumber: attendance.student.student_home_number,
            motherHomeNumber: attendance.student.mother_home_number,
            fatherWorkNumber: attendance.student.father_work_number,
          },
          missedDates: [],
        });
      }

      studentMap.get(studentId).missedDates.push({
        date: attendance.taken_date,
        groupTitle: attendance.group.title,
      });
    });

    return Array.from(studentMap.values());
  }

  private async getDelayedStudents(
    campaignId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const delayedAttendances = await this.prisma.attendance.findMany({
      where: {
        campaign_id: Number(campaignId),
        status: 'DELAY',
        taken_date: { gte: startDate, lte: endDate },
      },
      include: {
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        group: {
          select: {
            title: true,
          },
        },
      },
    });

    // Group by student
    const studentMap = new Map<number, any>();

    delayedAttendances.forEach((attendance) => {
      const studentId = attendance.student.id;

      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          studentId: attendance.student.id,
          firstName: attendance.student.first_name,
          lastName: attendance.student.last_name,
          delays: [],
        });
      }

      studentMap.get(studentId).delays.push({
        date: attendance.taken_date,
        delayTime: attendance.delay_time,
        groupTitle: attendance.group.title,
      });
    });

    return Array.from(studentMap.values());
  }
}
