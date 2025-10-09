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
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from '../dto/category.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Curriculum Management')
@Controller('category')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findAll(
    @Query('organizationId') organizationId?: string,
  ): Promise<CategoryResponseDto[]> {
    const orgId = organizationId ? parseInt(organizationId, 10) : undefined;
    return this.categoryService.findAll(orgId);
  }

  @Get(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  // @Roles(Permission.CURRICULUM_MANAGEMENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.categoryService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}
