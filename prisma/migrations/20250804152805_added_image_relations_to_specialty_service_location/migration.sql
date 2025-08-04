/*
  Warnings:

  - You are about to drop the column `image` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `specialties` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[iconId]` on the table `services` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[iconId]` on the table `specialties` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."locations" DROP COLUMN "image",
ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "public"."services" DROP COLUMN "icon",
ADD COLUMN     "iconId" TEXT;

-- AlterTable
ALTER TABLE "public"."specialties" DROP COLUMN "icon",
ADD COLUMN     "iconId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "locations_imageId_key" ON "public"."locations"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "services_iconId_key" ON "public"."services"("iconId");

-- CreateIndex
CREATE UNIQUE INDEX "specialties_iconId_key" ON "public"."specialties"("iconId");

-- AddForeignKey
ALTER TABLE "public"."specialties" ADD CONSTRAINT "specialties_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "public"."images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."services" ADD CONSTRAINT "services_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "public"."images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."locations" ADD CONSTRAINT "locations_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
