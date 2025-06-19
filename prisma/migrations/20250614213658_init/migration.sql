-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ALIVE', 'DEAD', 'MISSED');

-- CreateEnum
CREATE TYPE "MARITAL" AS ENUM ('MARRIED', 'SEPARATED', 'DIVORCED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TEACHER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER_ASSISTANT', 'AUDIBLE', 'AUDIBLE_ASSISTANT');

-- CreateTable
CREATE TABLE "student" (
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

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
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

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "class" INTEGER,
    "currentTeacherId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "assignEndDate" TIMESTAMP(3),
    "assignStartDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isCampaignContinous" BOOLEAN NOT NULL DEFAULT false,
    "limitedStudentsCount" BOOLEAN,
    "studentsCount" INTEGER,
    "assignByLink" BOOLEAN,
    "completeCountApproach" TEXT NOT NULL DEFAULT 'UNLIMIT_ASSIGN',
    "days" TEXT,
    "timingApproach" TEXT NOT NULL DEFAULT 'hours',
    "startTime" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "endTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupCampaigns" (
    "groupId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupCampaigns_pkey" PRIMARY KEY ("groupId","campaignId")
);

-- CreateTable
CREATE TABLE "StudentGroup" (
    "studentId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentGroup_pkey" PRIMARY KEY ("studentId","groupId","campaignId")
);

-- CreateTable
CREATE TABLE "TeacherGroup" (
    "teacherId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherGroup_pkey" PRIMARY KEY ("teacherId","groupId")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "takenDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delayTime" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingSession" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
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
    "campaignId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "removed_points" INTEGER NOT NULL,

    CONSTRAINT "Mistake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MistakeInSession" (
    "id" SERIAL NOT NULL,
    "savingSessionId" INTEGER NOT NULL,
    "mistakeId" INTEGER NOT NULL,
    "page" INTEGER NOT NULL,

    CONSTRAINT "MistakeInSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_student_mobile_key" ON "student"("student_mobile");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_mobile_phone_number_key" ON "teacher"("mobile_phone_number");

-- CreateIndex
CREATE INDEX "SavingSession_teacherId_idx" ON "SavingSession"("teacherId");

-- CreateIndex
CREATE INDEX "SavingSession_studentId_idx" ON "SavingSession"("studentId");

-- CreateIndex
CREATE INDEX "SavingSession_campaignId_idx" ON "SavingSession"("campaignId");

-- CreateIndex
CREATE INDEX "Mistake_campaignId_idx" ON "Mistake"("campaignId");

-- AddForeignKey
ALTER TABLE "GroupCampaigns" ADD CONSTRAINT "GroupCampaigns_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupCampaigns" ADD CONSTRAINT "GroupCampaigns_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherGroup" ADD CONSTRAINT "TeacherGroup_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherGroup" ADD CONSTRAINT "TeacherGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingSession" ADD CONSTRAINT "SavingSession_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingSession" ADD CONSTRAINT "SavingSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingSession" ADD CONSTRAINT "SavingSession_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mistake" ADD CONSTRAINT "Mistake_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeInSession" ADD CONSTRAINT "MistakeInSession_savingSessionId_fkey" FOREIGN KEY ("savingSessionId") REFERENCES "SavingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeInSession" ADD CONSTRAINT "MistakeInSession_mistakeId_fkey" FOREIGN KEY ("mistakeId") REFERENCES "Mistake"("id") ON DELETE CASCADE ON UPDATE CASCADE;
