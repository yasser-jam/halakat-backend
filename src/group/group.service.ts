/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateGroupDto,
  GroupAssignDto,
  ValidateGroupIdDto,
} from '../dto/group.dto';
import { PrismaService } from './../prisma.service';

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
        currentTeacherId: true,
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
                campaignId,
              },
            },
          }
        : {},
    });

    return groups.map((group) => ({
      ...group,
      currentTeacher: group.teachers[0]?.teacher,
      teachers: undefined,
      students: group.students.map((stud) => stud.student),
    }));
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
      wedensday: 3,
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

  async assign(params: GroupAssignDto) {
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
        `Group with ID ${params.studentId} not found`,
      );
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: Number(params.campaignId) },
    });

    if (!campaign) {
      throw new NotFoundException(
        `Group with ID ${params.campaignId} not found`,
      );
    }

    // create all attendance records for the student
    // divide days from start date of that campaign to the end date
    const startDate = campaign.startDate;
    const endDate = campaign.endDate;
    const days = campaign.days.split(',');

    const attendDays = this.getMatchingDaysBetweenDates(
      String(startDate),
      String(endDate),
      days as any,
    );

    await this.prisma.attendance.createMany({
      data: attendDays.map(day => ({
        studentId: Number(params.studentId),
        groupId: Number(params.groupId),
        campaignId: Number(params.campaignId),
        takenDate: new Date(day).toISOString(),
        delayTime: -1,
        status: 'NOT_TAKEN',
      })),
    });

    return this.prisma.studentGroup.create({
      data: {
        studentId: student.id,
        campaignId: campaign.id,
        groupId: group.id,
      },
    });
  }

  async unassign(params: GroupAssignDto) {
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
        `Group with ID ${params.studentId} not found`,
      );
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: Number(params.campaignId) },
    });

    if (!campaign) {
      throw new NotFoundException(
        `Group with ID ${params.campaignId} not found`,
      );
    }

    return this.prisma.studentGroup.delete({
      where: {
        studentId_groupId_campaignId: {
          campaignId: campaign.id,
          groupId: group.id,
          studentId: student.id,
        },
      },
    });
  }

  async create(createDto: CreateGroupDto, campaignId: number) {
    const { title, currentTeacherId } = createDto;

    // Create the group first with the specified title and connect to the campaignId
    const group = await this.prisma.group.create({
      data: {
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        currentTeacherId: 1,
      },
    });

    // Connect the group to the specified current teacher via TeacherGroup pivot table
    if (currentTeacherId) {
      await this.prisma.teacherGroup.create({
        data: {
          teacherId: currentTeacherId,
          groupId: group.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }

    // Connect the campaign
    if (group.id) {
      await this.prisma.groupCampaigns.createMany({
        data: [
          {
            campaignId: Number(campaignId),
            groupId: Number(group.id),
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      });
    }

    return group;
  }

  async findOne(params: ValidateGroupIdDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(params.id) },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${params.id} not found`);
    }

    return {
      ...group,
    };
  }

  async update(params: ValidateGroupIdDto, updateDto: CreateGroupDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(params.id) },
    });

    if (!group) {
      throw new NotFoundException(
        `Group with ID ${Number(params.id)} not found`,
      );
    }

    const { title, class: classNumber, currentTeacherId } = updateDto;

    // Create the group first
    const updatedGroup = await this.prisma.group.update({
      where: {
        id: group.id,
      },
      data: {
        title,
        class: classNumber,
        currentTeacherId,
      },
    });

    // create new relation between teacher and group (when change the teacher)
    if (currentTeacherId != group.currentTeacherId) {
      await this.prisma.teacherGroup.createMany({
        data: {
          groupId: group.id,
          teacherId: currentTeacherId,
        },
      });
    }

    return updatedGroup;
  }

  async delete(params: ValidateGroupIdDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(params.id) },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${params.id} not found`);
    }

    return this.prisma.group.delete({
      where: { id: Number(params.id) },
    });
  }

  async getGroupById(groupId: number) {
    const group = await this.prisma.group.findUnique({
      where: {
        id: Number(groupId),
      },
      include: {
        teachers: {
          include: {
            teacher: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                image_url: true,
              },
            },
          },
        },
        students: {
          include: {
            student: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                image_url: true,
                educational_class: true,
              },
            },
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    // Map the response to a cleaner format
    return {
      id: group.id,
      title: group.title,
      class: group.class,
      currentTeacher: group.teachers[0]?.teacher || null,
      students: group.students.map((sg) => ({
        id: sg.student.id,
        firstName: sg.student.first_name,
        lastName: sg.student.last_name,
        profileImage: sg.student.image_url,
        class: sg.student.educational_class,
      })),
    };
  }

  async findByTeacher(teacherId: number) {
    // Find all groupIds for this teacher
    const teacherGroups = await this.prisma.teacherGroup.findMany({
      where: { teacherId: Number(teacherId) },
      select: { groupId: true },
    });
    const groupIds = teacherGroups.map(tg => tg.groupId);
    if (groupIds.length === 0) return [];
    // Return all groups for these groupIds, including students
    const groups = await this.prisma.group.findMany({
      where: { id: { in: groupIds } },
      include: {
        students: {
          include: {
            student: true,
          },
        },
      },
    });
    // Map students to a flat array of student info for each group
    return groups.map(group => ({
      ...group,
      students: group.students.map(sg => sg.student),
    }));
  }

  async findByTeacherAndCampaign(teacherId: number, campaignId: number) {
    // Find all groupIds for this teacher
    const teacherGroups = await this.prisma.teacherGroup.findMany({
      where: { teacherId: Number(teacherId) },
      select: { groupId: true },
    });
    const groupIds = teacherGroups.map(tg => tg.groupId);
    if (groupIds.length === 0) return [];
    // Find all groupIds for this campaign
    const groupCampaigns = await this.prisma.groupCampaigns.findMany({
      where: { campaignId: Number(campaignId), groupId: { in: groupIds } },
      select: { groupId: true },
    });
    const filteredGroupIds = groupCampaigns.map(gc => gc.groupId);
    if (filteredGroupIds.length === 0) return [];
    // Return all groups for these groupIds, including students
    const groups = await this.prisma.group.findMany({
      where: { id: { in: filteredGroupIds } },
      include: {
        students: {
          include: {
            student: true,
          },
        },
      },
    });
    // Map students to a flat array of student info for each group
    return groups.map(group => ({
      ...group,
      students: group.students.map(sg => sg.student),
    }));
  }

  async findByStudentAndCampaign(studentId: number, campaignId: number) {
    // Find all groupIds for this student in the given campaign
    const studentGroups = await this.prisma.studentGroup.findMany({
      where: { studentId: Number(studentId), campaignId: Number(campaignId) },
      select: { groupId: true },
    });
    const groupIds = studentGroups.map(sg => sg.groupId);
    if (groupIds.length === 0) return [];
    // Return all groups for these groupIds, including students
    const groups = await this.prisma.group.findMany({
      where: { id: { in: groupIds } }
    });
    return groups
  }
}
