-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ALIVE', 'DEAD', 'MISSED');

-- CreateEnum
CREATE TYPE "MARITAL" AS ENUM ('MARRIED', 'SEPARATED', 'DIVORCED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TEACHER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER_ASSISTANT', 'AUDIBLE', 'AUDIBLE_ASSISTANT');

-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('STUDENT_MANAGEMENT', 'TEACHER_MANAGEMENT', 'ROLES_MANAGEMENT', 'SAVING_SESSION_MANAGEMENT', 'ATTENDANCE_MANAGEMENT', 'CURRICULUM_MANAGEMENT', 'SETTINGS_MANAGEMENT', 'POINTS_MANAGEMENT', 'AWARDS_MANAGEMENT');

-- CreateEnum
CREATE TYPE "LogEvent" AS ENUM ('TEACHER_LOGIN', 'STUDENT_LOGIN', 'SAVING_SESSION_CREATED', 'ATTENDANCE_MARKED', 'MISTAKE_ASSERTED', 'EVALUATION_ASSERTED', 'ROLE_ASSIGNED', 'CAMPAIGN_CREATED');

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mosque" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "address_area" TEXT,
    "address_details" TEXT,
    "contact_phone" TEXT,
    "contact_email" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Mosque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationUser" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "role" "OrgRole" NOT NULL DEFAULT 'ADMIN',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "password" TEXT,

    CONSTRAINT "OrganizationUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "current_mosque_name" TEXT,
    "educational_class" INTEGER,
    "first_name" TEXT,
    "last_name" TEXT,
    "birth_date" TIMESTAMP(3),
    "student_mobile" TEXT NOT NULL,
    "school" TEXT,
    "in_another_mosque" BOOLEAN NOT NULL DEFAULT false,
    "other_mosque_names" TEXT,
    "student_health_status" TEXT,
    "special_talent" TEXT,
    "father_name" TEXT,
    "father_status" "STATUS" NOT NULL DEFAULT 'ALIVE',
    "father_job" TEXT,
    "father_income_level" TEXT,
    "father_education_level" TEXT,
    "father_health_status" TEXT,
    "father_phone_number" TEXT,
    "father_work_number" TEXT,
    "mother_name" TEXT,
    "mother_status" "STATUS" NOT NULL DEFAULT 'ALIVE',
    "mother_job" TEXT,
    "mother_income_level" TEXT,
    "mother_education_level" TEXT,
    "mother_health_status" TEXT,
    "mother_phone_number" TEXT,
    "mother_home_number" TEXT,
    "parent_marital_status" "MARITAL" NOT NULL DEFAULT 'MARRIED',
    "student_mobile_number" TEXT,
    "student_home_number" TEXT,
    "original_residence_address_area" TEXT,
    "original_residence_address_street" TEXT,
    "original_residence_address_building" TEXT,
    "original_residence_address_floor" TEXT,
    "current_residence_address_area" TEXT,
    "current_residence_address_street" TEXT,
    "current_residence_address_building" TEXT,
    "current_residence_address_floor" TEXT,
    "preserved_parts" TEXT,
    "parts_tested_by_the_endowments" TEXT,
    "image_url" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "educational_level" TEXT,
    "university_name" TEXT,
    "college_name" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "birth_date" TIMESTAMP(3),
    "mobile_phone_number" TEXT NOT NULL,
    "in_another_mosque" BOOLEAN,
    "other_mosque_names" TEXT,
    "special_talent" TEXT,
    "father_name" TEXT,
    "current_residence_address_area" TEXT,
    "current_residence_address_street" TEXT,
    "current_residence_address_building" TEXT,
    "preserved_parts" JSONB,
    "parts_tested_by_the_endowments" JSONB,
    "image_url" TEXT,
    "is_mojaz" BOOLEAN,
    "is_working" BOOLEAN,
    "job_role" TEXT,
    "workplace_name" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TEACHER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "mosque_id" INTEGER,
    "title" TEXT NOT NULL,
    "class" INTEGER,
    "current_teacher_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "mosque_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "assign_end_date" TIMESTAMP(3),
    "assign_start_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "is_campaign_continuous" BOOLEAN NOT NULL DEFAULT false,
    "limited_students_count" BOOLEAN,
    "students_count" INTEGER,
    "assign_by_link" BOOLEAN,
    "complete_count_approach" TEXT NOT NULL DEFAULT 'UNLIMIT_ASSIGN',
    "days" TEXT,
    "timing_approach" TEXT NOT NULL DEFAULT 'hours',
    "start_time" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "end_time" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCampaign" (
    "student_id" INTEGER NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "enrolled_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentCampaign_pkey" PRIMARY KEY ("student_id","campaign_id")
);

-- CreateTable
CREATE TABLE "TeacherCampaign" (
    "teacher_id" INTEGER NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "assigned_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherCampaign_pkey" PRIMARY KEY ("teacher_id","campaign_id")
);

-- CreateTable
CREATE TABLE "GroupCampaigns" (
    "group_id" INTEGER NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupCampaigns_pkey" PRIMARY KEY ("group_id","campaign_id")
);

-- CreateTable
CREATE TABLE "StudentGroup" (
    "student_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentGroup_pkey" PRIMARY KEY ("student_id","group_id","campaign_id")
);

