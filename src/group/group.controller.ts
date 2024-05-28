import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { GroupService } from './group.service';

import {
  CreateGroupDto,
  UpdateGroupDto,
  ValidateGroupIdDto,
  GroupListDto,
} from './../dto/group.dto';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({
    status: 200,
    description: 'Return all groups',
    type: [GroupListDto],
  })
  @Get()
  async findAll() {
    return this.groupService.findAll();
  }

  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'The group has been successfully created.',
    type: CreateGroupDto,
  })
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the group with the given ID',
    type: CreateGroupDto,
  })
  @Get(':id')
  async findOne(@Param() params: ValidateGroupIdDto) {
    return this.groupService.findOne(params);
  }

  @ApiOperation({ summary: 'Update a group by ID' })
  @ApiResponse({
    status: 200,
    description: 'The group has been successfully updated.',
    type: UpdateGroupDto,
  })
  @Put(':id')
  async update(
    @Param() params: ValidateGroupIdDto,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(params, updateGroupDto);
  }

  @ApiOperation({ summary: 'Delete a group by ID' })
  @ApiResponse({
    status: 200,
    description: 'The group has been successfully deleted.',
  })
  @Delete(':id')
  async delete(@Param() params: ValidateGroupIdDto) {
    return this.groupService.delete(params);
  }
}
