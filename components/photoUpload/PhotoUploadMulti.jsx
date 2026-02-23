"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";

export default function PhotoUploadMulti({ setPhotos }) {
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const previewsRef = useRef([]);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) return;

    setPhotos((prevPhotos) => [...prevPhotos, ...files]);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviewUrls) => [...prevPreviewUrls, ...previewUrls]);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) return;

    setPhotos((prevPhotos) => [...prevPhotos, ...files]);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviewUrls) => [...prevPreviewUrls, ...previewUrls]);

    // Allow selecting the same file again after deleting it.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, idx) => idx !== index));
    setPreviews((prevPreviews) => {
      const previewToRemove = prevPreviews[index];
      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove);
      }
      return prevPreviews.filter((_, idx) => idx !== index);
    });
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
            Tukaj spustite slike ali <span className="text-blue-500 font-medium">izberite slike z računalnika</span>.
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
            className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm cursor-pointer hover:bg-blue-600"
          >
            Izberite slike
          </label>
        </div>

        {/* Image Preview */}
        {previews.length > 0 && (
          <div className="mt-4">
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {previews.map((preview, index) => (
                <div key={preview} className="relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 shadow-sm hover:bg-white"
                    aria-label="Odstrani sliko"
                  >
                    <FaTrashAlt className="fill-red-500" />
                  </button>
                  <Image
                    src={preview}
                    width={500}
                    height={500}
                    alt="Preview"
                    className="w-full object-contain border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
