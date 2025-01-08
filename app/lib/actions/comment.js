"use server"

import prisma from "@/app/lib/prisma";
import {checkAuth} from "./auth";
import {revalidatePath} from "next/cache";

export async function addComment({text, ascentId}) {

  const { isAuthenticated, user } = await checkAuth();

  if (!user) {
    return {
      error: 'Niste prijavljeni',
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
      }
    });
    revalidatePath(`/ascent/${ascentId}`);
    return {
      success: true,
      data: comment,
    }
  } catch(error) {
    console.log(error);
    return {
      error: "Prišlo je do napake"
    }
  }
}

export async function getComments(ascentId) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        ascentId: ascentId
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });
    return {data: comments};
  } catch(error) {
    console.log(error);
  }
}