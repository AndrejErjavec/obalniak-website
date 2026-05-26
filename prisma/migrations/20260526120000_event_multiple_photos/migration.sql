-- CreateTable
CREATE TABLE "_EventPhotos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- Backfill existing cover photos into the new gallery relation.
INSERT INTO "_EventPhotos" ("A", "B")
SELECT "id", "coverPhotoId"
FROM "Event"
WHERE "coverPhotoId" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_EventPhotos_AB_unique" ON "_EventPhotos"("A", "B");

-- CreateIndex
CREATE INDEX "_EventPhotos_B_index" ON "_EventPhotos"("B");

-- AddForeignKey
ALTER TABLE "_EventPhotos" ADD CONSTRAINT "_EventPhotos_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventPhotos" ADD CONSTRAINT "_EventPhotos_B_fkey" FOREIGN KEY ("B") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
