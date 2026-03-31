"use client";

import { Photo } from "@/app/generated/prisma";
import { EditablePhotoItem, NewPhotoItem } from "@/types";
import Image from "next/image";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, Dispatch, DragEvent, SetStateAction } from "react";
import { FaTrashAlt } from "react-icons/fa";

type PhotoUploadMultiProps = {
  existingPhotos: Photo[];
  removedPhotoIds: string[];
  newPhotos: NewPhotoItem[];
  setRemovedPhotoIds: Dispatch<SetStateAction<string[]>>;
  setNewPhotos: Dispatch<SetStateAction<NewPhotoItem[]>>;
};

type PreviewImageProps = {
  item: EditablePhotoItem;
  onRemove: (item: EditablePhotoItem) => void;
};

const PreviewImage = memo(function PreviewImage({ item, onRemove }: PreviewImageProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onRemove(item)}
        className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 shadow-sm hover:bg-white cursor-pointer"
        aria-label="Odstrani sliko"
      >
        <FaTrashAlt className="fill-red-500" />
      </button>
      <Image
        src={item.kind === "new" ? item.previewUrl : item.url}
        alt={item.kind === "new" ? item.file.name : item.name}
        width={500}
        height={500}
        className="w-full object-contain border border-gray-300 rounded-md shadow-sm"
      />
    </div>
  );
});

export default function PhotoUploadMulti({
  existingPhotos,
  removedPhotoIds,
  newPhotos,
  setRemovedPhotoIds,
  setNewPhotos,
}: PhotoUploadMultiProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newPhotosRef = useRef<NewPhotoItem[]>([]);

  const visiblePhotos: EditablePhotoItem[] = [
    ...existingPhotos
      .filter((photo) => !removedPhotoIds.includes(photo.id))
      .map((photo) => ({
        id: photo.id,
        kind: "existing" as const,
        url: photo.url,
        name: `Photo ${photo.id}`,
      })),
    ...newPhotos.map((photo) => ({
      id: photo.id,
      kind: "new" as const,
      file: photo.file,
      previewUrl: photo.previewUrl,
      name: photo.file.name,
    })),
  ];

  useEffect(() => {
    newPhotosRef.current = newPhotos;
  }, [newPhotos]);

  useEffect(() => {
    return () => {
      newPhotosRef.current.forEach((photo) => {
        URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, []);

  const getFileKey = (file: File) => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  const appendFiles = useCallback(
    (incomingFiles: File[]) => {
      setError(null);

      if (incomingFiles.length === 0) {
        return;
      }

      const imageFiles = incomingFiles.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length === 0) {
        setError("Izbrane datoteke niso slike.");
        return;
      }

      setNewPhotos((prev) => {
        const existingKeys = new Set(prev.map((photo) => getFileKey(photo.file)));
        const appendedKeys = new Set<string>();

        const uniqueNewFiles = imageFiles.filter((file) => {
          const key = getFileKey(file);

          if (existingKeys.has(key) || appendedKeys.has(key)) {
            return false;
          }

          appendedKeys.add(key);
          return true;
        });

        if (uniqueNewFiles.length === 0) {
          setError("Te slike so že dodane.");
          return prev;
        }

        const newPhotoItems: NewPhotoItem[] = uniqueNewFiles.map((file) => ({
          id: crypto.randomUUID(),
          kind: "new",
          file,
          previewUrl: URL.createObjectURL(file),
          name: file.name,
        }));

        return [...prev, ...newPhotoItems];
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [setNewPhotos],
  );

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget as Node | null;

    if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);
    appendFiles(files);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    appendFiles(files);
  };

  const handleRemove = (item: EditablePhotoItem) => {
    if (item.kind === "existing") {
      setRemovedPhotoIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
      return;
    }

    URL.revokeObjectURL(item.previewUrl);
    setNewPhotos((prev) => prev.filter((photo) => photo.id !== item.id));
  };

  return (
    <div className="space-y-6">
      <div
        className={`rounded-md border-2 border-dashed p-6 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-gray-500">
          Tukaj spustite slike ali <span className="font-medium text-blue-500">izberite slike z računalnika</span>.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          id="fileInput"
          name="fileInput"
          onChange={handleFileChange}
        />

        <label
          htmlFor="fileInput"
          className="mt-3 inline-block cursor-pointer rounded-md bg-primary px-4 py-2 text-white text-sm shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Izberite slike
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {visiblePhotos.length > 0 && (
        <div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visiblePhotos.map((item) => (
              <PreviewImage key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
