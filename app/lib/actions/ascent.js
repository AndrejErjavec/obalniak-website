"use server"

import prisma from "@/app/lib/prisma";
import {checkAuth} from "./auth";

export async function createAscent({title, route, difficulty, date, text, coClimbers, photos}) {
  if (!title || !route || !difficulty || !date || !text) {
    return {
      error: "Manjkajoči podatki"
    }
  }

  const { user } = await checkAuth();

  console.log(user);

  if (!user) {
    return {
      error: 'Niste prijavljeni',
    };
  }

  try {
    const ascent = await prisma.ascent.create({
      data: {
        title: title,
        route: route,
        difficulty: difficulty,
        date: date,
        text: text,
        authorId: user.id,
      }
    });
    return {
      success: true,
    }
  } catch (error) {
    console.log(error);
    return {error: "Prišlo je do napake"}
  }


}

// TODO: fix for multiple photos
async function uploadImage(image) {
  try {
    const buffer = await image.arrayBuffer(); // Read file data as an ArrayBuffer
    const readableStream = new Readable();
    readableStream._read = () => {}; // No-op
    readableStream.push(Buffer.from(buffer));
    readableStream.push(null); // End of stream

    // Wrap Cloudinary upload_stream in a Promise
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'rooms' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      readableStream.pipe(uploadStream);
    });

    return result.secure_url; // This is the URL to store in MongoDB

  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Image upload failed');
  }
}

