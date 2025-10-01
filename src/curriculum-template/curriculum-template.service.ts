import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { 
  CreateCurriculumTemplateDto, 
  UpdateCurriculumTemplateDto, 
  CurriculumTemplateResponseDto,
  CreateCurriculumTemplateNodeDto,
  UpdateCurriculumTemplateNodeDto,
  CurriculumTemplateNodeResponseDto,
  NodeStatus
} from '../dto/curriculum-template.dto';

@Injectable()
export class CurriculumTemplateService {
  constructor(private prisma: PrismaService) {}

  // CurriculumTemplate CRUD operations
  async create(createCurriculumTemplateDto: CreateCurriculumTemplateDto): Promise<CurriculumTemplateResponseDto> {
    // Verify curriculum exists
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id: createCurriculumTemplateDto.curriculum_id },
    });
    if (!curriculum) {
      throw new BadRequestException('Curriculum not found');
    }

    // Verify campaign exists
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: createCurriculumTemplateDto.campaign_id },
    });
    if (!campaign) {
      throw new BadRequestException('Campaign not found');
    }

    // Check if template already exists for this curriculum-campaign combination
    const existingTemplate = await this.prisma.curriculumTemplate.findUnique({
      where: {
        curriculum_id_campaign_id: {
          curriculum_id: createCurriculumTemplateDto.curriculum_id,
          campaign_id: createCurriculumTemplateDto.campaign_id,
        },
      },
    });

    if (existingTemplate) {
      throw new BadRequestException('Template already exists for this curriculum and campaign');
    }

    const template = await this.prisma.curriculumTemplate.create({
      data: createCurriculumTemplateDto,
      include: {
        curriculum: true,
        campaign: true,
        nodes: {
          orderBy: { order_index: 'asc' },
        },
      },
    });

    return this.mapTemplateToResponseDto(template);
  }

  async findAll(campaignId?: number, curriculumId?: number): Promise<CurriculumTemplateResponseDto[]> {
    const where: any = {};
    if (campaignId) where.campaign_id = campaignId;
    if (curriculumId) where.curriculum_id = curriculumId;

    const templates = await this.prisma.curriculumTemplate.findMany({
      where,
      include: {
        curriculum: true,
        campaign: true,
        nodes: {
          orderBy: { order_index: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return templates.map(template => this.mapTemplateToResponseDto(template));
  }

  async findOne(id: number): Promise<CurriculumTemplateResponseDto> {
    const template = await this.prisma.curriculumTemplate.findUnique({
      where: { id },
      include: {
        curriculum: true,
        campaign: true,
        nodes: {
          include: {
            children: {
              orderBy: { order_index: 'asc' },
            },
            parent: true,
          },
          orderBy: { order_index: 'asc' },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Curriculum template not found');
    }

    return this.mapTemplateToResponseDto(template);
  }

  async update(id: number, updateCurriculumTemplateDto: UpdateCurriculumTemplateDto): Promise<CurriculumTemplateResponseDto> {
    const existingTemplate = await this.prisma.curriculumTemplate.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      throw new NotFoundException('Curriculum template not found');
    }

    // Verify curriculum exists if provided
    if (updateCurriculumTemplateDto.curriculum_id) {
      const curriculum = await this.prisma.curriculum.findUnique({
        where: { id: updateCurriculumTemplateDto.curriculum_id },
      });
      if (!curriculum) {
        throw new BadRequestException('Curriculum not found');
      }
    }

    // Verify campaign exists if provided
    if (updateCurriculumTemplateDto.campaign_id) {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: updateCurriculumTemplateDto.campaign_id },
      });
      if (!campaign) {
        throw new BadRequestException('Campaign not found');
      }
    }

    const template = await this.prisma.curriculumTemplate.update({
      where: { id },
      data: updateCurriculumTemplateDto,
      include: {
        curriculum: true,
        campaign: true,
        nodes: {
          orderBy: { order_index: 'asc' },
        },
      },
    });

    return this.mapTemplateToResponseDto(template);
  }

  async remove(id: number): Promise<void> {
    const template = await this.prisma.curriculumTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Curriculum template not found');
    }

    await this.prisma.curriculumTemplate.delete({
      where: { id },
    });
  }

  // CurriculumTemplateNode CRUD operations
  async createNode(createNodeDto: CreateCurriculumTemplateNodeDto): Promise<CurriculumTemplateNodeResponseDto> {
    // Verify template exists
    const template = await this.prisma.curriculumTemplate.findUnique({
      where: { id: createNodeDto.template_id },
    });
    if (!template) {
      throw new BadRequestException('Template not found');
    }

    // Verify parent exists if provided
    if (createNodeDto.parent_id) {
      const parent = await this.prisma.curriculumTemplateNode.findUnique({
        where: { id: createNodeDto.parent_id },
      });
      if (!parent) {
        throw new BadRequestException('Parent node not found');
      }
    }

    const node = await this.prisma.curriculumTemplateNode.create({
      data: {
        ...createNodeDto,
        status: createNodeDto.status || NodeStatus.PLANNED,
      },
      include: {
        children: {
          orderBy: { order_index: 'asc' },
        },
        parent: true,
      },
    });

    return this.mapNodeToResponseDto(node);
  }

  async findNodesByTemplate(templateId: number): Promise<CurriculumTemplateNodeResponseDto[]> {
    const nodes = await this.prisma.curriculumTemplateNode.findMany({
      where: { template_id: templateId },
      include: {
        children: {
          orderBy: { order_index: 'asc' },
        },
        parent: true,
      },
      orderBy: { order_index: 'asc' },
    });

    return nodes.map(node => this.mapNodeToResponseDto(node));
  }

  async findNode(id: number): Promise<CurriculumTemplateNodeResponseDto> {
    const node = await this.prisma.curriculumTemplateNode.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { order_index: 'asc' },
        },
        parent: true,
      },
    });

    if (!node) {
      throw new NotFoundException('Template node not found');
    }

    return this.mapNodeToResponseDto(node);
  }

  async updateNode(id: number, updateNodeDto: UpdateCurriculumTemplateNodeDto): Promise<CurriculumTemplateNodeResponseDto> {
    const existingNode = await this.prisma.curriculumTemplateNode.findUnique({
      where: { id },
    });

    if (!existingNode) {
      throw new NotFoundException('Template node not found');
    }

    // Verify template exists if provided
    if (updateNodeDto.template_id) {
      const template = await this.prisma.curriculumTemplate.findUnique({
        where: { id: updateNodeDto.template_id },
      });
      if (!template) {
        throw new BadRequestException('Template not found');
      }
    }

    // Verify parent exists if provided
    if (updateNodeDto.parent_id) {
      const parent = await this.prisma.curriculumTemplateNode.findUnique({
        where: { id: updateNodeDto.parent_id },
      });
      if (!parent) {
        throw new BadRequestException('Parent node not found');
      }
    }

    const node = await this.prisma.curriculumTemplateNode.update({
      where: { id },
      data: updateNodeDto,
      include: {
        children: {
          orderBy: { order_index: 'asc' },
        },
        parent: true,
      },
    });

    return this.mapNodeToResponseDto(node);
  }

  async removeNode(id: number): Promise<void> {
    const node = await this.prisma.curriculumTemplateNode.findUnique({
      where: { id },
    });

    if (!node) {
      throw new NotFoundException('Template node not found');
    }

    await this.prisma.curriculumTemplateNode.delete({
      where: { id },
    });
  }

  private mapTemplateToResponseDto(template: any): CurriculumTemplateResponseDto {
    return {
      id: template.id,
      curriculum_id: template.curriculum_id,
      campaign_id: template.campaign_id,
      name: template.name,
      notes: template.notes,
      created_at: template.created_at,
      updated_at: template.updated_at,
      curriculum: template.curriculum ? {
        id: template.curriculum.id,
        name: template.curriculum.name,
        description: template.curriculum.description,
      } : undefined,
      campaign: template.campaign ? {
        id: template.campaign.id,
        name: template.campaign.name,
      } : undefined,
      nodes: template.nodes?.map((node: any) => this.mapNodeToResponseDto(node)),
    };
  }

  private mapNodeToResponseDto(node: any): CurriculumTemplateNodeResponseDto {
    return {
      id: node.id,
      template_id: node.template_id,
      parent_id: node.parent_id,
      name: node.name,
      description: node.description,
      node_type: node.node_type,
      order_index: node.order_index,
      estimated_lessons_count: node.estimated_lessons_count,
      estimated_duration_minutes: node.estimated_duration_minutes,
      lesson_span: node.lesson_span,
      status: node.status,
      created_at: node.created_at,
      updated_at: node.updated_at,
      children: node.children?.map((child: any) => this.mapNodeToResponseDto(child)),
      parent: node.parent ? this.mapNodeToResponseDto(node.parent) : undefined,
    };
  }
}
