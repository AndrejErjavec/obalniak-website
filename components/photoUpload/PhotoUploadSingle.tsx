"use client";

import { useEffect, useState, useRef, memo } from "react";
import type { ChangeEvent, Dispatch, DragEvent, SetStateAction } from "react";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";
import { Photo } from "@/app/generated/prisma";
import { NewPhotoItem } from "@/types";

type PreviewImageProps = {
  item: VisiblePhoto;
  onRemove: (item: VisiblePhoto) => void;
};

const PreviewImage = memo(function PreviewImage({ item, onRemove }: PreviewImageProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onRemove(item)}
        className="absolute top-3 right-3 z-10 flex flex-row items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-sm hover:bg-white cursor-pointer"
        aria-label="Odstrani sliko"
      >
        <FaTrashAlt className="fill-red-600" />
        <span className="text-gray-700 text-sm font-medium">Odstrani/zamenjaj</span>
      </button>
      <Image
        src={item.src}
        alt={item.alt}
        width={500}
        height={500}
        className="w-full object-contain border border-gray-300 rounded-md shadow-sm"
      />
    </div>
  );
});

type VisiblePhoto = {
  id: string;
  src: string;
  alt: string;
  kind: "existing" | "new";
};

type PhotoUploadSingleProps = {
  existingPhoto: Photo | null;
  newPhoto: NewPhotoItem | null;
  setNewPhoto: Dispatch<SetStateAction<NewPhotoItem | null>>;
  replaceRemove: boolean;
  setReplaceRemove: Dispatch<SetStateAction<boolean>>;
};

function existingPhotoToVisiblePhoto(photo: Photo): VisiblePhoto {
  return {
    id: photo.id,
    src: photo.url,
    alt: photo.id,
    kind: "existing",
  };
}

function newPhotoToVisiblePhoto(photo: NewPhotoItem): VisiblePhoto {
  return {
    id: photo.id,
    src: photo.previewUrl,
    alt: photo.name,
    kind: "new",
  };
}

export default function PhotoUploadSingle({
  existingPhoto,
  newPhoto,
  setNewPhoto,
  replaceRemove,
  setReplaceRemove,
}: PhotoUploadSingleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<NewPhotoItem | null>(null);

  const visiblePhoto = newPhoto
    ? newPhotoToVisiblePhoto(newPhoto)
    : existingPhoto && !replaceRemove
      ? existingPhotoToVisiblePhoto(existingPhoto)
      : null;

  useEffect(() => {
    previewRef.current = newPhoto;
  }, [newPhoto]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current.previewUrl);
      }
    };
  }, []);

  const createNewPhotoItem = (file: File) => {
    const newPhotoItem: NewPhotoItem = {
      id: crypto.randomUUID(),
      kind: "new",
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    };

    return newPhotoItem;
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const newPhotoItem = createNewPhotoItem(file);

    setNewPhoto(newPhotoItem);

    // Allow selecting the same file again after deleting it.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const newPhotoItem = createNewPhotoItem(file);
    setNewPhoto(newPhotoItem);
  };

  const handleRemoveImage = () => {
    if (existingPhoto) {
      setReplaceRemove(true);
    }
    setNewPhoto(null);
  };

  return (
    <>
      {!visiblePhoto ? (
        <div>
          <div className="space-y-6">
            {/* Drag-and-Drop Area */}
            <div
              className={`border-2 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
              } border-dashed rounded-md p-6 text-center`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p className="text-gray-500">
                Tukaj spustite sliko ali <span className="text-primary font-medium">izberite sliko z računalnika</span>.
              </p>
              <input
                ref={fileInputRef}
                type="file"
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
                Izberite sliko
              </label>
            </div>
          </div>
        </div>
      ) : (
        <PreviewImage item={visiblePhoto} onRemove={handleRemoveImage} />
      )}
    </>
  );
}
