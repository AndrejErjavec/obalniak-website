"use server"

import cloudinary from "../cloudinary";

export async function uploadImages(images) {
  if (!images) {
    throw new Error("No images provided");
  }

  const imageArray = Array.isArray(images) ? images : [images];

  if (imageArray.length === 0) {
    return [];
  }

  try {
    const result = await Promise.all(imageArray.map((image) => uploadImage(image)));
    return result;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Failed to upload images");
  }
}

async function uploadImage(image) {
  const arrayBuffer = await image.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "oak" }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    }).end(buffer);
  });
}
