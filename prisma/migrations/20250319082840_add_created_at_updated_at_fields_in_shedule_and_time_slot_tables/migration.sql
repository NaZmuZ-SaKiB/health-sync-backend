/*
  Warnings:

  - Added the required column `updated_at` to the `doctor_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `time_slots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctor_schedules" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "end_time" SET DEFAULT now() + interval '1 hour';

-- AlterTable
ALTER TABLE "time_slots" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
