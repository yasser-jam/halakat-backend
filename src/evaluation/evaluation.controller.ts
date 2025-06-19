import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './evaluation.dto';

@ApiTags('Evaluation')
@ApiBearerAuth('access-token')
@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly service: EvaluationService) {}

  @Post()
  create(@Body() dto: CreateEvaluationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.service.findByCampaign(+campaignId);
  }
}
