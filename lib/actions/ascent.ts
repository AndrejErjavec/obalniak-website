"use server";

import prisma from "@/lib/prisma";
import type { Ascent, Prisma, User } from "@/app/generated/prisma";
import { ActionResult, AscentFilterType, PaginatedData } from "@/types";
import { err, ok } from "../action.utils";
import { requireUser } from "../authMiddleware";
import { buildAscentQuery } from "../util";

type CoClimber = User | string;

type AscentWithData = Prisma.AscentGetPayload<{
  include: {
    author: true;
    registeredParticipants: true;
    unregisteredParticipants: true;
    photos: true;
  };
}>;

export async function createAscent(formData: FormData): Promise<ActionResult<Ascent>> {
  const route = String(formData.get("route"));
  const difficulty = String(formData.get("difficulty"));
  const routeLength = Number(formData.get("length"));
  const date = String(formData.get("date"));
  const text = String(formData.get("text"));
  const coClimbersString = String(formData.get("coClimbers") ?? "[]");
  const photoUrls = formData.getAll("photoUrls") as string[];

  const user = await requireUser();

  if (!route || !difficulty || !date || !routeLength) {
    return err("Manjkajoči podatki");
  }

  try {
    let coClimbers: CoClimber[] = [];

    try {
      coClimbers = JSON.parse(coClimbersString) as CoClimber[];
    } catch {
      return err("Neveljavni podatki o soplezalcih");
    }

    const registeredParticipantIds = [
      ...new Set(
        coClimbers
          .filter((climber): climber is User => typeof climber === "object" && climber !== null && "id" in climber)
          .map((climber) => climber.id),
      ),
    ];
    const unregisteredParticipantNames = [
      ...new Set(coClimbers.filter((climber): climber is string => typeof climber === "string")),
    ];

    const ascent = await prisma.$transaction(async (prisma) => {
      const ascentData: Prisma.AscentCreateInput = {
        route,
        difficulty,
        routeLength,
        date,
        text,
        author: {
          connect: {
            id: user.id,
          },
        },
      };

      if (unregisteredParticipantNames.length > 0) {
        ascentData.unregisteredParticipants = {
          create: unregisteredParticipantNames.map((name) => ({ name })),
        };
      }

      if (registeredParticipantIds.length > 0) {
        ascentData.registeredParticipants = {
          connect: registeredParticipantIds.map((id) => ({ id })),
        };
      }

      const ascent = await prisma.ascent.create({
        data: ascentData,
        include: {
          unregisteredParticipants: true,
        },
      });

      if (photoUrls && photoUrls.length > 0) {
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

    return ok(ascent);
  } catch (error) {
    console.log(error);
    return err("Prišlo je do napake");
  }
}

export async function getAscents(
  currentPage: number,
  pageSize: number,
  query?: string,
  queryBy?: AscentFilterType,
): Promise<ActionResult<PaginatedData<Ascent[]>>> {
  const queryByInsert = buildAscentQuery(query, queryBy);

  try {
    const ascents = await prisma.ascent.findMany({
      include: {
        photos: true,
        author: true,
        registeredParticipants: true,
        unregisteredParticipants: true,
      },
      ...(!!query && queryByInsert),
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      orderBy: {
        date: "desc",
      },
    });

    const totalAscents = ascents.length; //await prisma.ascent.count();
    const totalPages = Math.ceil(totalAscents / pageSize);

    return ok({
      data: ascents,
      pagination: {
        currentPage,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return err("Napaka pri nalaganju");
  }
}

export async function getAscent(id: string): Promise<ActionResult<AscentWithData>> {
  try {
    const ascent = await prisma.ascent.findUnique({
      where: {
        id: id,
      },
      include: {
        photos: true,
        author: true,
        registeredParticipants: true,
        unregisteredParticipants: true,
      },
    });

    if (!ascent) {
      return err("Ascent not found");
    }

    return ok(ascent);
  } catch (error) {
    console.error(error);
    return err("Napaka pri nalaganju");
  }
}

export async function getUserAscents(
  userId: string,
  currentPage: number,
  pageSize: number,
): Promise<ActionResult<PaginatedData<Ascent[]>>> {
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
          unregisteredParticipants: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalAscents / pageSize);

    return ok({
      data: ascents,
      pagination: {
        currentPage,
        totalPages,
        totalItems: totalAscents,
      },
    });
  } catch (error) {
    console.log(error);
    return err("Napaka pri nalaganju");
  }
}
