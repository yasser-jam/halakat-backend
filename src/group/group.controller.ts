import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

import { GroupService } from './group.service';

import {
  CreateGroupDto,
  GroupAssignDto,
  GroupListDto,
  UpdateGroupDto,
  ValidateGroupIdDto,
} from './../dto/group.dto';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupService) {}

  @ApiQuery({ name: 'campaignId' })
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({
    status: 200,
    description: 'Return all groups',
    type: [GroupListDto],
  })
  @Get('')
  async findAll(@Query('campaignId') campaignId?: string) {
    const campaignIdNumber = campaignId ? Number(campaignId) : undefined;
    return this.groupService.findAll(campaignIdNumber);
  }

  // Assign student
  @ApiOperation({ summary: 'Assign student into group' })
  @ApiResponse({
    status: 200,
    description: 'The student has been assigned successfuly.',
  })
  @Post('/assign/:groupId/:studentId/:campaignId')
  async assign(@Param() params: GroupAssignDto) {
    return this.groupService.assign(params);
  }

  @ApiOperation({ summary: 'Create a new group' })
  @ApiParam({ name: 'campaignId' })
  @ApiResponse({
    status: 201,
    description: 'The group has been successfully created.',
    type: CreateGroupDto,
  })
  @Post(':campaignId')
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Param() params: { campaignId: number },
  ) {
    return this.groupService.create(createGroupDto, params.campaignId);
  }

  // @ApiOperation({ summary: 'Get a group by ID' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Return the group with the given ID',
  //   type: CreateGroupDto,
  // })
  // @Get(':id')
  // async findOne(@Param() params: ValidateGroupIdDto) {
  //   return this.groupService.findOne(params);
  // }

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
