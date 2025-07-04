import { Module } from '@nestjs/common';
import { MistakeService } from './mistake.service';
import { MistakeController } from './mistake.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MistakeController],
  providers: [MistakeService, PrismaService],
})
export class MistakeModule {}
