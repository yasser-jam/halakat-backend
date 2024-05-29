/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto, ValidateGroupIdDto } from '../dto/group.dto';
import { PrismaService } from './../prisma.service';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.group.findMany();
  }

  async create(createDto: CreateGroupDto) {
    const { title, teacherId, campaignIds } = createDto;
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

  async update(params: ValidateGroupIdDto, updateData: any) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(params.id) },
    });

    if (!group) {
      throw new NotFoundException(
        `Group with ID ${Number(params.id)} not found`,
      );
    }

    return this.prisma.group.update({
      where: { id: Number(params.id) },
      data: {
        ...updateData,
      },
    });
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
