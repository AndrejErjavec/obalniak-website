"use client"

import {useEffect, useState} from "react";
import Image from "next/image";

export default function PhotoUploadMulti({photos, setPhotos}) {
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

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

    const files = event.dataTransfer.files;
    Array.from(files).forEach(file => {
      if (file.type.startsWith("image/")) {
        setPhotos(files => [...files, file]);
        const previewUrl = URL.createObjectURL(file);
        setPreviews(previewUrls => [...previewUrls, previewUrl]);
      }
    });
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    Array.from(files).forEach(file => {
      setPhotos(files => [...files, file]);
      const previewUrl = URL.createObjectURL(file);
      setPreviews(previewUrls => [...previewUrls, previewUrl]);
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
            Drag & drop your photo here, or{" "}
            <span className="text-blue-500 font-medium">browse</span>.
          </p>
          <input
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
            Browse Files
          </label>
        </div>

        {/* Image Preview */}
        {previews.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Preview</p>
            <div className="grid grid-cols-5 md:grid-cols-2 gap-2">
              {previews.map(preview => (
                <Image
                  src={preview}
                  width={500}
                  height={500}
                  alt="Preview"
                  className="w-full max-h-60 object-contain border border-gray-300 rounded-md shadow-sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}