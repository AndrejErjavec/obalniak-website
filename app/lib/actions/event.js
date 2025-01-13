"use server"

import prisma from "@/app/lib/prisma";
import {uploadImages} from "@/app/lib/actions/image";
import {checkAuth} from "@/app/lib/actions/auth";

export async function createEvent(formData) {
  const {user} = await checkAuth();

  if (!user) {
    return {
      error: 'Niste prijavljeni',
    }
  }

  const title = formData.get("title");
  const date = formData.get("date");
  const text = formData.get("text");
  const photo = formData.get("photo");

  if (!title || !date || !text) {
    return {
      error: "Manjkajoči podatki"
    }
  }

  try {
    await prisma.$transaction(async (prisma) => {
      // upload cover photo
      let uploadedPhoto;
      if (photo) {
        const secureUrls = await uploadImages(photo);
        uploadedPhoto = await prisma.photo.create({
          data: {
            url: secureUrls[0],
          }
        })
      }

        // create event
        const event = await prisma.event.create({
          data: {
            title: title,
            date: date,
            text: text,
            type: "event",
            authorId: user.id,
            coverPhotoId: uploadedPhoto?.id,
          }
        });
    }, {timeout: 30000});

    return {
      success: true,
    }

  } catch (error) {
    console.log(error);
    return {
      error: "Prišlo je do napake"
    }
  }
}

export async function getUpcomingEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date().toISOString()
        }
      },
      orderBy: {
        date: "asc"
      },
      include: {
        coverPhoto: true
      }
    })
    return events;
  } catch(error) {
    console.log(error);
    return {
      error: "Napaka pri nalaganju"
    }
  }
}

export async function getEvent(id) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true
          },
        },
        coverPhoto: true
      }
    });
    return event;
  } catch (error) {
    console.log(error);
    return {
      error: "Napaka pri nalaganju",
    }
  }
}