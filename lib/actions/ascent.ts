"use server";

import prisma from "@/lib/prisma";
import { checkAuth } from "./auth";
import { uploadImages } from "@/lib/actions/image";

export async function createAscent(prevState: any, formData: FormData) {
  const title = String(formData.get("title"));
  const route = String(formData.get("route"));
  const difficulty = String(formData.get("difficulty"));
  const date = String(formData.get("date"));
  const text = String(formData.get("text"));
  const coClimbersString = String(formData.getAll("coClimbers"));
  const photos = formData.getAll("photos");

  if (!title || !route || !difficulty || !date || !text) {
    return { success: false, error: "Manjkajoči podatki" };
  }

  const { user } = await checkAuth();

  if (!user) {
    return {
      success: false,
      error: "Niste prijavljeni",
    };
  }

  try {
    let unregistered: string[];
    let registered;

    const coClimbers = JSON.parse(coClimbersString);
    if (coClimbers && coClimbers.length > 0) {
      registered = coClimbers.filter((c) => typeof c == "object");
      unregistered = coClimbers.filter((c) => typeof c == "string");
    }

    await prisma.$transaction(
      async (prisma) => {
        const ascent = await prisma.ascent.create({
          data: {
            title: title,
            route: route,
            difficulty: difficulty,
            date: date,
            text: text,
            authorId: user.id,
            unregisteredParticipants: unregistered,
          },
        });

        if (registered) {
          // store registered in separate table
          await Promise.all(
            registered.map((climber) =>
              prisma.userParticipatedAscent.create({
                data: {
                  userId: climber.id,
                  ascentId: ascent.id,
                },
              }),
            ),
          );
        }

        if (photos && photos.length > 0) {
          // store photos in Cloudinary bucket and save links
          const secureUrls = await uploadImages(photos);
          await Promise.all(
            secureUrls.map((url: string) =>
              prisma.photo.create({
                data: {
                  url: url,
                  ascentId: ascent.id,
                },
              }),
            ),
          );
        }
      },
      { timeout: 30000 },
    ); // end of transaction

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Prišlo je do napake",
    };
  }
}

export async function getAscents(currentPage: number, pageSize: number, query?: string) {
  try {
    const ascents = await prisma.ascent.findMany({
      include: {
        photos: true,
        author: true,
        registeredParticipants: true,
      },
      ...(!!query && {
        where: {
          title: {
            contains: String(query),
            mode: "insensitive",
          },
        },
      }),
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      orderBy: {
        date: "desc",
      },
    });

    const totalEvents = await prisma.event.count();
    const totalPages = Math.ceil(totalEvents / pageSize);

    return {
      data: ascents,
      pagination: {
        currentPage,
        totalPages,
      },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      pagination: null,
      error: "Napaka pri nalaganju",
    };
  }
}

export async function getAscent(id: string) {
  try {
    const ascent = await prisma.ascent.findUnique({
      where: {
        id: id,
      },
      include: {
        photos: true,
        author: true,
        registeredParticipants: true,
      },
    });

    if (!ascent) {
      return {
        data: null,
        error: "Ascent not found",
      };
    }

    ascent.registeredParticipants = ascent.registeredParticipants.map((p) => p.user);

    return {
      data: ascent,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Napaka pri nalaganju",
      data: null,
    };
  }
}

export async function getUserAscents(userId: string, currentPage: number, pageSize: number) {
  const where = {
    OR: [
      {
        authorId: userId,
      },
      {
        registeredParticipants: {
          some: {
            userId: userId,
          },
        },
      },
    ],
  };

  try {
    const [totalAscents, ascents] = await prisma.$transaction([
      prisma.ascent.count({ where }),
      prisma.ascent.findMany({
        where,
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        orderBy: {
          date: "desc",
        },
        include: {
          author: true,
          photos: true,
          registeredParticipants: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalAscents / pageSize);

    return {
      data: ascents,
      pagination: {
        currentPage,
        totalPages,
      },
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
