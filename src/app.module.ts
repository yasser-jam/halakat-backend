import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { StudentsController } from './student.controller';
import { TeachersController } from './teacher/teacher.controller';
import { StudentService } from './student.service';
import { TeacherService } from './teacher/teacher.service';

@Module({
  controllers: [AppController, StudentsController, TeachersController],
  providers: [AppService, PrismaService, StudentService, TeacherService],
})
export class AppModule {}
