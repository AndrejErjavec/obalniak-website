"use server";

import prisma from "@/lib/prisma";
import { checkAuth } from "./auth";
import type { Ascent, User } from "@/app/generated/prisma";
import { Result } from "@/types";

type CoClimber = User | string;

export async function createAscent(formData: FormData): Promise<Result<string, Ascent>> {
  const title = String(formData.get("title"));
  const route = String(formData.get("route"));
  const difficulty = String(formData.get("difficulty"));
  const date = String(formData.get("date"));
  const text = String(formData.get("text"));
  const coClimbersString = String(formData.get("coClimbers") ?? "[]");
  const photoUrls = formData.getAll("photoUrls") as string[];

  if (!title || !route || !difficulty || !date || !text) {
    return { error: "Manjkajoči podatki" };
  }

  const { user } = await checkAuth();

  if (!user) {
    return {
      error: "Niste prijavljeni",
    };
  }

  try {
    let coClimbers: CoClimber[] = [];

    try {
      coClimbers = JSON.parse(coClimbersString) as CoClimber[];
    } catch {
      return {
        error: "Neveljavni podatki o soplezalcih",
      };
    }

    const registeredParticipantIds = [
      ...new Set(
        coClimbers
          .filter((climber): climber is User => typeof climber === "object" && climber !== null && "id" in climber)
          .map((climber) => climber.id),
      ),
    ];
    const unregisteredParticipants = coClimbers.filter((climber): climber is string => typeof climber === "string");

    const ascent = await prisma.$transaction(async (prisma) => {
      const ascent = await prisma.ascent.create({
        data: {
          title,
          route,
          difficulty,
          date,
          text,
          author: {
            connect: {
              id: user.id,
            },
          },
          unregisteredParticipants,
          ...(registeredParticipantIds.length > 0 && {
            registeredParticipants: {
              connect: registeredParticipantIds.map((id) => ({ id })),
            },
          }),
        },
      });

      if (photoUrls && photoUrls.length > 0) {
        // store photos in Cloudinary bucket and save links
        // const secureUrls = await uploadImages(photos);
        await Promise.all(
          photoUrls.map((url: string) =>
            prisma.photo.create({
              data: {
                url: url,
                ascentId: ascent.id,
              },
            }),
          ),
        );
      }
      return ascent;
    }); // end of transaction

    return {
      data: ascent,
    };
  } catch (error) {
    console.log(error);
    return {
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

    const totalAscents = await prisma.ascent.count();
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
            id: userId,
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
        totalItems: totalAscents,
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
