// app/api/upload-multiple/route.ts
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import sharp from "sharp";
import { cookies } from "next/headers";

type UploadResult = {
  url: string;
  publicId: string;
};

async function compressImageBuffer(buffer: Buffer) {
  const sharpOptions = {
    quality: 75,
  };

  const { data, info } = await sharp(buffer)
    // output the raw pixels
    .jpeg(sharpOptions)
    .toBuffer({ resolveWithObject: true });

  return { data, info };
}

function uploadImageBuffer(buffer: Buffer): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  const c = await cookies();
  const sessionToken = c.get("session-token");

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("photos");

    const imageFiles = files.filter((file): file is File => file instanceof File);

    if (imageFiles.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploaded = await Promise.all(
      imageFiles.map(async (image) => {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const compressedBuffer = await compressImageBuffer(buffer);
        return uploadImageBuffer(compressedBuffer.data);
      }),
    );

    return NextResponse.json(
      {
        data: uploaded,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
