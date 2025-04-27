/*
  Warnings:

  - You are about to alter the column `studentId` on the `attendance` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `student` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - You are about to alter the column `current_mosque_name` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `first_name` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `last_name` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `student_mobile` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `school` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `other_mosque_names` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `student_health_status` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1024)` to `VarChar(191)`.
  - You are about to alter the column `special_talent` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1024)` to `VarChar(191)`.
  - You are about to alter the column `father_name` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `father_job` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `father_income_level` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `father_education_level` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `father_health_status` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `father_phone_number` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `father_work_number` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `mother_name` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `mother_job` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `mother_income_level` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `mother_education_level` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `mother_health_status` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `mother_phone_number` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `mother_home_number` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `student_mobile_number` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `student_home_number` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `original_residence_address_area` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `original_residence_address_street` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `original_residence_address_building` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `original_residence_address_floor` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `current_residence_address_area` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `current_residence_address_street` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `current_residence_address_building` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `current_residence_address_floor` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `image_url` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(2048)` to `VarChar(191)`.
  - The primary key for the `studentgroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `studentId` on the `studentgroup` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Int`.
  - You are about to drop the `campaigns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teachers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `attendance_campaignId_fkey`;

-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `attendance_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `attendance_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `groupcampaigns` DROP FOREIGN KEY `GroupCampaigns_campaignId_fkey`;

-- DropForeignKey
ALTER TABLE `groupcampaigns` DROP FOREIGN KEY `GroupCampaigns_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `studentgroup` DROP FOREIGN KEY `StudentGroup_campaignId_fkey`;

-- DropForeignKey
ALTER TABLE `studentgroup` DROP FOREIGN KEY `StudentGroup_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `studentgroup` DROP FOREIGN KEY `StudentGroup_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `teachergroup` DROP FOREIGN KEY `TeacherGroup_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `teachergroup` DROP FOREIGN KEY `TeacherGroup_teacherId_fkey`;

-- AlterTable
ALTER TABLE `attendance` MODIFY `studentId` INTEGER NOT NULL,
    MODIFY `takenDate` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `updatedAt` TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE `groupcampaigns` MODIFY `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `updated_at` TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `current_mosque_name` VARCHAR(191) NULL,
    MODIFY `first_name` VARCHAR(191) NULL,
    MODIFY `last_name` VARCHAR(191) NULL,
    MODIFY `birth_date` DATETIME(3) NULL,
    MODIFY `student_mobile` VARCHAR(191) NULL,
    MODIFY `school` VARCHAR(191) NULL,
    MODIFY `other_mosque_names` VARCHAR(191) NULL,
    MODIFY `student_health_status` VARCHAR(191) NULL,
    MODIFY `special_talent` VARCHAR(191) NULL,
    MODIFY `father_name` VARCHAR(191) NULL,
    MODIFY `father_job` VARCHAR(191) NULL,
    MODIFY `father_income_level` VARCHAR(191) NULL,
    MODIFY `father_education_level` VARCHAR(191) NULL,
    MODIFY `father_health_status` VARCHAR(191) NULL,
    MODIFY `father_phone_number` VARCHAR(191) NULL,
    MODIFY `father_work_number` VARCHAR(191) NULL,
    MODIFY `mother_name` VARCHAR(191) NULL,
    MODIFY `mother_job` VARCHAR(191) NULL,
    MODIFY `mother_income_level` VARCHAR(191) NULL,
    MODIFY `mother_education_level` VARCHAR(191) NULL,
    MODIFY `mother_health_status` VARCHAR(191) NULL,
    MODIFY `mother_phone_number` VARCHAR(191) NULL,
    MODIFY `mother_home_number` VARCHAR(191) NULL,
    MODIFY `student_mobile_number` VARCHAR(191) NULL,
    MODIFY `student_home_number` VARCHAR(191) NULL,
    MODIFY `original_residence_address_area` VARCHAR(191) NULL,
    MODIFY `original_residence_address_street` VARCHAR(191) NULL,
    MODIFY `original_residence_address_building` VARCHAR(191) NULL,
    MODIFY `original_residence_address_floor` VARCHAR(191) NULL,
    MODIFY `current_residence_address_area` VARCHAR(191) NULL,
    MODIFY `current_residence_address_street` VARCHAR(191) NULL,
    MODIFY `current_residence_address_building` VARCHAR(191) NULL,
    MODIFY `current_residence_address_floor` VARCHAR(191) NULL,
    MODIFY `image_url` VARCHAR(191) NULL,
    MODIFY `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `updated_at` TIMESTAMP(6) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `studentgroup` DROP PRIMARY KEY,
    MODIFY `studentId` INTEGER NOT NULL,
    MODIFY `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `updated_at` TIMESTAMP(6) NOT NULL,
    ADD PRIMARY KEY (`studentId`, `groupId`, `campaignId`);

-- AlterTable
ALTER TABLE `teachergroup` MODIFY `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `updated_at` TIMESTAMP(6) NOT NULL;

-- DropTable
DROP TABLE `campaigns`;

-- DropTable
DROP TABLE `groups`;

-- DropTable
DROP TABLE `teachers`;

-- CreateTable
CREATE TABLE `teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `educational_level` VARCHAR(191) NULL,
    `university_name` VARCHAR(191) NULL,
    `college_name` VARCHAR(191) NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `birth_date` DATETIME(3) NULL,
    `mobile_phone_number` VARCHAR(191) NOT NULL,
    `in_another_mosque` BOOLEAN NULL,
    `other_mosque_names` VARCHAR(191) NULL,
    `special_talent` VARCHAR(191) NULL,
    `father_name` VARCHAR(191) NULL,
    `current_residence_address_area` VARCHAR(191) NULL,
    `current_residence_address_street` VARCHAR(191) NULL,
    `current_residence_address_building` VARCHAR(191) NULL,
    `preserved_parts` JSON NULL,
    `parts_tested_by_the_endowments` JSON NULL,
    `image_url` VARCHAR(191) NULL,
    `is_mojaz` BOOLEAN NULL,
    `is_working` BOOLEAN NULL,
    `job_role` VARCHAR(191) NULL,
    `workplace_name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('TEACHER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER_ASSISTANT', 'AUDIBLE', 'AUDIBLE_ASSISTANT') NOT NULL DEFAULT 'TEACHER',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,

    UNIQUE INDEX `teacher_mobile_phone_number_key`(`mobile_phone_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `class` INTEGER NULL,
    `currentTeacherId` INTEGER NULL,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campaign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `startDate` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `endDate` DATETIME(3) NULL,
    `assignEndDate` DATETIME(3) NULL,
    `assignStartDate` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `isCampaignContinous` BOOLEAN NOT NULL DEFAULT false,
    `limitedStudentsCount` BOOLEAN NULL,
    `studentsCount` INTEGER NULL,
    `assignByLink` BOOLEAN NULL,
    `completeCountApproach` VARCHAR(191) NOT NULL DEFAULT 'UNLIMIT_ASSIGN',
    `days` VARCHAR(191) NULL,
    `timingApproach` VARCHAR(191) NOT NULL DEFAULT 'hours',
    `startTime` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `endTime` VARCHAR(191) NULL,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GroupCampaigns` ADD CONSTRAINT `GroupCampaigns_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupCampaigns` ADD CONSTRAINT `GroupCampaigns_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentGroup` ADD CONSTRAINT `StudentGroup_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentGroup` ADD CONSTRAINT `StudentGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentGroup` ADD CONSTRAINT `StudentGroup_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherGroup` ADD CONSTRAINT `TeacherGroup_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherGroup` ADD CONSTRAINT `TeacherGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
