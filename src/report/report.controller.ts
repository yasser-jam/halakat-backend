import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReportService } from './report.service';
import { GetReportDto, ReportResponseDto } from './report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('campaign')
  @ApiOperation({
    summary: 'Generate campaign report for a specific date range',
    description: 'Returns comprehensive campaign statistics including student/teacher counts, attendance data, lessons, saving sessions, and missed/delayed students.',
  })
  @ApiResponse({
    status: 200,
    description: 'Campaign report generated successfully',
    type: ReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date format or campaign ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Campaign not found',
  })
  @ApiQuery({
    name: 'campaign_id',
    description: 'Campaign ID',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'start_date',
    description: 'Start date in ISO format (YYYY-MM-DD)',
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'end_date',
    description: 'End date in ISO format (YYYY-MM-DD)',
    type: String,
    example: '2024-01-31',
  })
  async generateCampaignReport(@Query() query: GetReportDto): Promise<ReportResponseDto> {
    return this.reportService.generateCampaignReport(query);
  }
}

