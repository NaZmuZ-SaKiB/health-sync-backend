/*
  Warnings:

  - Made the column `userId` on table `images` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."images" ALTER COLUMN "userId" SET NOT NULL;
