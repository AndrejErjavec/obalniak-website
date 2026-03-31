/*
  Warnings:

  - Made the column `coverPhotoId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_coverPhotoId_fkey";

-- DropIndex
DROP INDEX "Event_coverPhotoId_idx";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "coverPhotoId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_coverPhotoId_fkey" FOREIGN KEY ("coverPhotoId") REFERENCES "Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
