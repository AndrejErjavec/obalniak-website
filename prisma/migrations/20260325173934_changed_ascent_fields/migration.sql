/*
  Warnings:

  - You are about to drop the column `title` on the `Ascent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ascent" DROP COLUMN "title",
ADD COLUMN     "routeLength" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "text" DROP NOT NULL;
