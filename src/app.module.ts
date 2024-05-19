import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { StudentsController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [],
  controllers: [AppController, StudentsController],
  providers: [AppService, PrismaService, StudentService],
})
export class AppModule {}
