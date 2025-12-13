import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizationDto: any) {
    const {
      owner_phone,
      owner_first_name,
      owner_last_name,
      owner_password,
      ...orgData
    } = createOrganizationDto;

    return this.prisma.$transaction(async (tx) => {
      // Create the organization
      const org = await tx.organization.create({
        data: orgData,
      });

      // If owner information is provided, create the owner
      if (owner_phone) {
        const hashedPassword = await bcrypt.hash(owner_password, 10);

        const owner = await tx.teacher.create({
          data: {
            mobile_phone_number: owner_phone,
            first_name: owner_first_name,
            last_name: owner_last_name,
            password: hashedPassword,
            role: 'TEACHER',
          },
        });

        await tx.organizationManager.create({
          data: {
            teacher_id: owner.id,
            organization_id: org.id,
            role: 'OWNER',
            is_active: true,
          },
        });

        return { message: 'Organization created', data: { org, owner } };
      }

      return { message: 'Organization created', data: { org } };
    });
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
