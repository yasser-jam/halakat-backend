// import { Controller, Post, Body, Get, Param, Query, Delete } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiParam,
//   ApiQuery,
// } from '@nestjs/swagger';
// import { SavingSessionService } from './saving-session.service';
// import {
//   CreateSavingSessionDto,
//   FilterSavingSessionDto,
//   SavingSessionDto,
// } from '../dto/saving.dto';

// @ApiTags('saving-sessions')
// @Controller('saving-sessions')
// export class SavingSessionController {
//   constructor(private readonly savingSessionService: SavingSessionService) {}

//   @ApiOperation({ summary: 'Create a new saving session' })
//   @ApiResponse({
//     status: 201,
//     description: 'The saving session has been successfully created.',
//     type: SavingSessionDto,
//   })
//   @Post()
//   async create(@Body() createSavingSessionDto: CreateSavingSessionDto) {
//     return this.savingSessionService.createSavingSession(
//       createSavingSessionDto,
//     );
//   }

//   @ApiOperation({ summary: 'Get all saving sessions' })
//   @ApiResponse({
//     status: 200,
//     description: 'Returns a list of all saving sessions.',
//     type: [SavingSessionDto],
//   })
//   @Get()
//   async findAll() {
//     return this.savingSessionService.getAll();
//   }

//   @Get('filter')
//   @ApiQuery({ name: 'studentId', required: false, type: Number })
//   @ApiQuery({ name: 'teacherId', required: false, type: Number })
//   @ApiQuery({ name: 'mistakeId', required: false, type: Number })
//   @ApiQuery({ name: 'campaignId', required: false, type: Number })
//   @ApiQuery({
//     name: 'dateFrom',
//     required: false,
//     type: String,
//     example: '2024-01-01',
//   })
//   @ApiQuery({
//     name: 'dateTo',
//     required: false,
//     type: String,
//     example: '2025-12-31',
//   })
//   filter(@Query() query: FilterSavingSessionDto) {
//     return this.savingSessionService.filter(query);
//   }

//   @ApiOperation({ summary: 'Get saving session by ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Returns a saving session by its ID.',
//     type: SavingSessionDto,
//   })
//   @ApiParam({
//     name: 'id',
//     required: true,
//     type: Number,
//     description: 'The ID of the saving session',
//   })
//   @Get(':id')
//   async findOne(@Param('id') id: number) {
//     return this.savingSessionService.getById(id);
//   }

//     @ApiOperation({ summary: 'Delete Saving Session' })
//   @ApiResponse({
//     status: 200,
//     description: 'Deleted Successfully',
//   })
//   @ApiParam({
//     name: 'id',
//     required: true,
//     type: Number,
//     description: 'The ID of the saving session',
//   })
//   @Delete(':id')
//   async remove(@Param('id') id: number) {
//     return this.savingSessionService.remove(Number(id));
//   }

// }
