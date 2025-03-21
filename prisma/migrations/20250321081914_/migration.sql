/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `medical_reports` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "medical_reports" ADD COLUMN     "appointmentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "medical_reports_appointmentId_key" ON "medical_reports"("appointmentId");

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