-- CreateTable
CREATE TABLE "TeacherGroup" (
    "teacher_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherGroup_pkey" PRIMARY KEY ("teacher_id","group_id","campaign_id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "taken_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delay_time" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "minimum_marks" INTEGER NOT NULL,
    "campaign_id" INTEGER NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingSession" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "evaluation_id" INTEGER,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mistake" (
    "id" SERIAL NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "reduced_marks" INTEGER NOT NULL,

    CONSTRAINT "Mistake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MistakeInSession" (
    "id" SERIAL NOT NULL,
    "saving_session_id" INTEGER NOT NULL,
    "mistake_id" INTEGER NOT NULL,
    "page" INTEGER NOT NULL,

    CONSTRAINT "MistakeInSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "campaign_id" INTEGER NOT NULL,

    CONSTRAINT "AppRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherRole" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "group_id" INTEGER,
    "campaign_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "event" "LogEvent" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teacher_id" INTEGER,
    "student_id" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Organization_name_idx" ON "Organization"("name");

-- CreateIndex
CREATE INDEX "Mosque_organization_id_idx" ON "Mosque"("organization_id");

-- CreateIndex
CREATE INDEX "Mosque_name_idx" ON "Mosque"("name");

-- CreateIndex
CREATE INDEX "OrganizationUser_email_idx" ON "OrganizationUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUser_organization_id_email_key" ON "OrganizationUser"("organization_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_student_mobile_key" ON "Student"("student_mobile");

-- CreateIndex
CREATE INDEX "Student_student_mobile_idx" ON "Student"("student_mobile");

-- CreateIndex
CREATE INDEX "Student_first_name_last_name_idx" ON "Student"("first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_mobile_phone_number_key" ON "Teacher"("mobile_phone_number");

-- CreateIndex
CREATE INDEX "Teacher_mobile_phone_number_idx" ON "Teacher"("mobile_phone_number");

-- CreateIndex
CREATE INDEX "Teacher_first_name_last_name_idx" ON "Teacher"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "Group_mosque_id_idx" ON "Group"("mosque_id");

-- CreateIndex
CREATE INDEX "Campaign_mosque_id_idx" ON "Campaign"("mosque_id");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "StudentCampaign_campaign_id_idx" ON "StudentCampaign"("campaign_id");

-- CreateIndex
CREATE INDEX "TeacherCampaign_campaign_id_idx" ON "TeacherCampaign"("campaign_id");

-- CreateIndex
CREATE INDEX "Attendance_student_id_idx" ON "Attendance"("student_id");

-- CreateIndex
CREATE INDEX "Attendance_campaign_id_idx" ON "Attendance"("campaign_id");

-- CreateIndex
CREATE INDEX "Attendance_taken_date_idx" ON "Attendance"("taken_date");

-- CreateIndex
CREATE INDEX "Evaluation_campaign_id_idx" ON "Evaluation"("campaign_id");

-- CreateIndex
CREATE INDEX "SavingSession_teacher_id_idx" ON "SavingSession"("teacher_id");

-- CreateIndex
CREATE INDEX "SavingSession_student_id_idx" ON "SavingSession"("student_id");

-- CreateIndex
CREATE INDEX "SavingSession_campaign_id_idx" ON "SavingSession"("campaign_id");

-- CreateIndex
CREATE INDEX "SavingSession_created_at_idx" ON "SavingSession"("created_at");

-- CreateIndex
CREATE INDEX "Mistake_campaign_id_idx" ON "Mistake"("campaign_id");

-- CreateIndex
CREATE INDEX "MistakeInSession_saving_session_id_idx" ON "MistakeInSession"("saving_session_id");

-- CreateIndex
CREATE INDEX "MistakeInSession_mistake_id_idx" ON "MistakeInSession"("mistake_id");

-- CreateIndex
CREATE INDEX "TeacherRole_teacher_id_idx" ON "TeacherRole"("teacher_id");

-- CreateIndex
CREATE INDEX "TeacherRole_campaign_id_idx" ON "TeacherRole"("campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherRole_teacher_id_group_id_campaign_id_role_id_key" ON "TeacherRole"("teacher_id", "group_id", "campaign_id", "role_id");

-- CreateIndex
CREATE INDEX "Log_event_idx" ON "Log"("event");

-- CreateIndex
CREATE INDEX "Log_timestamp_idx" ON "Log"("timestamp");

-- AddForeignKey
ALTER TABLE "Mosque" ADD CONSTRAINT "Mosque_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_mosque_id_fkey" FOREIGN KEY ("mosque_id") REFERENCES "Mosque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCampaign" ADD CONSTRAINT "StudentCampaign_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCampaign" ADD CONSTRAINT "StudentCampaign_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCampaign" ADD CONSTRAINT "TeacherCampaign_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCampaign" ADD CONSTRAINT "TeacherCampaign_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupCampaigns" ADD CONSTRAINT "GroupCampaigns_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupCampaigns" ADD CONSTRAINT "GroupCampaigns_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherGroup" ADD CONSTRAINT "TeacherGroup_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherGroup" ADD CONSTRAINT "TeacherGroup_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherGroup" ADD CONSTRAINT "TeacherGroup_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingSession" ADD CONSTRAINT "SavingSession_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingSession" ADD CONSTRAINT "SavingSession_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingSession" ADD CONSTRAINT "SavingSession_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingSession" ADD CONSTRAINT "SavingSession_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeInSession" ADD CONSTRAINT "MistakeInSession_saving_session_id_fkey" FOREIGN KEY ("saving_session_id") REFERENCES "SavingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeInSession" ADD CONSTRAINT "MistakeInSession_mistake_id_fkey" FOREIGN KEY ("mistake_id") REFERENCES "Mistake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppRole" ADD CONSTRAINT "AppRole_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherRole" ADD CONSTRAINT "TeacherRole_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherRole" ADD CONSTRAINT "TeacherRole_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherRole" ADD CONSTRAINT "TeacherRole_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherRole" ADD CONSTRAINT "TeacherRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "AppRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
