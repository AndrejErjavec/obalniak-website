/*
  Warnings:

  - You are about to drop the column `accepted` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MembershipRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accepted",
ADD COLUMN     "status" "MembershipRequestStatus" NOT NULL DEFAULT 'PENDING';
