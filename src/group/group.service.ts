import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGroupDto } from './group.dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async findAll(campaignId?: number) {
    const groups = await this.prisma.group.findMany({
      select: {
        id: true,
        title: true,
        class: true,
        teachers: {
          include: {
            teacher: true,
          },
        },
        current_teacher_id: true,
        students: {
          include: {
            student: true,
          },
        },
      },
      where: campaignId
        ? {
            campaigns: {
              some: {
                campaign_id: campaignId,
              },
            },
          }
        : {},
    });

    const result = groups.map((group) => ({
      ...group,
      currentTeacher: group.teachers[0]?.teacher,
      teachers: undefined,
      students: group.students.map((stud) => stud.student),
    }));

    return result;
  }

  async create(createDto: CreateGroupDto, campaignId: string) {
    const { title, currentTeacherId, mosque_id } = createDto;

    // Create the group first with the specified title
    const group = await this.prisma.group.create({
      data: {
        title,
        class: createDto.class,
        mosque_id,
        current_teacher_id: currentTeacherId,
      },
    });

    // Connect the group to the campaign
    await this.prisma.groupCampaigns.create({
      data: {
        group_id: group.id,
        campaign_id: Number(campaignId),
      },
    });

    // Connect the group to the specified current teacher via TeacherGroup pivot table
    if (currentTeacherId) {
      await this.prisma.teacherGroup.create({
        data: {
          teacher_id: currentTeacherId,
          group_id: group.id,
          campaign_id: Number(campaignId),
        },
      });
    }

    return { message: 'Group created', data: group };
  }

  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(id) },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return { message: `Group ${id} found`, data: group };
  }

  async update(id: number, updateGroupDto: CreateGroupDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(id) },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    const updated = await this.prisma.group.update({
      where: { id: Number(id) },
      data: updateGroupDto,
    });

    return { message: `Group ${id} updated`, data: updated };
  }

  async delete(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(id) },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    await this.prisma.group.delete({
      where: { id: Number(id) },
    });

    return { message: `Group ${id} deleted` };
  }

  getMatchingDaysBetweenDates = (
    startDate: string,
    endDate: string,
    days: string[],
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayMap = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
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

  async assign(params: {
    groupId: number;
    studentId: number;
    campaignId: number;
  }) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(params.groupId) },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${params.groupId} not found`);
    }

    const student = await this.prisma.student.findUnique({
      where: { id: Number(params.studentId) },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with ID ${params.studentId} not found`,
      );
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: Number(params.campaignId) },
    });

    if (!campaign) {
      throw new NotFoundException(
        `Campaign with ID ${params.campaignId} not found`,
      );
    }

    // create all attendance records for the student
    // divide days from start date of that campaign to the end date
    const startDate = campaign.start_date;
    const endDate = campaign.end_date;
    const days = campaign.days?.split(',') || [];

    const attendDays = this.getMatchingDaysBetweenDates(
      String(startDate),
      String(endDate),
      days as any,
    );

    await this.prisma.attendance.createMany({
      data: attendDays.map((day) => ({
        student_id: Number(params.studentId),
        group_id: Number(params.groupId),
        campaign_id: Number(params.campaignId),
        taken_date: new Date(day).toISOString(),
        delay_time: -1,
        status: 'NOT_TAKEN',
      })),
    });

    const studentGroup = await this.prisma.studentGroup.create({
      data: {
        student_id: student.id,
        campaign_id: campaign.id,
        group_id: group.id,
      },
    });

    return studentGroup;
  }

  async unassign(params: {
    groupId: number;
    studentId: number;
    campaignId: number;
  }) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(params.groupId) },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${params.groupId} not found`);
    }

    const student = await this.prisma.student.findUnique({
      where: { id: Number(params.studentId) },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with ID ${params.studentId} not found`,
      );
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: Number(params.campaignId) },
    });

    if (!campaign) {
      throw new NotFoundException(
        `Campaign with ID ${params.campaignId} not found`,
      );
    }

    await this.prisma.studentGroup.delete({
      where: {
        student_id_group_id_campaign_id: {
          campaign_id: campaign.id,
          group_id: group.id,
          student_id: student.id,
        },
      },
    });

    return { message: 'Student unassigned from group' };
  }

  // Additional functions from original implementation
  async getGroupById(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(id) },
      include: {
        teachers: {
          include: {
            teacher: true,
          },
        },
        students: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    const result = {
      ...group,
      currentTeacher: group.teachers[0]?.teacher,
      teachers: undefined,
      students: group.students.map((stud) => stud.student),
    };

    return { message: `Group ${id} details found`, data: result };
  }

  async findByTeacher(teacherId: number) {
    const teacherGroups = await this.prisma.teacherGroup.findMany({
      where: { teacher_id: Number(teacherId) },
      include: {
        group: {
          include: {
            teachers: {
              include: {
                teacher: true,
              },
            },
            students: {
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    const result = teacherGroups.map((tg) => ({
      ...tg.group,
      currentTeacher: tg.group.teachers[0]?.teacher,
      teachers: undefined,
      students: tg.group.students.map((stud) => stud.student),
    }));

    return { message: 'Groups by teacher', data: result };
  }

  async findByTeacherAndCampaign(teacherId: number, campaignId: number) {
    const teacherGroups = await this.prisma.teacherGroup.findMany({
      where: {
        teacher_id: Number(teacherId),
        campaign_id: Number(campaignId),
      },
      include: {
        group: {
          include: {
            teachers: {
              include: {
                teacher: true,
              },
            },
            students: {
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    const result = teacherGroups.map((tg) => ({
      ...tg.group,
      currentTeacher: tg.group.teachers[0]?.teacher,
      teachers: undefined,
      students: tg.group.students.map((stud) => stud.student),
    }));

    return result;
  }

  async findByStudentAndCampaign(studentId: number, campaignId: number) {
    const studentGroups = await this.prisma.studentGroup.findMany({
      where: {
        student_id: Number(studentId),
        campaign_id: Number(campaignId),
      },
      include: {
        group: {
          include: {
            teachers: {
              include: {
                teacher: true,
              },
            },
            students: {
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    const result = studentGroups.map((sg) => ({
      ...sg.group,
      currentTeacher: sg.group.teachers[0]?.teacher,
      teachers: undefined,
      students: sg.group.students.map((stud) => stud.student),
    }));

    return { message: 'Groups by student and campaign', data: result };
  }
}
