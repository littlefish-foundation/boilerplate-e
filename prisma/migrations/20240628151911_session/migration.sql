/*
  Warnings:

  - Added the required column `walletAddress` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletNetwork` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "walletAddress" TEXT NOT NULL,
ADD COLUMN     "walletNetwork" INTEGER NOT NULL;
