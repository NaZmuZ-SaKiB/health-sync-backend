/*
  Warnings:

  - A unique constraint covering the columns `[serviceSettingsId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "serviceSettingsId" TEXT;

-- CreateTable
CREATE TABLE "ServiceSettings" (
    "id" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceSettingsId_key" ON "Service"("serviceSettingsId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_serviceSettingsId_fkey" FOREIGN KEY ("serviceSettingsId") REFERENCES "ServiceSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
