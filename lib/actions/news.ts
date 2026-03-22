"use server";

import prisma from "@/lib/prisma";
import { uploadImages } from "@/lib/actions/image";
import { checkAuth } from "@/lib/actions/auth";
import { ActionResult, NewsType } from "@/types";
import { err, ok } from "../action.utils";

export async function createEvent(formData: FormData): Promise<ActionResult<never>> {
  const { user } = await checkAuth();

  if (!user) {
    return err("Niste prijavljeni");
  }

  const title = String(formData.get("title"));
  const date = String(formData.get("date"));
  const text = String(formData.get("text"));
  const photo = formData.get("photo") as Blob;
  const isPinned = formData.get("isPinned") === "true";
  const type = String(formData.get("type"));

  if (!title || !text) {
    return err("Manjkajoči podatki");
  }

  try {
    await prisma.$transaction(
      async (prisma) => {
        // upload cover photo
        let uploadedPhoto;
        if (photo) {
          const secureUrls = await uploadImages([photo]);
          uploadedPhoto = await prisma.photo.create({
            data: {
              url: secureUrls[0] as string,
            },
          });
        }

        // create event
        await prisma.event.create({
          data: {
            title: title,
            date: date,
            text: text,
            type: type,
            authorId: user.id,
            coverPhotoId: uploadedPhoto?.id,
            isPinned: isPinned,
          },
        });
      },
      { timeout: 30000 },
    );

    return ok();
  } catch (error) {
    console.log(error);
    return err("Prišlo je do napake");
  }
}

export async function getEvents(currentPage: number, pageSize: number, type?: NewsType) {
  try {
    const events = await prisma.event.findMany({
      where: {
        ...(type && { type: type }),
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        coverPhoto: true,
      },
    });

    const totalEvents = await prisma.event.count({
      where: {
        ...(type && { type: type }),
      },
    });
    const totalPages = Math.ceil(totalEvents / pageSize);

    const pinnedEvents = events.filter((event) => event.isPinned);
    const nonPinnedEvents = events.filter((event) => !event.isPinned);
    return {
      data: [...pinnedEvents, ...nonPinnedEvents],
      pagination: {
        currentPage,
        totalPages,
      },
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      pagination: null,
      error: "Napaka pri nalaganju",
    };
  }
}

export async function getEvent(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        coverPhoto: true,
      },
    });
    return {
      data: event,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Napaka pri nalaganju",
      data: null,
    };
  }
}
