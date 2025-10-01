import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurriculumTemplateService } from './curriculum-template.service';
import { 
  CreateCurriculumTemplateDto, 
  UpdateCurriculumTemplateDto, 
  CurriculumTemplateResponseDto,
  CreateCurriculumTemplateNodeDto,
  UpdateCurriculumTemplateNodeDto,
  CurriculumTemplateNodeResponseDto
} from '../dto/curriculum-template.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Permission } from '../role/permissions.enum';

@ApiTags('Curriculum Management')
@Controller('curriculum-template')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CurriculumTemplateController {
  constructor(private readonly curriculumTemplateService: CurriculumTemplateService) {}

  // CurriculumTemplate endpoints
  @Post()
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async create(@Body() createCurriculumTemplateDto: CreateCurriculumTemplateDto): Promise<CurriculumTemplateResponseDto> {
    return this.curriculumTemplateService.create(createCurriculumTemplateDto);
  }

  @Get()
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findAll(
    @Query('campaignId') campaignId?: string,
    @Query('curriculumId') curriculumId?: string
  ): Promise<CurriculumTemplateResponseDto[]> {
    const campId = campaignId ? parseInt(campaignId, 10) : undefined;
    const currId = curriculumId ? parseInt(curriculumId, 10) : undefined;
    return this.curriculumTemplateService.findAll(campId, currId);
  }

  @Get(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CurriculumTemplateResponseDto> {
    return this.curriculumTemplateService.findOne(id);
  }

  @Patch(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurriculumTemplateDto: UpdateCurriculumTemplateDto,
  ): Promise<CurriculumTemplateResponseDto> {
    return this.curriculumTemplateService.update(id, updateCurriculumTemplateDto);
  }

  @Delete(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.curriculumTemplateService.remove(id);
    return { message: 'Curriculum template deleted successfully' };
  }

  // CurriculumTemplateNode endpoints
  @Post('node')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async createNode(@Body() createNodeDto: CreateCurriculumTemplateNodeDto): Promise<CurriculumTemplateNodeResponseDto> {
    return this.curriculumTemplateService.createNode(createNodeDto);
  }

  @Get(':templateId/nodes')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findNodesByTemplate(@Param('templateId', ParseIntPipe) templateId: number): Promise<CurriculumTemplateNodeResponseDto[]> {
    return this.curriculumTemplateService.findNodesByTemplate(templateId);
  }

  @Get('node/:id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findNode(@Param('id', ParseIntPipe) id: number): Promise<CurriculumTemplateNodeResponseDto> {
    return this.curriculumTemplateService.findNode(id);
  }

  @Patch('node/:id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async updateNode(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNodeDto: UpdateCurriculumTemplateNodeDto,
  ): Promise<CurriculumTemplateNodeResponseDto> {
    return this.curriculumTemplateService.updateNode(id, updateNodeDto);
  }

  @Delete('node/:id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async removeNode(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.curriculumTemplateService.removeNode(id);
    return { message: 'Template node deleted successfully' };
  }
}
