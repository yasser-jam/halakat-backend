// import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
// import { LogService } from './log.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import {
//   ApiBearerAuth,
//   ApiTags,
//   ApiOperation,
//   ApiQuery,
//   ApiBody,
//   ApiResponse,
// } from '@nestjs/swagger';
// import { LogEvent } from '@prisma/client';

// @ApiTags('Logs')
// @ApiBearerAuth('access-token')
// @UseGuards(JwtAuthGuard)
// @Controller('logs')
// export class LogController {
//   constructor(private readonly logService: LogService) {}

//   @Post()
//   @ApiOperation({ summary: 'Create a new log entry' })
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         event: { type: 'string' },
//         teacherId: { type: 'number', nullable: true },
//         extra: { type: 'string', nullable: true },
//       },
//       required: ['event'],
//     },
//   })
//   @ApiResponse({ status: 201, description: 'Log created successfully' })
//   async createLog(
//     @Body() body: { event: LogEvent; teacherId?: number; extra?: string },
//   ) {
//     return this.logService.createLog(body);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get logs with optional filters' })
//   @ApiQuery({ name: 'teacherId', required: false, type: Number })
//   @ApiQuery({ name: 'event', required: false, enum: LogEvent })
//   @ApiResponse({
//     status: 200,
//     description: 'List of logs returned successfully',
//   })
//   async getLogs(
//     @Query('teacherId') teacherId?: number,
//     @Query('event') event?: LogEvent,
//   ) {
//     return this.logService.getLogs({ teacherId, event });
//   }
// }
