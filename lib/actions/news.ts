"use server";

import prisma from "@/lib/prisma";
import { deleteImages } from "@/lib/actions/image";
import { ActionResult, NewsType, PaginatedData } from "@/types";
import { err, ok } from "../action-utils";
import { Event, Photo } from "@/app/generated/prisma";
import { requireAdmin } from "../authMiddleware";
import { revalidatePath } from "next/cache";

type EventWithCoverPhoto = Event & {
  coverPhoto: Photo | null;
};

type EventWithCoverPhotoAndAuthor = EventWithCoverPhoto & {
  author: {
    firstName: string;
    lastName: string;
  };
};

export type AdminEventSummary = EventWithCoverPhotoAndAuthor;

type ParsedEventFormData = {
  title: string;
  date: string | null;
  text: string;
  photoUrl: string | null;
  isPinned: boolean;
  type: NewsType;
  replaceRemove: boolean;
};

function parseEventFormData(formData: FormData): ParsedEventFormData {
  return {
    title: String(formData.get("title") ?? "").trim(),
    date: String(formData.get("date") ?? "").trim() || null,
    text: String(formData.get("text") ?? "").trim(),
    photoUrl: String(formData.get("photoUrl") ?? "").trim() || null,
    isPinned: formData.get("isPinned") === "true",
    type: String(formData.get("type")) as NewsType,
    replaceRemove: formData.get("replaceRemove") === "true",
  };
}

async function createPhotoRecord(photoUrl: string, tx: { photo: typeof prisma.photo }) {
  if (!photoUrl) {
    throw new Error("Manjka URL slike");
  }

  return tx.photo.create({
    data: {
      url: photoUrl,
    },
  });
}

function revalidateNewsPaths(eventId?: string) {
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/alpine-school");
  revalidatePath("/admin/news");

  if (eventId) {
    revalidatePath(`/news/${eventId}`);
  }
}

export async function createEvent(formData: FormData): Promise<ActionResult<AdminEventSummary>> {
  const user = await requireAdmin();
  const { title, date, text, photoUrl, isPinned, type } = parseEventFormData(formData);

  if (!title || !text) {
    return err("Manjkajoči podatki");
  }

  try {
    const createdEvent = await prisma.$transaction(
      async (tx) => {
        let uploadedPhoto: Photo | null = null;

        if (photoUrl) {
          uploadedPhoto = await createPhotoRecord(photoUrl, tx);
          console.log(uploadedPhoto);
        }

        return tx.event.create({
          data: {
            title,
            date,
            text,
            type,
            authorId: user.id,
            coverPhotoId: uploadedPhoto?.id,
            isPinned,
          },
          include: {
            coverPhoto: true,
            author: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        });
      },
      { timeout: 30000 },
    );

    revalidateNewsPaths(createdEvent.id);

    return ok(createdEvent);
  } catch (error) {
    console.log(error);
    return err("Prišlo je do napake");
  }
}

export async function updateEvent(id: string, formData: FormData): Promise<ActionResult<AdminEventSummary>> {
  await requireAdmin();

  const { title, date, text, photoUrl, isPinned, type, replaceRemove } = parseEventFormData(formData);

  console.log(parseEventFormData(formData));

  if (!title || !text) {
    return err("Manjkajoči podatki");
  }

  try {
    const { event: updatedEvent, deletedPhotoUrl } = await prisma.$transaction(
      async (tx) => {
        const existingEvent = await tx.event.findUnique({
          where: {
            id,
          },
          include: {
            coverPhoto: true,
          },
        });

        if (!existingEvent) {
          throw new Error("EVENT_NOT_FOUND");
        }

        let newCoverPhotoId = existingEvent.coverPhotoId;
        let oldCoverPhotoIdToDelete: string | null = null;
        let oldCoverPhotoUrlToDelete: string | null = null;

        if (replaceRemove) {
          oldCoverPhotoIdToDelete = existingEvent.coverPhotoId;
          oldCoverPhotoUrlToDelete = existingEvent.coverPhoto?.url ?? null;
        }

        if (photoUrl) {
          const newPhoto = await createPhotoRecord(photoUrl, tx);
          newCoverPhotoId = newPhoto.id;
        }

        const event = await tx.event.update({
          where: {
            id,
          },
          data: {
            title,
            date,
            text,
            type,
            isPinned,
            coverPhotoId: newCoverPhotoId,
          },
          include: {
            coverPhoto: true,
            author: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        });

        if (oldCoverPhotoIdToDelete) {
          await tx.photo.delete({
            where: {
              id: oldCoverPhotoIdToDelete,
            },
          });
        }

        return {
          event,
          deletedPhotoUrl: oldCoverPhotoUrlToDelete,
        };
      },
      { timeout: 30000 },
    );

    if (deletedPhotoUrl) {
      await deleteImages([deletedPhotoUrl]);
    }

    revalidateNewsPaths(updatedEvent.id);

    return ok(updatedEvent);
  } catch (error) {
    console.log(error);

    if (error instanceof Error && error.message === "EVENT_NOT_FOUND") {
      return err("Novica ne obstaja");
    }

    return err("Prišlo je do napake");
  }
}

export async function deleteEvent(id: string): Promise<ActionResult<string>> {
  await requireAdmin();

  try {
    const deletedPhotoUrls = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: {
          id,
        },
        include: {
          coverPhoto: true,
        },
      });

      if (!event) {
        throw new Error("EVENT_NOT_FOUND");
      }

      await tx.event.delete({
        where: {
          id,
        },
      });

      if (event.coverPhotoId) {
        await tx.photo.delete({
          where: {
            id: event.coverPhotoId,
          },
        });
      }

      return event.coverPhoto?.url ? [event.coverPhoto.url] : [];
    });

    await deleteImages(deletedPhotoUrls);

    revalidateNewsPaths(id);

    return ok(id);
  } catch (error) {
    console.log(error);

    if (error instanceof Error && error.message === "EVENT_NOT_FOUND") {
      return err("Novica ne obstaja");
    }

    return err("Prišlo je do napake");
  }
}

