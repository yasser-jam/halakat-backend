/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto, ValidateGroupIdDto } from '../dto/group.dto';
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
            teacher: true
          }
        },
        currentTeacherId: true,        
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

    return groups.map(group => ({
      ...group,
      currentTeacher: group.teachers[0]?.teacher,
      teachers: undefined,
    }))
  }
  
  

  async create(createDto: CreateGroupDto, campaignId: number) {
    const { title, currentTeacherId, class: classNumber } = createDto;

    // Create the group first with the specified title and connect to the campaignId
    const group = await this.prisma.group.create({
      data: {
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        currentTeacherId: 1,
        class: classNumber,
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
      }
    });

    // create new relation between teacher and group (when change the teacher)
    if (currentTeacherId != group.currentTeacherId) {
      await this.prisma.teacherGroup.createMany({
        data: {
          groupId: group.id,
          teacherId: currentTeacherId
        }
      })
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
}
