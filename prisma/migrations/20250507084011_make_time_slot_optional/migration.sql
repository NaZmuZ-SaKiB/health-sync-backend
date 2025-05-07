-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_slotId_fkey";

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "slotId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "time_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
