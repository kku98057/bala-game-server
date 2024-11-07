-- 기존 외래키 제거
ALTER TABLE `comment` DROP FOREIGN KEY IF EXISTS `Comment_balanceGameId_fkey`;

-- 컬럼 변경
ALTER TABLE `comment` 
DROP COLUMN IF EXISTS `balanceGameId`,
ADD COLUMN IF NOT EXISTS `balanceQuestionId` INTEGER NULL;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS `Comment_balanceQuestionId_idx` 
ON `Comment`(`balanceQuestionId`);

-- 외래키 추가
ALTER TABLE `Comment` 
ADD CONSTRAINT `Comment_balanceQuestionId_fkey` 
FOREIGN KEY (`balanceQuestionId`) 
REFERENCES `BalanceQuestion`(`id`) 
ON DELETE CASCADE 
ON UPDATE CASCADE;