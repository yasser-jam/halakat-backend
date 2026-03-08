import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LogController],
  providers: [LogService, PrismaService],
  exports: [LogService],
})
export class LogModule {}
