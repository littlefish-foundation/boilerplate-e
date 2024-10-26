/*
  Warnings:

  - You are about to drop the column `verifiedPolicy` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verifiedPolicy",
ADD COLUMN     "roles" TEXT[];
