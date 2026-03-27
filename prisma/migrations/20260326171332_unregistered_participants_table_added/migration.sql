/*
  Warnings:

  - You are about to drop the column `unregisteredParticipants` on the `Ascent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ascent" DROP COLUMN "unregisteredParticipants";

-- CreateTable
CREATE TABLE "UnregisteredParticipation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ascentId" TEXT NOT NULL,

    CONSTRAINT "UnregisteredParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UnregisteredParticipation_ascentId_idx" ON "UnregisteredParticipation"("ascentId");

-- AddForeignKey
ALTER TABLE "UnregisteredParticipation" ADD CONSTRAINT "UnregisteredParticipation_ascentId_fkey" FOREIGN KEY ("ascentId") REFERENCES "Ascent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
