// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Put,
//   Delete,
//   Query,
// } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
// import { TeacherService } from './teacher.service';
// import {
//   CreateTeacherDto,
//   UpdateTeacherDto,
//   ValidateTeacherIdDto,
//   TeacherListDto,
// } from './../dto/teacher.dto';

// @ApiTags('teachers')
// @Controller('teachers')
// export class TeachersController {
//   constructor(private readonly teacherService: TeacherService) {}

//   @ApiOperation({ summary: 'Get all teachers' })
//   @ApiResponse({
//     status: 200,
//     description: 'Return all teachers',
//     type: [TeacherListDto],
//   })
//   @Get()
//   async findAll(@Query('campaignId') campaignId?: number) {
//     return this.teacherService.findAll(campaignId);
//   }

//   @ApiOperation({ summary: 'Create a new teacher' })
//   @ApiResponse({
//     status: 201,
//     description: 'The teacher has been successfully created.',
//     type: CreateTeacherDto,
//   })
//   @Post()
//   async create(@Body() createTeacherDto: CreateTeacherDto) {
//     return this.teacherService.create(createTeacherDto);
//   }

//   @ApiOperation({ summary: 'Get a teacher by ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Return the teacher with the given ID',
//     type: CreateTeacherDto,
//   })
//   @Get(':id')
//   async findOne(@Param() params: ValidateTeacherIdDto) {
//     return this.teacherService.findOne(params);
//   }

//   @ApiOperation({ summary: 'Get a full teacher info by ID (for mobile)' })
//   @ApiResponse({
//     status: 200,
//     description: 'Return the teacher info with the given ID',
//     type: CreateTeacherDto,
//   })
//   @Get('mobile/:id')
//   async findInfo(@Param() params: ValidateTeacherIdDto) {
//     return this.teacherService.findInfo(params);
//   }

//   @ApiOperation({ summary: 'Update a teacher by ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'The teacher has been successfully updated.',
//     type: UpdateTeacherDto,
//   })
//   @Put(':id')
//   async update(
//     @Param() params: ValidateTeacherIdDto,
//     @Body() updateTeacherDto: UpdateTeacherDto,
//   ) {
//     return this.teacherService.update(params, updateTeacherDto);
//   }

//   @ApiOperation({ summary: 'Delete a teacher by ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'The teacher has been successfully deleted.',
//   })
//   @Delete(':id')
//   async delete(@Param() params: ValidateTeacherIdDto) {
//     return this.teacherService.delete(params);
//   }
// }
