"use server";

import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { ActionResult } from "@/types";
import { User } from "@/app/generated/prisma";
import { err, ok } from "../action.utils";

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
      user: user,
      sessionToken: sessionToken,
    };
  } catch (error) {
    console.error("Authentication Error: ", error.message);
    return {
      isAuthenticated: false,
    };
  }
}

export async function createSession(
  prevState: ActionResult<User> | null,
  formData: FormData,
): Promise<ActionResult<User>> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  if (!email || !password) {
    return err("Manjkajoči podatki");
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return err("Uporabnik ne obstaja");
    }

    // Verify password
    // const passwordMatch = await bcrypt.compare(password, user.password);
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return err("Napačno geslo");
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Store this secret in .env.local
      // { expiresIn: "1d" },
    );
    // Set JWT in a secure cookie
    const c = await cookies();
    c.set("session-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      // maxAge: 60 * 60, // 1 hour in seconds
    });

    return ok(user);
  } catch (error) {
    console.log("Authentication Error: ", error);
    return err("Napaka pri prijavi");
  }
}

export async function destroySession() {
  // Retrieve the session cookie
  const c = await cookies();
  const sessionCookie = c.get("session-token");

  if (!sessionCookie) {
    return {
      success: false,
      error: "Ni piškotov",
    };
  }

  try {
    // Clear the JWT session cookie
    c.delete("session-token");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.log("Error deleting session cookie: ", error);
    return {
      success: false,
      error: "Napaka pri odjavi",
    };
  }
}
