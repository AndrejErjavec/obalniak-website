-- Add direct photo ownership and ordering.
ALTER TABLE "Photo" ADD COLUMN "eventId" TEXT;
ALTER TABLE "Photo" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

-- Move event gallery ownership from the temporary many-to-many relation onto Photo.
UPDATE "Photo" AS p
SET "eventId" = ep."A"
FROM "_EventPhotos" AS ep
WHERE ep."B" = p."id";

-- Preserve existing ascent photos with a deterministic order.
WITH ordered_ascent_photos AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (PARTITION BY "ascentId" ORDER BY "id") - 1 AS next_position
  FROM "Photo"
  WHERE "ascentId" IS NOT NULL
)
UPDATE "Photo" AS p
SET "position" = ordered_ascent_photos.next_position
FROM ordered_ascent_photos
WHERE ordered_ascent_photos."id" = p."id";

-- Preserve existing event photos with the old cover photo first, then remaining photos deterministically.
WITH ordered_event_photos AS (
  SELECT
    p."id",
    ROW_NUMBER() OVER (
      PARTITION BY p."eventId"
      ORDER BY
        CASE WHEN p."id" = e."coverPhotoId" THEN 0 ELSE 1 END,
        p."id"
    ) - 1 AS next_position
  FROM "Photo" p
  JOIN "Event" e ON e."id" = p."eventId"
  WHERE p."eventId" IS NOT NULL
)
UPDATE "Photo" AS p
SET "position" = ordered_event_photos.next_position
FROM ordered_event_photos
WHERE ordered_event_photos."id" = p."id";

-- Remove the old Event cover-photo relation.
ALTER TABLE "Event" DROP CONSTRAINT IF EXISTS "Event_coverPhotoId_fkey";
DROP INDEX IF EXISTS "Event_coverPhotoId_idx";
ALTER TABLE "Event" DROP COLUMN IF EXISTS "coverPhotoId";

-- Remove the temporary event-photo many-to-many relation.
ALTER TABLE "_EventPhotos" DROP CONSTRAINT IF EXISTS "_EventPhotos_A_fkey";
ALTER TABLE "_EventPhotos" DROP CONSTRAINT IF EXISTS "_EventPhotos_B_fkey";
DROP TABLE "_EventPhotos";

-- Replace the old ascent-only index with owner + position indexes.
DROP INDEX IF EXISTS "Photo_ascentId_idx";
CREATE INDEX "Photo_ascentId_position_idx" ON "Photo"("ascentId", "position");
CREATE INDEX "Photo_eventId_position_idx" ON "Photo"("eventId", "position");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
