/*
  Warnings:

  - Added the required column `strict` to the `Policy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "strict" BOOLEAN NOT NULL;
