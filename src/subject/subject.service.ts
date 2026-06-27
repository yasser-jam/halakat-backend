import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSubjectDto, UpdateSubjectDto, SubjectResponseDto } from '../dto/subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<SubjectResponseDto> {
    if (createSubjectDto.organization_id) {
      const organization = await this.prisma.organization.findUnique({
        where: { id: createSubjectDto.organization_id },
      });
      if (!organization) {
        throw new BadRequestException('Organization not found');
      }
    }

    const subject = await this.prisma.subject.create({
      data: createSubjectDto,
    });

    return this.mapToResponseDto(subject);
  }

  async findAll(organizationId?: number): Promise<SubjectResponseDto[]> {
    const where = organizationId ? { organization_id: organizationId } : {};

    const subjects = await this.prisma.subject.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return subjects.map((subject) => this.mapToResponseDto(subject));
  }

  async findOne(id: number): Promise<SubjectResponseDto> {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return this.mapToResponseDto(subject);
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto): Promise<SubjectResponseDto> {
    const existingSubject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!existingSubject) {
      throw new NotFoundException('Subject not found');
    }

    if (updateSubjectDto.organization_id) {
      const organization = await this.prisma.organization.findUnique({
        where: { id: updateSubjectDto.organization_id },
      });
      if (!organization) {
        throw new BadRequestException('Organization not found');
      }
    }

    const subject = await this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto,
    });

    return this.mapToResponseDto(subject);
  }

  async remove(id: number): Promise<void> {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const sessionCount = await this.prisma.subjectSession.count({
      where: { subject_id: id },
    });

    if (sessionCount > 0) {
      throw new BadRequestException('Cannot delete subject that has sessions');
    }

    await this.prisma.subject.delete({
      where: { id },
    });
  }

  private mapToResponseDto(subject: {
    id: number;
    title: string;
    organization_id: number | null;
    created_at: Date;
    updated_at: Date;
  }): SubjectResponseDto {
    return {
      id: subject.id,
      title: subject.title,
      organization_id: subject.organization_id ?? undefined,
      created_at: subject.created_at,
      updated_at: subject.updated_at,
    };
  }
}
