"use server"

import prisma from "@/app/lib/prisma";
import {checkAuth} from "./auth";
import {uploadImages} from "@/app/lib/actions/image";

export async function createAscent(formData) {
  const title = formData.get("title");
  const route = formData.get("route");
  const difficulty = formData.get("difficulty");
  const date = formData.get("date");
  const text = formData.get("text");
  const coClimbersString = formData.getAll("coClimbers");
  const photos = formData.getAll("photos");

  if (!title || !route || !difficulty || !date || !text) {
    return {
      error: "Manjkajoči podatki"
    }
  }

  const { user } = await checkAuth();

  if (!user) {
    return {
      error: 'Niste prijavljeni',
    };
  }

  try {
    let unregistered;
    let registered;

    const coClimbers = JSON.parse(coClimbersString);
    if (coClimbers && coClimbers.length > 0) {
      registered = coClimbers.filter(c => typeof c == "object");
      unregistered = coClimbers.filter(c => typeof c == "string");
    }

    await prisma.$transaction(async (prisma) => {
      const ascent = await prisma.ascent.create({
        data: {
          title: title,
          route: route,
          difficulty: difficulty,
          date: date,
          text: text,
          authorId: user.id,
          unregisteredParticipants: unregistered,
        }
      });

      if (registered) {
        // store registered in separate table
        await Promise.all(
          registered.map(climber => (
            prisma.userParticipatedAscent.create({
              data: {
                userId: climber.id,
                ascentId: ascent.id
              }
            })
        )));
      }

      if (photos && photos.length > 0) {
        // store photos in Cloudinary bucket and save links
        const secureUrls = await uploadImages(photos);
        await Promise.all(secureUrls.map(url => (
          prisma.photo.create({
            data: {
              url: url,
              ascentId: ascent.id,
            }
          })
        )));
      }
    }, {timeout: 30000}); // end of transaction

    return {
      success: true,
    }

  } catch (error) {
    console.log(error);
    return {error: "Prišlo je do napake"}
  }
}

export async function getAscents(query) {
  try {
    const ascents = await prisma.ascent.findMany({
      include: {
        photos: true,
        author: true
      },
      ...(!!query && {
        where: {
          title: {
            contains: String(query),
            mode: 'insensitive'
          }
        },
        orderBy: {
          createdAt: "desc",
        }
      })
    });
    return ascents
  } catch (error) {
    console.error(error);
    return {
      error: "Napaka pri nalaganju"
    }
  }
}

export async function getAscent(id) {
  try {
    const ascent = await prisma.ascent.findUnique({
      where: {
        id: id
      },
      include: {
        photos: true,
        author: true,
        registeredParticipants: {
          include: {
            user: true
          }
        },
      },
    });

    ascent.registeredParticipants = ascent.registeredParticipants.map((p) => p.user)

    return {
      success: true,
      data: ascent,
    }
  } catch (error) {
    console.error(error);
    return {
      error: "Napaka pri nalaganju"
    }
  }
}

export async function getUserAscents(userId) {
  try {
    // const ascents = await prisma.ascent.findMany({
    //   where: {
    //     authorId: userId
    //   },
    //   include: {
    //     author: true
    //   }
    // });
    //
    // const ascents2 = await prisma.ascent.findMany({
    //   where: {
    //     registeredParticipants: {
    //       some: {
    //         userId: userId,
    //       },
    //     },
    //   },
    // });

    const ascents = await prisma.ascent.findMany({
      where: {
        OR: [
          {
            authorId: userId, // User is the author
          },
          {
            registeredParticipants: {
              some: {
                userId: userId, // User participated
              },
            },
          },
        ],
      },
      include: {
        author: true,
      }
    });

    return ascents;
  } catch (error) {
    console.log(error);
    return {error: "Napaka pri nalaganju"}
  }
}
