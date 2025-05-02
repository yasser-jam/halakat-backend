-- CreateTable
CREATE TABLE `SavingSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacherId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `campaignId` INTEGER NOT NULL,
    `start` INTEGER NOT NULL,
    `end` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `SavingSession_teacherId_idx`(`teacherId`),
    INDEX `SavingSession_studentId_idx`(`studentId`),
    INDEX `SavingSession_campaignId_idx`(`campaignId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mistake` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaignId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `removed_points` INTEGER NOT NULL,

    INDEX `Mistake_campaignId_idx`(`campaignId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MistakeInSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `savingSessionId` INTEGER NOT NULL,
    `mistakeId` INTEGER NOT NULL,
    `page` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SavingSession` ADD CONSTRAINT `SavingSession_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavingSession` ADD CONSTRAINT `SavingSession_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavingSession` ADD CONSTRAINT `SavingSession_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mistake` ADD CONSTRAINT `Mistake_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MistakeInSession` ADD CONSTRAINT `MistakeInSession_savingSessionId_fkey` FOREIGN KEY (`savingSessionId`) REFERENCES `SavingSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MistakeInSession` ADD CONSTRAINT `MistakeInSession_mistakeId_fkey` FOREIGN KEY (`mistakeId`) REFERENCES `Mistake`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
