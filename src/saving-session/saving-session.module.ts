import { Module } from '@nestjs/common';
import { SavingSessionService } from './saving-session.service';
import { SavingSessionController } from './saving-session.controller';
import { PrismaService } from '../prisma.service';
import { LogModule } from '../log/log.module';

@Module({
  controllers: [SavingSessionController],
  providers: [SavingSessionService, PrismaService],
  imports: [LogModule],
})
export class SavingSessionModule {}
