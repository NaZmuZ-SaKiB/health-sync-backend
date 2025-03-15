/*
  Warnings:

  - Added the required column `updated_at` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctor_schedules" ALTER COLUMN "end_time" SET DEFAULT now() + interval '1 hour';

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
