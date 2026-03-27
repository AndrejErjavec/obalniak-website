"use client";

import Image from "next/image";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, Dispatch, DragEvent, SetStateAction } from "react";
import { FaTrashAlt } from "react-icons/fa";

export type UploadPhoto = {
  id: string;
  file: File;
  previewUrl: string;
};

type PhotoUploadMultiProps = {
  photos: UploadPhoto[];
  setPhotos: Dispatch<SetStateAction<UploadPhoto[]>>;
};

type PreviewImageProps = {
  item: UploadPhoto;
  onRemove: (id: string) => void;
};

const PreviewImage = memo(function PreviewImage({ item, onRemove }: PreviewImageProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 shadow-sm hover:bg-white cursor-pointer"
        aria-label="Odstrani sliko"
      >
        <FaTrashAlt className="fill-red-500" />
      </button>
      <Image
        src={item.previewUrl}
        alt={item.file.name}
        width={500}
        height={500}
        className="w-full object-contain border border-gray-300 rounded-md shadow-sm"
      />
    </div>
  );
});

export default function PhotoUploadMulti({ photos, setPhotos }: PhotoUploadMultiProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<UploadPhoto[]>([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => {
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

      const existingKeys = new Set(photos.map((photo) => getFileKey(photo.file)));

      const uniqueNewFiles = imageFiles.filter((file) => !existingKeys.has(getFileKey(file)));

      if (uniqueNewFiles.length === 0) {
        setError("Te slike so že dodane.");
        return;
      }

      const newPhotos: UploadPhoto[] = uniqueNewFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setPhotos((prev) => [...prev, ...newPhotos]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [photos, setPhotos],
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

  const handleRemoveImage = useCallback(
    (id: string) => {
      setPhotos((prev) => {
        const itemToRemove = prev.find((photo) => photo.id === id);

        if (!itemToRemove) {
          return prev;
        }

        URL.revokeObjectURL(itemToRemove.previewUrl);
        return prev.filter((photo) => photo.id !== id);
      });
    },
    [setPhotos],
  );

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

      {photos.length > 0 && (
        <div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {photos.map((item) => (
              <PreviewImage key={item.id} item={item} onRemove={handleRemoveImage} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
