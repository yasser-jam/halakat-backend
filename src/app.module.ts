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
import { MosqueController } from './mosque/mosque.controller';
import { MosqueService } from './mosque/mosque.service';
import { CampaignService } from './campaign/campaign.service';
import { CampaignsController } from './campaign/campaign.controller';
import { GroupService } from './group/group.service';
import { TeacherService } from './teacher/teacher.service';
import { StudentService } from './student/student.service';
import { StudentsController } from './student/student.controller';
import { TeachersController } from './teacher/teacher.controller';
import { GroupsController } from './group/group.controller';
import { MistakeController } from './mistake/mistake.controller';
import { MistakeService } from './mistake/mistake.service';
import { EvaluationService } from './evaluation/evaluation.service';
import { EvaluationController } from './evaluation/evaluation.controller';
import { SavingSessionController } from './saving-session/saving-session.controller';
import { SavingSessionService } from './saving-session/saving-session.service';

@Module({
  controllers: [
    AppController,
    // RoleController,
    StudentsController,
    TeachersController,
    GroupsController,
    CampaignsController,
    // UploadController,
    // AuthController,
    // AttendanceController,
    EvaluationController,
    // LogController,
    OrganizationController,
    MosqueController,
    MistakeController,
    SavingSessionController,
  ],
  providers: [
    AppService,
    PrismaService,
    // RoleService,
    StudentService,
    TeacherService,
    GroupService,
    CampaignService,
    // AttendanceService,
    EvaluationService,
    // LogService,
    OrganizationService,
    MistakeService,
    MosqueService,
    SavingSessionService,
  ],
  imports: [],
})
export class AppModule {}
