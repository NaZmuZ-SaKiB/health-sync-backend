/*
  Warnings:

  - Made the column `locationId` on table `doctors` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_locationId_fkey";

-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "locationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
