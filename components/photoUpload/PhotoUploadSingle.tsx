"use client";

import { useEffect, useState, useRef } from "react";
import type { ChangeEvent, Dispatch, DragEvent, SetStateAction } from "react";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";

type PhotoUploadSingleProps = {
  photo: File | null;
  setPhoto: Dispatch<SetStateAction<File | null>>;
};

export default function PhotoUploadSingle({ photo, setPhoto }: PhotoUploadSingleProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    previewRef.current = preview;
  }, [preview]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

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

    setPhoto(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

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

    setPhoto(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setPhoto(null);
    setPreview(null);
  };

  return (
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
            Tukaj spustite sliko ali <span className="text-blue-500 font-medium">izberite sliko z računalnika</span>.
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

        {/* Image Preview */}
        {preview && (
          <div className="mt-4">
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <div key={preview} className="relative">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 shadow-sm hover:bg-white cursor-pointer"
                  aria-label="Odstrani sliko"
                >
                  <FaTrashAlt className="fill-red-500" />
                </button>
                <Image
                  src={preview}
                  width={500}
                  height={500}
                  alt="Preview"
                  className="w-full max-h-60 object-contain border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
