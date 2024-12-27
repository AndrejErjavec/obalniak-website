"use server"

import cloudinary from "../cloudinary";
import prisma from "../prisma";

export async function uploadImages(images) {
  if (images) {
    const result = await Promise.all(
      images.map((image) => uploadImage(image)) // Return the promise
    );
    return result; // Each element is already a secure URL from uploadImage
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
