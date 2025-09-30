import { Module } from '@nestjs/common';
import { SessionSurahService } from './session-surah.service';
import { SessionSurahController } from './session-surah.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SessionSurahController],
  providers: [SessionSurahService, PrismaService],
  exports: [SessionSurahService],
})
export class SessionSurahModule {}



