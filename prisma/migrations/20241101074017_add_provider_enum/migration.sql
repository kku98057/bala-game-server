-- AlterTable
ALTER TABLE `user` ADD COLUMN `provider` ENUM('EMAIL', 'KAKAO', 'GOOGLE', 'NAVER') NOT NULL DEFAULT 'EMAIL',
    ADD COLUMN `socialId` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;