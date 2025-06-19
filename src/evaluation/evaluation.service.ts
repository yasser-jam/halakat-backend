import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEvaluationDto } from './evaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateEvaluationDto) {
    return this.prisma.evaluation.create({ data });
  }

  findAll() {
    return this.prisma.evaluation.findMany();
  }

  findByCampaign(campaignId: number) {
    return this.prisma.evaluation.findMany({ where: { campaignId } });
  }
}
