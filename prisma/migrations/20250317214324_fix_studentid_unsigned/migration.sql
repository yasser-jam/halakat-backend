-- CreateTable
CREATE TABLE `student` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `current_mosque_name` VARCHAR(255) NULL,
    `educational_class` INTEGER NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `birth_date` DATETIME NULL,
    `student_mobile` VARCHAR(255) NULL,
    `school` VARCHAR(255) NULL,
    `in_another_mosque` BOOLEAN NOT NULL DEFAULT false,
    `other_mosque_names` VARCHAR(255) NULL,
    `student_health_status` VARCHAR(1024) NULL,
    `special_talent` VARCHAR(1024) NULL,
    `father_name` VARCHAR(255) NULL,
    `father_status` ENUM('ALIVE', 'DEAD', 'MISSED') NOT NULL DEFAULT 'ALIVE',
    `father_job` VARCHAR(255) NULL,
    `father_income_level` VARCHAR(255) NULL,
    `father_education_level` VARCHAR(255) NULL,
    `father_health_status` VARCHAR(255) NULL,
    `father_phone_number` VARCHAR(255) NULL,
    `father_work_number` VARCHAR(255) NULL,
    `mother_name` VARCHAR(255) NULL,
    `mother_status` ENUM('ALIVE', 'DEAD', 'MISSED') NOT NULL DEFAULT 'ALIVE',
    `mother_job` VARCHAR(255) NULL,
    `mother_income_level` VARCHAR(255) NULL,
    `mother_education_level` VARCHAR(255) NULL,
    `mother_health_status` VARCHAR(255) NULL,
    `mother_phone_number` VARCHAR(255) NULL,
    `mother_home_number` VARCHAR(255) NULL,
    `parent_marital_status` ENUM('MARRIED', 'SEPARATED', 'DIVORCED') NOT NULL DEFAULT 'MARRIED',
    `student_mobile_number` VARCHAR(255) NULL,
    `student_home_number` VARCHAR(255) NULL,
    `original_residence_address_area` VARCHAR(255) NULL,
    `original_residence_address_street` VARCHAR(255) NULL,
    `original_residence_address_building` VARCHAR(255) NULL,
    `original_residence_address_floor` VARCHAR(255) NULL,
    `current_residence_address_area` VARCHAR(255) NULL,
    `current_residence_address_street` VARCHAR(255) NULL,
    `current_residence_address_building` VARCHAR(255) NULL,
    `current_residence_address_floor` VARCHAR(255) NULL,
    `preserved_parts` VARCHAR(191) NULL,
    `parts_tested_by_the_endowments` VARCHAR(191) NULL,
    `image_url` VARCHAR(2048) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teachers` (
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
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `teachers_mobile_phone_number_key`(`mobile_phone_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `class` INTEGER NULL,
    `currentTeacherId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaigns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignEndDate` DATETIME(3) NULL,
    `assignStartDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isCampaignContinous` BOOLEAN NOT NULL DEFAULT false,
    `limitedStudentsCount` BOOLEAN NULL,
    `studentsCount` INTEGER NULL,
    `assignByLink` BOOLEAN NULL,
    `completeCountApproach` VARCHAR(191) NOT NULL DEFAULT 'UNLIMIT_ASSIGN',
    `days` VARCHAR(191) NULL,
    `timingApproach` VARCHAR(191) NULL DEFAULT 'hours',
    `startTime` DATETIME(3) NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `endTime` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupCampaigns` (
    `groupId` INTEGER NOT NULL,
    `campaignId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`groupId`, `campaignId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentGroup` (
    `studentId` INTEGER UNSIGNED NOT NULL,
    `groupId` INTEGER NOT NULL,
    `campaignId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`studentId`, `groupId`, `campaignId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeacherGroup` (
    `teacherId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`teacherId`, `groupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER UNSIGNED NOT NULL,
    `groupId` INTEGER NOT NULL,
    `campaignId` INTEGER NOT NULL,
    `takenDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `delayTime` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GroupCampaigns` ADD CONSTRAINT `GroupCampaigns_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupCampaigns` ADD CONSTRAINT `GroupCampaigns_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentGroup` ADD CONSTRAINT `StudentGroup_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentGroup` ADD CONSTRAINT `StudentGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentGroup` ADD CONSTRAINT `StudentGroup_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherGroup` ADD CONSTRAINT `TeacherGroup_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherGroup` ADD CONSTRAINT `TeacherGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
