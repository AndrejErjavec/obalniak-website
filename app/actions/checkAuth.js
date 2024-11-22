"use server";

import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

async function checkAuth() {
  // Retrieve JWT from cookies
  const sessionToken = cookies().get("session-token");
  if (!sessionToken) {
    return {
      isAuthenticated: false,
    };
  }

  try {
    // Verify the JWT using jsonwebtoken
    const decoded = jwt.verify(sessionToken.value, process.env.JWT_SECRET);

    // Find the user in the database using the decoded userId
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return {
        isAuthenticated: false,
      };
    }

    return {
      isAuthenticated: true,
      user: JSON.stringify(user),
    };
  } catch (error) {
    console.log("Authentication Error: ", error);
    return {
      isAuthenticated: false,
    };
  }
}

export default checkAuth;
