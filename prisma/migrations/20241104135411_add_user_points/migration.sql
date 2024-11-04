-- CreateTable
CREATE TABLE `PointHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `reason` ENUM('GAME_PARTICIPATION', 'GAME_CREATION', 'ADMIN_ADJUSTMENT', 'EVENT_REWARD', 'REFUND', 'ITEM_PURCHASE', 'GIFT_SENT', 'POINT_EXCHANGE') NOT NULL,
    `gameId` INTEGER NULL,
    `gameType` ENUM('BALANCE', 'TOURNAMENT') NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PointHistory_userId_idx`(`userId`),
    INDEX `PointHistory_createdAt_idx`(`createdAt`),
    INDEX `PointHistory_reason_idx`(`reason`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PointHistory` ADD CONSTRAINT `PointHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
