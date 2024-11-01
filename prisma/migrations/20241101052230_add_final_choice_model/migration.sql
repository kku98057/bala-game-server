-- CreateTable
CREATE TABLE `FinalChoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `balanceGameId` INTEGER NOT NULL,
    `selectedItemId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FinalChoice_balanceGameId_idx`(`balanceGameId`),
    INDEX `FinalChoice_selectedItemId_idx`(`selectedItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FinalChoice` ADD CONSTRAINT `FinalChoice_balanceGameId_fkey` FOREIGN KEY (`balanceGameId`) REFERENCES `BalanceGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalChoice` ADD CONSTRAINT `FinalChoice_selectedItemId_fkey` FOREIGN KEY (`selectedItemId`) REFERENCES `BalanceGameItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
