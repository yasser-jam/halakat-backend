import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './role.dto';

@ApiTags('Roles')
@ApiBearerAuth('access-token')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create new role with permissions' })
  @ApiResponse({ status: 201, description: 'Role created' })
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  getAll(@Headers('campaign_id') campaign_id: string) {
    return this.roleService.getAllRoles(campaign_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.getRoleById(id);
  }

  @Post('bulk-update-permissions')
  @ApiBody({
    isArray: true,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          role_id: { type: 'number' },
          permissions: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        required: ['role_id', 'permissions'],
      },
    },
  })
  async bulkUpdatePermissions(
    @Body()
    updates: Array<{ role_id: number; permissions: string[] }>,
  ) {
    return this.roleService.bulkUpdatePermissions(updates);
  }
}
