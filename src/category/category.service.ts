import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // If organization_id is provided, verify it exists
    if (createCategoryDto.organization_id) {
      const organization = await this.prisma.organization.findUnique({
        where: { id: createCategoryDto.organization_id },
      });
      if (!organization) {
        throw new BadRequestException('Organization not found');
      }
    }

    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return this.mapToResponseDto(category);
  }

  async findAll(organizationId?: number): Promise<CategoryResponseDto[]> {
    const where = organizationId ? { organization_id: organizationId } : {};
    
    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return categories.map(category => this.mapToResponseDto(category));
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.mapToResponseDto(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    // If organization_id is provided, verify it exists
    if (updateCategoryDto.organization_id) {
      const organization = await this.prisma.organization.findUnique({
        where: { id: updateCategoryDto.organization_id },
      });
      if (!organization) {
        throw new BadRequestException('Organization not found');
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return this.mapToResponseDto(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if category is being used by any curricula
    const curriculumCount = await this.prisma.curriculumCategory.count({
      where: { category_id: id },
    });

    if (curriculumCount > 0) {
      throw new BadRequestException('Cannot delete category that is associated with curricula');
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }

  private mapToResponseDto(category: any): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      organization_id: category.organization_id,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }
}

