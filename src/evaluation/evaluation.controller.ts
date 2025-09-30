import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { EvaluationService } from './evaluation.service';
import {
  CreateEvaluationDto,
  EvaluationResponseDto,
  AssertEvaluationsDto,
} from './evaluation.dto';

@ApiTags('Evaluation')
@ApiBearerAuth('access-token')
@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly service: EvaluationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new evaluation' })
  @ApiResponse({
    status: 201,
    description: 'Evaluation created successfully.',
    type: EvaluationResponseDto,
  })
  create(@Body() dto: CreateEvaluationDto) {
    return this.service.create(dto);
  }

  @Post('assert')
  @ApiOperation({ summary: 'Assert campaign evaluations' })
  @ApiResponse({ status: 200, description: 'Evaluations synced successfully.' })
  @ApiBody({ type: AssertEvaluationsDto })
  async assert(@Body() body: AssertEvaluationsDto) {
    return this.service.assert(body.campaignId, body.evaluations);
  }

  @Get()
  @ApiOperation({ summary: 'Get all evaluations for a campaign' })
  @ApiResponse({
    status: 200,
    description: 'Returns evaluations with usage statistics.',
    type: [EvaluationResponseDto],
  })
  findAll(@Headers('campaign_id') campaignId: string) {
    return this.service.findAll(campaignId);
  }

  @Get('campaign/:campaignId/stats')
  @ApiOperation({ summary: 'Get evaluation statistics for a campaign' })
  @ApiParam({ name: 'campaignId', description: 'Campaign ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns detailed evaluation statistics.',
  })
  getStats(@Param('campaignId') campaignId: string) {
    return this.service.getEvaluationStats(+campaignId);
  }

  @Get('campaign/:campaignId')
  @ApiOperation({ summary: 'Get evaluations by campaign ID' })
  @ApiParam({ name: 'campaignId', description: 'Campaign ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns evaluations for the specified campaign.',
  })
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.service.findByCampaign(+campaignId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get evaluation by ID' })
  @ApiParam({ name: 'id', description: 'Evaluation ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns evaluation details.',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Evaluation not found.' })
  findById(@Param('id') id: string) {
    return this.service.findById(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update evaluation' })
  @ApiParam({ name: 'id', description: 'Evaluation ID' })
  @ApiResponse({
    status: 200,
    description: 'Evaluation updated successfully.',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Evaluation not found.' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateEvaluationDto>) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete evaluation' })
  @ApiParam({ name: 'id', description: 'Evaluation ID' })
  @ApiResponse({ status: 200, description: 'Evaluation deleted successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete evaluation as it is being used.',
  })
  @ApiResponse({ status: 404, description: 'Evaluation not found.' })
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
