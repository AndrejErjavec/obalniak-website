-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_coverPhotoId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "coverPhotoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_coverPhotoId_fkey" FOREIGN KEY ("coverPhotoId") REFERENCES "Photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
