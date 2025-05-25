/*
  Warnings:

  - A unique constraint covering the columns `[locationId,serviceId,slot_date,start_time]` on the table `time_slots` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "time_slots_serviceId_slot_date_start_time_key";

-- CreateIndex
CREATE UNIQUE INDEX "time_slots_locationId_serviceId_slot_date_start_time_key" ON "time_slots"("locationId", "serviceId", "slot_date", "start_time");