export async function getAdminEvent(id: string): Promise<ActionResult<AdminEventSummary>> {
  await requireAdmin();

  try {
    const event = await prisma.event.findUnique({
      where: {
        id,
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

    if (!event) {
      return err("Novica ne obstaja");
    }

    return ok(event);
  } catch (error) {
    console.log(error);
    return err("Napaka pri nalaganju");
  }
}

export async function getAdminEvents(
  currentPage: number,
  pageSize: number,
): Promise<ActionResult<PaginatedData<AdminEventSummary[]>>> {
  await requireAdmin();

  try {
    const events = await prisma.event.findMany({
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        coverPhoto: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const totalEvents = await prisma.event.count();
    const totalPages = Math.ceil(totalEvents / pageSize);

    return ok({
      data: events,
      pagination: {
        currentPage,
        totalPages,
        totalItems: totalEvents,
      },
    });
  } catch (error) {
    console.log(error);
    return err("Napaka pri nalaganju");
  }
}

export async function getEvents(
  currentPage: number,
  pageSize: number,
  type?: NewsType,
): Promise<ActionResult<PaginatedData<EventWithCoverPhoto[]>>> {
  try {
    const events = await prisma.event.findMany({
      where: {
        ...(type && { type }),
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        coverPhoto: true,
      },
    });

    const totalEvents = await prisma.event.count({
      where: {
        ...(type && { type }),
      },
    });
    const totalPages = Math.ceil(totalEvents / pageSize);

    return ok({
      data: events,
      pagination: {
        currentPage,
        totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    return err("Napaka pri nalaganju");
  }
}

export async function getEvent(id: string): Promise<ActionResult<EventWithCoverPhotoAndAuthor>> {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id,
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

    if (!event) {
      return err("Event not found");
    }

    return ok(event);
  } catch (error) {
    console.log(error);
    return err("Napaka pri nalaganju");
  }
}
