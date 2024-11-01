/*
  Warnings:

  - You are about to alter the column `title` on the `balancegame` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `username` on the `balancegame` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(8)`.
  - You are about to alter the column `name` on the `balancegameitem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE `balancegame` MODIFY `title` VARCHAR(20) NOT NULL,
    MODIFY `username` VARCHAR(8) NOT NULL;

-- AlterTable
ALTER TABLE `balancegameitem` MODIFY `name` VARCHAR(20) NOT NULL,
    MODIFY `imageUrl` VARCHAR(1000) NOT NULL;
