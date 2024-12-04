"use server";

import prisma from "@/app/lib/prisma";

async function acceptMember(id, experienceLevel) {
  if (!experienceLevel) {
    return {
      error: "Izberite izkušenost",
    };
  }
  try {
    const acceptedMember = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        experienceLevel: experienceLevel,
        accepted: true,
      },
    });
    return acceptedMember;
  } catch (error) {
    console.error("Error in accept member", error);
    return { error: "Error in accept member" };
  }
}

export default acceptMember;
