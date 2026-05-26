"use server";

import prisma from "@/lib/prisma";
import { deleteImages } from "@/lib/actions/image";
import { ActionResult, NewsType, PaginatedData } from "@/types";
import { err, ok } from "../action-utils";
import { Event, Photo } from "@/app/generated/prisma";
import { requireAdmin } from "../authMiddleware";
import { revalidatePath } from "next/cache";

type EventWithPhotos = Event & {
  photos: Photo[];
};

type EventWithPhotosAndAuthor = EventWithPhotos & {
  author: {
    firstName: string;
    lastName: string;
  };
};

export type AdminEventSummary = EventWithPhotosAndAuthor;

type ParsedEventFormData = {
  title: string;
  date: string | null;
  text: string;
  photoUrls: string[];
  removePhotoIds: string[];
  isPinned: boolean;
  type: NewsType;
};

function parseEventFormData(formData: FormData): ParsedEventFormData {
  return {
    title: String(formData.get("title") ?? "").trim(),
    date: String(formData.get("date") ?? "").trim() || null,
    text: String(formData.get("text") ?? "").trim(),
    photoUrls: formData.getAll("photoUrls").map((url) => String(url).trim()).filter(Boolean),
    removePhotoIds: formData.getAll("removePhotoIds").map((id) => String(id).trim()).filter(Boolean),
    isPinned: formData.get("isPinned") === "true",
    type: String(formData.get("type")) as NewsType,
  };
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
  const { title, date, text, photoUrls, isPinned, type } = parseEventFormData(formData);

  if (!title || !text) {
    return err("Manjkajoči podatki");
  }

  try {
    const createdEvent = await prisma.$transaction(
      async (tx) => {
        const event = await tx.event.create({
          data: {
            title,
            date,
            text,
            type,
            authorId: user.id,
            isPinned,
          },
        });

        if (photoUrls.length > 0) {
          await tx.photo.createMany({
            data: photoUrls.map((url, position) => ({
              url,
              position,
              eventId: event.id,
            })),
          });
        }

        return tx.event.findUniqueOrThrow({
          where: {
            id: event.id,
          },
          include: {
            photos: {
              orderBy: {
                position: "asc",
              },
            },
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

  const { title, date, text, photoUrls, removePhotoIds, isPinned, type } = parseEventFormData(formData);

  if (!title || !text) {
    return err("Manjkajoči podatki");
  }

  try {
    const { event: updatedEvent, deletedPhotoUrls } = await prisma.$transaction(
      async (tx) => {
        const existingEvent = await tx.event.findUnique({
          where: {
            id,
          },
          include: {
            photos: {
              orderBy: {
                position: "asc",
              },
            },
          },
        });

        if (!existingEvent) {
          throw new Error("EVENT_NOT_FOUND");
        }

        const photosToDelete = existingEvent.photos.filter((photo) => removePhotoIds.includes(photo.id));
        const deletedPhotoUrls = photosToDelete.map((photo) => photo.url);
        const remainingExistingPhotos = existingEvent.photos.filter((photo) => !removePhotoIds.includes(photo.id));

        if (photosToDelete.length > 0) {
          await tx.photo.deleteMany({
            where: {
              id: {
                in: photosToDelete.map((photo) => photo.id),
              },
            },
          });
        }

        await Promise.all(
          remainingExistingPhotos.map((photo, position) =>
            tx.photo.update({
              where: {
                id: photo.id,
              },
              data: {
                position,
              },
            }),
          ),
        );

        if (photoUrls.length > 0) {
          await tx.photo.createMany({
            data: photoUrls.map((url, index) => ({
              url,
              eventId: id,
              position: remainingExistingPhotos.length + index,
            })),
          });
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
          },
          include: {
            photos: {
              orderBy: {
                position: "asc",
              },
            },
            author: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        });

        return {
          event,
          deletedPhotoUrls,
        };
      },
      { timeout: 30000 },
    );

    if (deletedPhotoUrls.length > 0) {
      await deleteImages(deletedPhotoUrls);
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
          photos: true,
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

      if (event.photos.length > 0) {
        await tx.photo.deleteMany({
          where: {
            id: {
              in: event.photos.map((photo) => photo.id),
            },
          },
        });
      }

      return event.photos.map((photo) => photo.url);
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
        photos: {
          orderBy: {
            position: "asc",
          },
        },
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
        photos: {
          orderBy: {
            position: "asc",
          },
          take: 1,
        },
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
): Promise<ActionResult<PaginatedData<EventWithPhotos[]>>> {
  try {
    const events = await prisma.event.findMany({
      where: {
        ...(type && { type }),
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        photos: {
          orderBy: {
            position: "asc",
          },
          take: 1,
        },
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

export async function getEvent(id: string): Promise<ActionResult<EventWithPhotosAndAuthor>> {
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
        photos: {
          orderBy: {
            position: "asc",
          },
        },
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
