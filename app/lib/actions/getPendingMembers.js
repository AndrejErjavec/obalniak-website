"use server";

import prisma from "@/app/lib/prisma";

async function getPendingMembers() {
  try {
    const pendingMembers = await prisma.user.findMany({
      // where: {
      //   accepted: false,
      // },
      orderBy: {
        accepted: "asc",
      },
    });

    return pendingMembers;
  } catch (error) {
    console.error("Error fetching pending members:", error);
    return { error: "Could not retrieve pending members" };
  }
}

export default getPendingMembers;
