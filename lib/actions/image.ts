"use server";

import { err, ok } from "../action-utils";
import cloudinary from "../cloudinary";
import { checkAuth } from "./auth";

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
