-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `provider` ENUM('EMAIL', 'KAKAO', 'GOOGLE', 'NAVER') NOT NULL DEFAULT 'EMAIL',
    `socialId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `profileImageUrl` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_nickname_key`(`nickname`),
    INDEX `User_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `FinalChoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tournamentId` INTEGER NOT NULL,
    `selectedItemId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NULL,

    INDEX `FinalChoice_tournamentId_idx`(`tournamentId`),
    INDEX `FinalChoice_selectedItemId_idx`(`selectedItemId`),
    INDEX `FinalChoice_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TournamentGame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(8) NOT NULL,
    `title` VARCHAR(20) NOT NULL,
    `participantCount` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'COMPLETED', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,

    INDEX `TournamentGame_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TournamentItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `imageUrl` VARCHAR(1000) NOT NULL,
    `tournamentId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gameType` ENUM('BALANCE', 'TOURNAMENT') NOT NULL DEFAULT 'TOURNAMENT',
    `tournamentGameId` INTEGER NULL,
    `balanceGameId` INTEGER NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Comment_tournamentGameId_idx`(`tournamentGameId`),
    INDEX `Comment_balanceGameId_idx`(`balanceGameId`),
    INDEX `Comment_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BalanceGame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(8) NOT NULL,
    `title` VARCHAR(20) NOT NULL,
    `type` ENUM('BALANCE', 'TOURNAMENT') NOT NULL DEFAULT 'BALANCE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'COMPLETED', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    `endedAt` DATETIME(3) NULL,

    INDEX `BalanceGame_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BalanceQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `gameId` INTEGER NOT NULL,
    `participantCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BalanceQuestion_gameId_idx`(`gameId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BalanceItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL,
    `selectCount` INTEGER NOT NULL DEFAULT 0,
    `questionId` INTEGER NOT NULL,

    INDEX `BalanceItem_questionId_idx`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BalanceFinalChoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `questionId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NULL,
    `selectedItemId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BalanceFinalChoice_questionId_idx`(`questionId`),
    INDEX `BalanceFinalChoice_selectedItemId_idx`(`selectedItemId`),
    INDEX `BalanceFinalChoice_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PointHistory` ADD CONSTRAINT `PointHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalChoice` ADD CONSTRAINT `FinalChoice_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `TournamentGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalChoice` ADD CONSTRAINT `FinalChoice_selectedItemId_fkey` FOREIGN KEY (`selectedItemId`) REFERENCES `TournamentItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalChoice` ADD CONSTRAINT `FinalChoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentGame` ADD CONSTRAINT `TournamentGame_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentItem` ADD CONSTRAINT `TournamentItem_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `TournamentGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_tournamentGameId_fkey` FOREIGN KEY (`tournamentGameId`) REFERENCES `TournamentGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_balanceGameId_fkey` FOREIGN KEY (`balanceGameId`) REFERENCES `BalanceGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceGame` ADD CONSTRAINT `BalanceGame_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceQuestion` ADD CONSTRAINT `BalanceQuestion_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `BalanceGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceItem` ADD CONSTRAINT `BalanceItem_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `BalanceQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceFinalChoice` ADD CONSTRAINT `BalanceFinalChoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceFinalChoice` ADD CONSTRAINT `BalanceFinalChoice_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `BalanceQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceFinalChoice` ADD CONSTRAINT `BalanceFinalChoice_selectedItemId_fkey` FOREIGN KEY (`selectedItemId`) REFERENCES `BalanceItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
