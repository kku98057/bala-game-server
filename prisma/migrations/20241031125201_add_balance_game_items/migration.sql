/*
  Warnings:

  - You are about to drop the column `list` on the `balancegame` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `balancegame` DROP COLUMN `list`;

-- CreateTable
CREATE TABLE `BalanceGameItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `balanceGameId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BalanceGameItem` ADD CONSTRAINT `BalanceGameItem_balanceGameId_fkey` FOREIGN KEY (`balanceGameId`) REFERENCES `BalanceGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
