import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MistakeService } from './mistake.service';
import {
  AssertCampaignMistakesDto,
  CreateMistakeDto,
  UpdateMistakeDto,
  ValidateMistakeIdDto,
} from '../dto/mistake.dto';

@ApiTags('mistakes')
@Controller('mistakes')
export class MistakeController {
  constructor(private readonly mistakeService: MistakeService) {}

  @ApiOperation({ summary: 'Create a mistake (admin only)' })
  @ApiResponse({ status: 201, description: 'Mistake created successfully.' })
  @Post()
  async create(@Body() dto: CreateMistakeDto) {
    return this.mistakeService.create(dto);
  }

  @ApiOperation({ summary: 'Get all mistakes' })
  @ApiResponse({ status: 200, description: 'List of all mistakes' })
  @Get()
  async findAll() {
    return this.mistakeService.findAll();
  }

  @ApiOperation({ summary: 'Get a mistake by ID' })
  @ApiResponse({ status: 200, description: 'The mistake with the given ID' })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async findOne(@Param() params: ValidateMistakeIdDto) {
    return this.mistakeService.findOne(params);
  }

  @ApiOperation({ summary: 'Update a mistake by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Mistake updated successfully.' })
  @Put(':id')
  async update(
    @Param() params: ValidateMistakeIdDto,
    @Body() dto: UpdateMistakeDto,
  ) {
    return this.mistakeService.update(params, dto);
  }

  @ApiOperation({ summary: 'Delete a mistake by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Mistake deleted successfully.' })
  @Delete(':id')
  async delete(@Param() params: ValidateMistakeIdDto) {
    return this.mistakeService.delete(params);
  }

  @Get('campaign/:campaignId')
  @ApiOperation({ summary: 'List all mistakes in a specific campaign' })
  @ApiResponse({
    status: 200,
    description: 'List of mistakes for the given campaign',
  })
  @ApiParam({ name: 'campaignId', type: Number })
  async getMistakesByCampaign(@Param('campaignId') campaignId: number) {
    return this.mistakeService.findByCampaign(campaignId);
  }

  @ApiTags('Mistakes')
  @Post('assert')
  @ApiOperation({ summary: 'Assert campaign mistakes' })
  @ApiResponse({ status: 200, description: 'Mistakes synced successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async assertCampaignMistakes(@Body() body: AssertCampaignMistakesDto) {
    return this.mistakeService.assertCampaignMistakes(
      body.campaignId,
      body.mistakes as any,
    );
  }
}
