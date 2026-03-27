"use server";

import { err, ok } from "../action.utils";
import cloudinary from "../cloudinary";
import { checkAuth } from "./auth";

export async function uploadImages(images: Blob[]) {
  const { user } = await checkAuth();

  if (!user) {
    return err("Unauthorized");
  }
  if (!images) {
    return err("No images provided");
  }

  const imageArray = Array.isArray(images) ? images : [images];

  if (imageArray.length === 0) {
    return [];
  }

  try {
    const result = await Promise.all(imageArray.map((image) => uploadImage(image)));
    return ok({
      data: result,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Failed to upload images");
  }
}

async function uploadImage(image: Blob) {
  const arrayBuffer = await image.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "oak" }, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
        }
      })
      .end(buffer);
  });
}
