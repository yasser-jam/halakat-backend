import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
// import { StudentsController } from './student.controller';
// import { TeachersController } from './teacher/teacher.controller';
// import { GroupsController } from './group/group.controller';
// import { StudentService } from './student.service';
// import { TeacherService } from './teacher/teacher.service';
// import { GroupService } from './group/group.service';
// import { CampaignsController } from './campaign/campaign.controller';
// import { CampaignService } from './campaign/campaign.service';
// import { UploadController } from './file/file.controller';
// import { AuthModule } from './auth/auth.module';
// import { AuthController } from './auth/auth.controller';
// import { AttendanceController } from './attendance/attendance.controller';
// import { AttendanceService } from './attendance/attendance.service';
// import { MistakeModule } from './mistake/mistake.module';
// import { SavingSessionModule } from './saving-session/saving-session.module';
// import { EvaluationController } from './evaluation/evaluation.controller';
// import { EvaluationService } from './evaluation/evaluation.service';
// import { RoleService } from './role/role.service';
// import { RoleController } from './role/role.controller';
// import { LogController } from './log/log.controller';
// import { LogService } from './log/log.service';
import { OrganizationController } from './organization/organization.controller';
import { OrganizationService } from './organization/organization.service';

@Module({
  controllers: [
    AppController,
    // RoleController,
    // StudentsController,
    // TeachersController,
    // GroupsController,
    // CampaignsController,
    // UploadController,
    // AuthController,
    // AttendanceController,
    // EvaluationController,
    // LogController,
    OrganizationController,
  ],
  providers: [
    AppService,
    PrismaService,
    // RoleService,
    // StudentService,
    // TeacherService,
    // GroupService,
    // CampaignService,
    // AttendanceService,
    // EvaluationService,
    // LogService,
    OrganizationService,
  ],
  imports: [],
})
export class AppModule {}
