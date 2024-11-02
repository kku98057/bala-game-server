-- 임시 테이블 생성 및 데이터 복사
CREATE TABLE `_TempGame` AS SELECT * FROM `balancegame`;
CREATE TABLE `_TempItem` AS SELECT * FROM `balancegameitem`;
CREATE TABLE `_TempFinalChoice` AS SELECT * FROM `finalchoice`;

-- 기존 외래 키 제약 조건 제거
ALTER TABLE `balancegameitem` DROP FOREIGN KEY `BalanceGameItem_balanceGameId_fkey`;
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_gameId_fkey`;
ALTER TABLE `finalchoice` DROP FOREIGN KEY `FinalChoice_balanceGameId_fkey`;
ALTER TABLE `finalchoice` DROP FOREIGN KEY `FinalChoice_selectedItemId_fkey`;

-- 새 테이블 생성
CREATE TABLE `TournamentGame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(20) NOT NULL,
    `username` VARCHAR(8) NOT NULL,
    `participantCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TournamentItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `imageUrl` VARCHAR(1000) NOT NULL,
    `tournamentId` INTEGER NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 임시 테이블에서 데이터 복사
INSERT INTO `TournamentGame` (`id`, `title`, `username`, `participantCount`, `createdAt`)
SELECT `id`, `title`, `username`, `participantCount`, `createdAt` FROM `_TempGame`;

INSERT INTO `TournamentItem` (`id`, `name`, `imageUrl`, `tournamentId`)
SELECT `id`, `name`, `imageUrl`, `balanceGameId` FROM `_TempItem`;

-- FinalChoice 테이블 수정
ALTER TABLE `finalchoice` 
    DROP COLUMN `balanceGameId`,
    ADD COLUMN `tournamentId` INTEGER NOT NULL;

-- FinalChoice 데이터 업데이트
UPDATE `finalchoice` fc
JOIN `_TempFinalChoice` tfc ON fc.id = tfc.id
SET fc.tournamentId = tfc.balanceGameId;

-- 인덱스 생성
CREATE INDEX `FinalChoice_tournamentId_idx` ON `FinalChoice`(`tournamentId`);

-- 외래 키 제약 조건 추가
ALTER TABLE `FinalChoice` ADD CONSTRAINT `FinalChoice_tournamentId_fkey` 
    FOREIGN KEY (`tournamentId`) REFERENCES `TournamentGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `FinalChoice` ADD CONSTRAINT `FinalChoice_selectedItemId_fkey` 
    FOREIGN KEY (`selectedItemId`) REFERENCES `TournamentItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `TournamentItem` ADD CONSTRAINT `TournamentItem_tournamentId_fkey` 
    FOREIGN KEY (`tournamentId`) REFERENCES `TournamentGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_gameId_fkey` 
    FOREIGN KEY (`gameId`) REFERENCES `TournamentGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 기존 테이블 삭제
DROP TABLE `balancegame`;
DROP TABLE `balancegameitem`;

-- 임시 테이블 삭제
DROP TABLE `_TempGame`;
DROP TABLE `_TempItem`;
DROP TABLE `_TempFinalChoice`;