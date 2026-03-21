/*
  Warnings:

  - You are about to drop the column `isAlpineSchool` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `UserParticipatedAscent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserParticipatedAscent" DROP CONSTRAINT "UserParticipatedAscent_ascentId_fkey";

-- DropForeignKey
ALTER TABLE "UserParticipatedAscent" DROP CONSTRAINT "UserParticipatedAscent_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "isAlpineSchool";

-- DropTable
DROP TABLE "UserParticipatedAscent";

-- CreateTable
CREATE TABLE "_AscentToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AscentToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AscentToUser_B_index" ON "_AscentToUser"("B");

-- AddForeignKey
ALTER TABLE "_AscentToUser" ADD CONSTRAINT "_AscentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Ascent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AscentToUser" ADD CONSTRAINT "_AscentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
