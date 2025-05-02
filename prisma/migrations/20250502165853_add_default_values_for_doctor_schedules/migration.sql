-- AlterTable
ALTER TABLE "doctor_schedules" ALTER COLUMN "start_time" SET DEFAULT '09:00',
ALTER COLUMN "end_time" SET DEFAULT '17:00',
ALTER COLUMN "is_available" SET DEFAULT false;
