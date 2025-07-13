import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizationDto: any) {
    const org = await this.prisma.organization.create({
      data: createOrganizationDto,
    });
    return { message: 'Organization created', data: org };
  }

  async findAll() {
    const orgs = await this.prisma.organization.findMany();
    return { message: 'All organizations', data: orgs };
  }

  async findOne(id: number) {
    const org = await this.prisma.organization.findUnique({
      where: { id: Number(id) },
    });
    return { message: `Organization ${id} found`, data: org };
  }

  async update(id: number, updateOrganizationDto: any) {
    const org = await this.prisma.organization.update({
      where: { id: Number(id) },
      data: updateOrganizationDto,
    });
    return { message: `Organization ${id} updated`, data: org };
  }

  async remove(id: number) {
    await this.prisma.organization.delete({ where: { id: Number(id) } });
    return { message: `Organization ${id} deleted` };
  }
}
