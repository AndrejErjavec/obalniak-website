"use server";

import prisma from "@/lib/prisma";
import { checkAuth } from "./auth";
import { revalidatePath } from "next/cache";

export async function addComment({ text, ascentId }: { text: string; ascentId: string }) {
  const { user } = await checkAuth();

  if (!user) {
    return {
      error: "Niste prijavljeni",
    };
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        text: text,
        authorId: user.id,
        ascentId: ascentId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    revalidatePath(`/ascent/${ascentId}`);
    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Prišlo je do napake",
    };
  }
}

export async function getComments(ascentId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        ascentId: ascentId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return { data: comments };
  } catch (error) {
    console.log(error);
    return { error: "Napaka pri nalaganju komentarjev" };
  }
}
