"use server";

import prisma from "@/lib/prisma";
import { checkAuth } from "./auth";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types";
import { err, ok } from "../action.utils";
import { Comment } from "@/app/generated/prisma";

type CommentWithAuthor = Comment & {
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export async function addComment({
  text,
  ascentId,
}: {
  text: string;
  ascentId: string;
}): Promise<ActionResult<CommentWithAuthor>> {
  const { user } = await checkAuth();

  if (!user) {
    return err("Unauthorized");
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
    return ok(comment);
  } catch (error) {
    console.log(error);
    return err("Prišlo je do napake");
  }
}

export async function getComments(ascentId: string): Promise<ActionResult<CommentWithAuthor[]>> {
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
    return ok(comments);
  } catch (error) {
    console.log(error);
    return err("Napaka pri nalaganju komentarjev");
  }
}
