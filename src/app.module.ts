import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { StudentsController } from './student.controller';
import { TeachersController } from './teacher/teacher.controller';
import { GroupsController } from './group/group.controller';
import { StudentService } from './student.service';
import { TeacherService } from './teacher/teacher.service';
import { GroupService } from './group/group.service';
import { CampaignsController } from './campaign/campaign.controller';
import { CampaignService } from './campaign/campaign.service';
import { UploadController } from './file/file.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AttendanceController } from './attendance/attendance.controller';
import { AttendanceService } from './attendance/attendance.service';

@Module({
  controllers: [
    AppController,
    StudentsController,
    TeachersController,
    GroupsController,
    CampaignsController,
    UploadController,
    AuthController,
    AttendanceController,
  ],
  providers: [
    AppService,
    PrismaService,
    StudentService,
    TeacherService,
    GroupService,
    CampaignService,
    AttendanceService,
  ],
  imports: [AuthModule],
})
export class AppModule {}
