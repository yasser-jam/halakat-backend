import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRoleDto } from './role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async createRole(dto: CreateRoleDto) {
    const role = await this.prisma.appRole.create({
      data: {
        name: dto.name,
        description: dto.description,
        permissions: dto.permissions,
      },
    });

    return role;
  }

  async getAllRoles() {
    return this.prisma.appRole.findMany();
  }

  async getRoleById(id: number) {
    return this.prisma.appRole.findUnique({ where: { id } });
  }

  async bulkUpdatePermissions(
    updates: Array<{ role_id: number; permissions: string[] }>,
  ) {
    for (const update of updates) {
      await this.prisma.appRole.update({
        where: {
          id: update.role_id,
        },
        data: {
          id: update.role_id,
          permissions: update.permissions,
        },
      });
    }

    return { message: 'Roles updated successfully' };
  }
}
