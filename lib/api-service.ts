import { ActionResult } from "@/types";
import { err, ok } from "./action-utils";

export const uploadPhotos = async (files: File[]): Promise<ActionResult<string[]>> => {
  if (files.length === 0) {
    return ok([]);
  }

  const formData = new FormData();
  for (const photo of files) {
    formData.append("photos", photo);
  }

  try {
    const response = await fetch("/api/image-upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return err(result.error ?? "Photo upload failed");
    }

    return ok(result.data.map((d: { url: string; publicId: string }) => d.url));
  } catch {
    return err("Photo upload failed");
  }
};
