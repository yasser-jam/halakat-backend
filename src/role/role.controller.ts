import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
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
  getAll() {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.getRoleById(id);
  }
}
