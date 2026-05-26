-- DropIndex
DROP INDEX "Photo_ascentId_position_idx";

-- DropIndex
DROP INDEX "Photo_eventId_position_idx";

-- CreateIndex
CREATE INDEX "Photo_ascentId_idx" ON "Photo"("ascentId");

-- CreateIndex
CREATE INDEX "Photo_eventId_idx" ON "Photo"("eventId");
