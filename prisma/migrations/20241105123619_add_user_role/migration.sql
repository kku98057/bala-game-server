-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('USER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX `User_role_idx` ON `User`(`role`);
