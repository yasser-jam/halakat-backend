import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { LogService } from './log.service';
import { CreateLogDto } from './log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('logs')
@Controller('logs')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new log entry' })
  @ApiResponse({
    status: 201,
    description: 'The log has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Campaign ID is required in headers.',
  })
  @ApiHeader({
    name: 'campaign-id',
    description: 'Campaign ID for the log entry',
    required: true,
  })
  @ApiBody({ type: CreateLogDto })
  async create(
    @Body() createLogDto: CreateLogDto,
    @Headers('campaign-id') campaignId: string,
  ) {
    if (!campaignId) {
      throw new BadRequestException('Campaign ID is required in headers');
    }

    const campaignIdNumber = parseInt(campaignId, 10);
    if (isNaN(campaignIdNumber)) {
      throw new BadRequestException('Invalid campaign ID format');
    }

    return this.logService.create(createLogDto, campaignIdNumber);
  }

  @Get()
  @ApiOperation({ summary: 'Get all log entries' })
  @ApiResponse({ status: 200, description: 'Return all log entries' })
  @ApiHeader({
    name: 'campaign-id',
    description: 'Campaign ID to filter logs (optional)',
    required: false,
  })
  async findAll(@Headers('campaign-id') campaignId?: string) {
    const campaignIdNumber = campaignId ? parseInt(campaignId, 10) : undefined;

    if (campaignId && isNaN(campaignIdNumber)) {
      throw new BadRequestException('Invalid campaign ID format');
    }

    return this.logService.findAll(campaignIdNumber);
  }

  @Get('campaign/:campaignId')
  @ApiOperation({ summary: 'Get log entries for a specific campaign' })
  @ApiParam({ name: 'campaignId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return log entries for the specified campaign',
  })
  async findByCampaign(@Param('campaignId') campaignId: number) {
    return this.logService.findByCampaign(Number(campaignId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a log entry by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return the log entry with the given ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Log entry not found',
  })
  async findOne(@Param('id') id: number) {
    return this.logService.findOne(Number(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a log entry by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The log entry has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Log entry not found',
  })
  async delete(@Param('id') id: number) {
    return this.logService.delete(Number(id));
  }
}
