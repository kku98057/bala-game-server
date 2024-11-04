-- DropForeignKey
ALTER TABLE `balancefinalchoice` DROP FOREIGN KEY `BalanceFinalChoice_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `balancefinalchoice` DROP FOREIGN KEY `BalanceFinalChoice_selectedItemId_fkey`;

-- DropForeignKey
ALTER TABLE `balancegame` DROP FOREIGN KEY `BalanceGame_userId_fkey`;

-- DropForeignKey
ALTER TABLE `balanceitem` DROP FOREIGN KEY `BalanceItem_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `balancequestion` DROP FOREIGN KEY `BalanceQuestion_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `finalchoice` DROP FOREIGN KEY `FinalChoice_selectedItemId_fkey`;

-- DropForeignKey
ALTER TABLE `finalchoice` DROP FOREIGN KEY `FinalChoice_tournamentId_fkey`;

-- DropForeignKey
ALTER TABLE `tournamentgame` DROP FOREIGN KEY `TournamentGame_userId_fkey`;

-- DropForeignKey
ALTER TABLE `tournamentitem` DROP FOREIGN KEY `TournamentItem_tournamentId_fkey`;

-- AlterTable
ALTER TABLE `balanceitem` MODIFY `name` VARCHAR(40) NOT NULL;

-- AddForeignKey
ALTER TABLE `FinalChoice` ADD CONSTRAINT `FinalChoice_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `TournamentGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalChoice` ADD CONSTRAINT `FinalChoice_selectedItemId_fkey` FOREIGN KEY (`selectedItemId`) REFERENCES `TournamentItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentGame` ADD CONSTRAINT `TournamentGame_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentItem` ADD CONSTRAINT `TournamentItem_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `TournamentGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceGame` ADD CONSTRAINT `BalanceGame_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceQuestion` ADD CONSTRAINT `BalanceQuestion_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `BalanceGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceItem` ADD CONSTRAINT `BalanceItem_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `BalanceQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceFinalChoice` ADD CONSTRAINT `BalanceFinalChoice_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `BalanceQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceFinalChoice` ADD CONSTRAINT `BalanceFinalChoice_selectedItemId_fkey` FOREIGN KEY (`selectedItemId`) REFERENCES `BalanceItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
