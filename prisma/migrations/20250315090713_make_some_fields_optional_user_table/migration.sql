-- AlterTable
ALTER TABLE "doctor_schedules" ALTER COLUMN "end_time" SET DEFAULT now() + interval '1 hour';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "date_of_birth" DROP NOT NULL;
