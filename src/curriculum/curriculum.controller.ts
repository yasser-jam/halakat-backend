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
  // UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurriculumService } from './curriculum.service';
import {
  CreateCurriculumDto,
  UpdateCurriculumDto,
  CurriculumResponseDto,
} from '../dto/curriculum.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Curriculum Management')
@Controller('curriculum')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async create(
    @Body() createCurriculumDto: CreateCurriculumDto,
  ): Promise<CurriculumResponseDto> {
    return this.curriculumService.create(createCurriculumDto);
  }

  @Get()
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findAll(
    @Query('organizationId') organizationId?: string,
  ): Promise<CurriculumResponseDto[]> {
    const orgId = organizationId ? parseInt(organizationId, 10) : undefined;
    return this.curriculumService.findAll(orgId);
  }

  @Get(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CurriculumResponseDto> {
    return this.curriculumService.findOne(id);
  }

  @Patch(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurriculumDto: UpdateCurriculumDto,
  ): Promise<CurriculumResponseDto> {
    return this.curriculumService.update(id, updateCurriculumDto);
  }

  @Delete(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.curriculumService.remove(id);
    return { message: 'Curriculum deleted successfully' };
  }
}
