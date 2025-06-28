import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './student.dto';
import { UpdateStudentDto } from '../dto/student.dto';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, description: 'Return all students' })
  async findAll() {
    return this.studentService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully created.',
  })
  @ApiBody({ type: CreateStudentDto })
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return the student with the given ID',
  })
  async findOne(@Param('id') id: number) {
    return this.studentService.findOne(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a student by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully updated.',
  })
  @ApiBody({ type: UpdateStudentDto })
  async update(
    @Param('id') id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(Number(id), updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully deleted.',
  })
  async delete(@Param('id') id: number) {
    return this.studentService.delete(Number(id));
  }

  // Assign
  @Put('assign/:id')
  @ApiOperation({ summary: 'Assign Student to Group' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully assigned.',
  })
  async assign(
    @Param('id') id: number,
    @Body() assignDto: { groupId: number; campaignId: number },
  ) {
    return this.studentService.assign(Number(id), assignDto);
  }

  // UnAssign
  @Put('unassign/:id')
  @ApiOperation({ summary: 'Un-Assign Student from Group' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully un-assigned.',
  })
  async unassign(
    @Param('id') id: number,
    @Body() body: { campaignId: number },
  ) {
    return this.studentService.unassign(Number(id), body.campaignId);
  }

  // List un assigned
  @Get('unassigned/:campaignId')
  @ApiOperation({ summary: 'List un-assigned students in campaign' })
  @ApiParam({ name: 'campaignId', type: Number })
  @ApiResponse({ status: 200, description: 'List of unassigned students' })
  async listUnassigned(@Param('campaignId') campaignId: number) {
    return this.studentService.listUnassigned(Number(campaignId));
  }
}
