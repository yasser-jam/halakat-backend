// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Put,
//   Delete,
// } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { StudentService } from './student.service';
// import {
//   CreateStudentDto,
//   UpdateStudentDto,
//   ValidateStudentIdDto,
//   StudentListDto,
//   AssignToGroupDto,
// } from './dto/student.dto';

// @ApiTags('students')
// @Controller('students')
// export class StudentsController {
//   constructor(private readonly studentService: StudentService) {}

//   @ApiOperation({ summary: 'Get all students' })
//   @ApiResponse({
//     status: 200,
//     description: 'Return all students',
//     type: [StudentListDto],
//   })
//   @Get()
//   async findAll() {
//     return this.studentService.findAll();
//   }

//   @ApiOperation({ summary: 'Create a new student' })
//   @ApiResponse({
//     status: 201,
//     description: 'The student has been successfully created.',
//     type: CreateStudentDto,
//   })
//   @Post()
//   async create(@Body() createStudentDto: CreateStudentDto) {
//     return this.studentService.create(createStudentDto);
//   }

//   @ApiOperation({ summary: 'Get a student by ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Return the student with the given ID',
//     type: CreateStudentDto,
//   })
//   @Get(':id')
//   async findOne(@Param() params: ValidateStudentIdDto) {
//     return this.studentService.findOne(params);
//   }

//   @ApiOperation({ summary: 'Update a student by ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'The student has been successfully updated.',
//     type: UpdateStudentDto,
//   })
//   @Put(':id')
//   async update(
//     @Param() params: ValidateStudentIdDto,
//     @Body() updateStudentDto: UpdateStudentDto,
//   ) {
//     return this.studentService.update(params, updateStudentDto);
//   }

//   @ApiOperation({ summary: 'Delete a student by ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'The student has been successfully deleted.',
//   })
//   @Delete(':id')
//   async delete(@Param() params: ValidateStudentIdDto) {
//     return this.studentService.delete(params);
//   }

//   // Assign
//   @ApiOperation({ summary: 'Assign Student to Group' })
//   @ApiResponse({
//     status: 200,
//     description: 'The student has been successfuly assigned.',
//   })
//   @Put('assign/:id')
//   async assign(
//     @Param() params: ValidateStudentIdDto,
//     @Body() assignDto: AssignToGroupDto,
//   ) {
//     return this.studentService.assign(params, assignDto);
//   }

//   // UnAssign
//   @ApiOperation({ summary: 'Un-Assign Student from Group' })
//   @ApiResponse({
//     status: 200,
//     description: 'The student has been successfuly un-assigned.',
//   })
//   @Put('unassign/:id')
//   async unassign(@Param() params: ValidateStudentIdDto) {
//     return this.studentService.unassign(params);
//   }

//   // List un assigned
//   @ApiOperation({ summary: 'List un-assigned students in campaign' })
//   @ApiResponse({
//     status: 200,
//   })
//   @Get('unassigned/:campaignId')
//   async listUnassigned(@Param() params: ValidateStudentIdDto) {
//     return this.studentService.listUnassigned(params);
//   }
// }
