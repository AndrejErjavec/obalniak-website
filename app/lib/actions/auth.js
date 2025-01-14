"use server";

import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function checkAuth() {
  // Retrieve JWT from cookies
  const c = await cookies();
  const sessionToken = c.get("session-token");
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
      // user: JSON.stringify(user);
      user: user,
    };
  } catch (error) {
    console.log("Authentication Error: ", error);
    return {
      isAuthenticated: false,
    };
  }
}

export async function createSession(previousState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      error: "Manjkajoči podatki",
    };
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return {
        error: "Uporabnik ne obstaja",
      };
    }

    // Verify password
    // const passwordMatch = await bcrypt.compare(password, user.password);
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return {
        error: "Napačno geslo",
      };
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Store this secret in .env.local
      { expiresIn: "1d" }
    );
    // Set JWT in a secure cookie
    cookies().set("session-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      // maxAge: 60 * 60, // 1 hour in seconds
      path: "/",
    });

    return {
      success: true,
      user: user
    };
  } catch (error) {
    console.log("Authentication Error: ", error);
    return {
      error: "Napaka pri prijavi",
    };
  }
}

export async function destroySession() {
  // Retrieve the session cookie
  const sessionCookie = cookies().get("session-token");

  if (!sessionCookie) {
    return {
      error: "Ni piškotov",
    };
  }

  try {
    // Clear the JWT session cookie
    cookies().delete("session-token");

    return {
      success: true,
    };
  } catch (error) {
    console.log("Error deleting session cookie: ", error);
    return {
      error: "Napaka pri odjavi",
    };
  }
}