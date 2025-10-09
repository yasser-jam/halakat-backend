import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCurriculumDto, UpdateCurriculumDto, CurriculumResponseDto } from '../dto/curriculum.dto';

@Injectable()
export class CurriculumService {
  constructor(private prisma: PrismaService) {}

  async create(createCurriculumDto: CreateCurriculumDto): Promise<CurriculumResponseDto> {
    const { category_ids, ...curriculumData } = createCurriculumDto;

    // If organization_id is provided, verify it exists
    if (curriculumData.organization_id) {
      const organization = await this.prisma.organization.findUnique({
        where: { id: curriculumData.organization_id },
      });
      if (!organization) {
        throw new BadRequestException('Organization not found');
      }
    }

    // If category_ids are provided, verify they exist
    if (category_ids && category_ids.length > 0) {
      const categories = await this.prisma.category.findMany({
        where: { id: { in: category_ids } },
      });
      if (categories.length !== category_ids.length) {
        throw new BadRequestException('One or more categories not found');
      }
    }

    const curriculum = await this.prisma.curriculum.create({
      data: {
        ...curriculumData,
        categories: category_ids
          ? {
              create: category_ids.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return this.mapToResponseDto(curriculum);
  }

  async findAll(organizationId?: number): Promise<CurriculumResponseDto[]> {
    const where = organizationId ? { organization_id: organizationId } : {};
    
    const curricula = await this.prisma.curriculum.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return curricula.map(curriculum => this.mapToResponseDto(curriculum));
  }

  async findOne(id: number): Promise<CurriculumResponseDto> {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!curriculum) {
      throw new NotFoundException('Curriculum not found');
    }

    return this.mapToResponseDto(curriculum);
  }

  async update(id: number, updateCurriculumDto: UpdateCurriculumDto): Promise<CurriculumResponseDto> {
    const { category_ids, ...curriculumData } = updateCurriculumDto;

    // Check if curriculum exists
    const existingCurriculum = await this.prisma.curriculum.findUnique({
      where: { id },
    });

    if (!existingCurriculum) {
      throw new NotFoundException('Curriculum not found');
    }

    // If organization_id is provided, verify it exists
    if (curriculumData.organization_id) {
      const organization = await this.prisma.organization.findUnique({
        where: { id: curriculumData.organization_id },
      });
      if (!organization) {
        throw new BadRequestException('Organization not found');
      }
    }

    // If category_ids are provided, verify they exist
    if (category_ids && category_ids.length > 0) {
      const categories = await this.prisma.category.findMany({
        where: { id: { in: category_ids } },
      });
      if (categories.length !== category_ids.length) {
        throw new BadRequestException('One or more categories not found');
      }
    }

    // Update curriculum and handle category relationships
    const curriculum = await this.prisma.curriculum.update({
      where: { id },
      data: {
        ...curriculumData,
        ...(category_ids !== undefined && {
          categories: {
            deleteMany: {}, // Remove all existing relationships
            create: category_ids.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          },
        }),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return this.mapToResponseDto(curriculum);
  }

  async remove(id: number): Promise<void> {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
    });

    if (!curriculum) {
      throw new NotFoundException('Curriculum not found');
    }

    await this.prisma.curriculum.delete({
      where: { id },
    });
  }

  private mapToResponseDto(curriculum: any): CurriculumResponseDto {
    return {
      id: curriculum.id,
      name: curriculum.name,
      description: curriculum.description,
      organization_id: curriculum.organization_id,
      created_at: curriculum.created_at,
      updated_at: curriculum.updated_at,
      categories: curriculum.categories?.map((cc: any) => ({
        id: cc.category.id,
        name: cc.category.name,
        description: cc.category.description,
        color: cc.category.color,
        organization_id: cc.category.organization_id,
        created_at: cc.category.created_at,
        updated_at: cc.category.updated_at,
      })),
    };
  }
}

