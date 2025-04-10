/*
  Warnings:

  - Added the required column `user_type` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "user_type" "ROLE" NOT NULL;
