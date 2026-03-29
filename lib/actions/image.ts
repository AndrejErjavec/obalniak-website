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

export async function deleteImages(imageUrls: string[]) {
  const { user } = await checkAuth();

  if (!user) {
    return err("Unauthorized");
  }

  if (!imageUrls || imageUrls.length === 0) {
    return ok([]);
  }

  try {
    const publicIds = imageUrls.map(getCloudinaryPublicId).filter(Boolean) as string[];

    if (publicIds.length === 0) {
      return ok([]);
    }

    const result = await Promise.all(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)));

    return ok(result);
  } catch (error) {
    console.error("Error deleting images:", error);
    return err("Failed to delete images");
  }
}

function getCloudinaryPublicId(imageUrl: string) {
  try {
    const pathname = new URL(imageUrl).pathname;
    const uploadMarker = "/upload/";
    const uploadIndex = pathname.indexOf(uploadMarker);

    if (uploadIndex === -1) {
      return null;
    }

    const uploadPath = pathname.slice(uploadIndex + uploadMarker.length);
    const withoutVersion = uploadPath.replace(/^v\d+\//, "");

    return withoutVersion.replace(/\.[^.]+$/, "");
  } catch (error) {
    console.error("Invalid Cloudinary URL:", imageUrl, error);
    return null;
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
