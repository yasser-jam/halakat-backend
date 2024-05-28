/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ValidateGroupIdDto } from '../dto/group.dto';
import { PrismaService } from './../prisma.service';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.group.findMany();
  }

  async create(createDto: any) {
    return this.prisma.group.create({
      data: createDto,
    });
  }

  async findOne(params: ValidateGroupIdDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(params.id) },
      include: { teacher: true, students: true, campaigns: true },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${params.id} not found`);
    }

    return group;
  }

  async update(params: ValidateGroupIdDto, updateGroupDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: Number(params.id) },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${Number(params.id)} not found`);
    }

    return this.prisma.group.update({
      where: { id: Number(params.id) },
      data: updateGroupDto,
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
