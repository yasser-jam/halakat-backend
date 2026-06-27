import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { SubjectService } from './subject.service';
import {
  CreateSubjectDto,
  UpdateSubjectDto,
  SubjectResponseDto,
} from '../dto/subject.dto';

@ApiTags('Curriculum Management')
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @ApiHeader({
    name: 'organization-id',
    required: false,
    description: 'Organization ID when not provided in the request body',
  })
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
    @Headers('organization-id') organizationId?: string,
  ): Promise<SubjectResponseDto> {
    const orgIdFromHeader = organizationId
      ? parseInt(organizationId, 10)
      : undefined;

    return this.subjectService.create({
      ...createSubjectDto,
      organization_id:
        createSubjectDto.organization_id ?? orgIdFromHeader,
    });
  }

  @Get()
  @ApiHeader({
    name: 'organization-id',
    required: false,
    description: 'Filter subjects by organization ID',
  })
  async findAll(
    @Headers('organization-id') organizationId?: string,
  ): Promise<SubjectResponseDto[]> {
    const orgId = organizationId ? parseInt(organizationId, 10) : undefined;
    return this.subjectService.findAll(orgId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SubjectResponseDto> {
    return this.subjectService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.subjectService.remove(id);
    return { message: 'Subject deleted successfully' };
  }
}
