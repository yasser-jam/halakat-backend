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
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { AttendanceController } from './attendance/attendance.controller';
import { AttendanceService } from './attendance/attendance.service';
import { AuthModule } from './auth/auth.module';
import { SessionSurahModule } from './session-surah/session-surah.module';
import { CurriculumController } from './curriculum/curriculum.controller';
import { CurriculumService } from './curriculum/curriculum.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CurriculumTemplateController } from './curriculum-template/curriculum-template.controller';
import { CurriculumTemplateService } from './curriculum-template/curriculum-template.service';
import { CurriculumLessonSessionController } from './curriculum-lesson-session/curriculum-lesson-session.controller';
import { CurriculumLessonSessionService } from './curriculum-lesson-session/curriculum-lesson-session.service';
// import { AuthController } from './auth/auth.controller';
// import { AuthService } from './auth/auth.service';

@Module({
  controllers: [
    AppController,
    RoleController,
    StudentsController,
    TeachersController,
    GroupsController,
    CampaignsController,
    // UploadController,
    AttendanceController,
    EvaluationController,
    // LogController,
    OrganizationController,
    MosqueController,
    MistakeController,
    SavingSessionController,
    CurriculumController,
    CategoryController,
    CurriculumTemplateController,
    CurriculumLessonSessionController,
  ],
  providers: [
    AppService,
    PrismaService,
    RoleService,
    StudentService,
    TeacherService,
    GroupService,
    CampaignService,
    AttendanceService,
    EvaluationService,
    // LogService,
    OrganizationService,
    MistakeService,
    MosqueService,
    SavingSessionService,
    CurriculumService,
    CategoryService,
    CurriculumTemplateService,
    CurriculumLessonSessionService,
  ],
  imports: [AuthModule, SessionSurahModule],
})
export class AppModule {}
