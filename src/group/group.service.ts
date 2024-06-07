/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto, ValidateGroupIdDto } from '../dto/group.dto';
import { PrismaService } from './../prisma.service';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.group.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            first_name: true,
            last_name: true
          }
        },
        students: {
          select: {
            id: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });
  }

  async create(createDto: CreateGroupDto) {
    const { title, teacherId, campaignIds, studentsIds } = createDto;
  
    // Create the group first
    const group = await this.prisma.group.create({
      data: {
        title,
        teacherId: teacherId ?? undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        campaigns: {
          create: campaignIds?.map((campaignId) => ({
            campaign: { connect: { id: campaignId } },
          })),
        },
      },
      include: {
        campaigns: true,
      },
    });
  
    // Associate students with the created group
    if (studentsIds && studentsIds.length > 0) {
      await this.prisma.student.updateMany({
        where: { id: { in: studentsIds } },
        data: { groupId: group.id },
      });
    }
  
    return group;
  }

  async findOne(params: ValidateGroupIdDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(params.id) },
      include: {
        teacher: true,
        students: true,
        campaigns: {
          include: { group: true },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${params.id} not found`);
    }

    return {
      ...group,
      campaigns: group.campaigns.map(el => el.group)
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

    const { title, teacherId, campaignIds, studentsIds } = updateDto;
  
    // Create the group first
    const updatedGroup = await this.prisma.group.update({
      where: {
        id: group.id
      },
      data: {
        title,
        teacherId: teacherId ?? undefined,
        campaigns: {
          create: campaignIds?.map((campaignId) => ({
            campaign: { connect: { id: campaignId } },
          })),
        },
      },
      include: {
        campaigns: true,
      },
    });

    // Associate students with the created group
    if (studentsIds && studentsIds.length > 0) {
      console.log(studentsIds);
      // await this.prisma.student.updateMany({
      //   where: { id: { in: studentsIds } },
      //   data: { groupId: group.id },
      // });
    }

    return updatedGroup
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
