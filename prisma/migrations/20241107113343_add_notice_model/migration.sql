-- CreateTable
CREATE TABLE `Notice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,

    INDEX `Notice_authorId_idx`(`authorId`),
    INDEX `Notice_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
