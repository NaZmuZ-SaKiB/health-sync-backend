/*
  Warnings:

  - You are about to drop the column `slotDate` on the `time_slots` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetExpiry` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctorId,slot_date,start_time]` on the table `time_slots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slot_date` to the `time_slots` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "time_slots_doctorId_slotDate_start_time_key";

-- AlterTable
ALTER TABLE "time_slots" DROP COLUMN "slotDate",
ADD COLUMN     "slot_date" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordResetCode",
DROP COLUMN "passwordResetExpiry",
DROP COLUMN "phoneNumber",
ADD COLUMN     "password_reset_code" INTEGER,
ADD COLUMN     "password_reset_expiry" TIMESTAMP(3),
ADD COLUMN     "phone_number" TEXT DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "time_slots_doctorId_slot_date_start_time_key" ON "time_slots"("doctorId", "slot_date", "start_time");
