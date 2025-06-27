// import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import {
//   ApiBearerAuth,
//   ApiBody,
//   ApiOperation,
//   ApiResponse,
//   ApiTags,
// } from '@nestjs/swagger';
// import { EvaluationService } from './evaluation.service';
// import { CreateEvaluationDto } from './evaluation.dto';

// @ApiTags('Evaluation')
// @ApiBearerAuth('access-token')
// @Controller('evaluations')
// export class EvaluationController {
//   constructor(private readonly service: EvaluationService) {}

//   @Post()
//   create(@Body() dto: CreateEvaluationDto) {
//     return this.service.create(dto);
//   }

//   @Post('assert')
//   @ApiOperation({ summary: 'Assert campaign evaluations' })
//   @ApiResponse({ status: 200, description: 'Evaluations synced successfully.' })
//   @ApiBody({ type: CreateEvaluationDto, isArray: true })
//   async assert(
//     @Param('campaignId') campaignId: number,
//     @Body() body: { campaignId: number; evaluations: CreateEvaluationDto[] },
//   ) {
//     return this.service.assert(body.campaignId, body.evaluations);
//   }

//   @Get()
//   findAll() {
//     return this.service.findAll();
//   }

//   @Get('campaign/:campaignId')
//   findByCampaign(@Param('campaignId') campaignId: string) {
//     return this.service.findByCampaign(+campaignId);
//   }
// }
