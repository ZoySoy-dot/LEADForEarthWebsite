/*
  Warnings:

  - You are about to drop the column `password_hash` on the `admin_users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admin_users" DROP COLUMN "password_hash",
ADD COLUMN     "image" TEXT;
