import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './campaign.dto';
import { UpdateCampaignDto } from '../dto/campaign.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({ status: 200, description: 'Return all campaigns' })
  async findAll(@Headers('mosque_id') mosqueId?: string) {
    return this.campaignService.findAll(Number(mosqueId));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({
    status: 201,
    description: 'The campaign has been successfully created.',
  })
  @ApiBody({ type: CreateCampaignDto })
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.create(createCampaignDto);
  }

  // Additional endpoints (current, findByTeacher, findByStudent) can be updated similarly if needed

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my-campaigns')
  @ApiOperation({
    summary: 'Get campaigns assigned to the authenticated teacher',
  })
  @ApiResponse({ status: 200, description: 'Return campaigns for the teacher' })
  async findCampaignsByTeacher(
    @Request() req,
    @Headers('mosque_id') mosqueId?: string,
  ) {
    const teacherId = req.user.id;
    const userRole = req.user.role;
    return this.campaignService.findByTeacherId(
      teacherId,
      userRole,
      mosqueId ? Number(mosqueId) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return the campaign with the given ID',
  })
  async findOne(@Param('id') id: number) {
    return this.campaignService.findOne(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The campaign has been successfully updated.',
  })
  @ApiBody({ type: UpdateCampaignDto })
  async update(
    @Param('id') id: number,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignService.update(Number(id), updateCampaignDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The campaign has been successfully deleted.',
  })
  async delete(@Param('id') id: number) {
    return this.campaignService.delete(Number(id));
  }
}
