-- AlterTable
ALTER TABLE "doctor_schedules" ALTER COLUMN "end_time" SET DEFAULT now() + interval '1 hour';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "gender" DROP NOT NULL;
