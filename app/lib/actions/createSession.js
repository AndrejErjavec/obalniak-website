"use server";

import prisma from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function createSession(previousState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      error: "Please fill out all fields",
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
        error: "Invalid Credentials",
      };
    }

    // Verify password
    // const passwordMatch = await bcrypt.compare(password, user.password);
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return {
        error: "Invalid Credentials",
      };
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Store this secret in .env.local
      { expiresIn: "1h" }
    );
    // Set JWT in a secure cookie
    cookies().set("session-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour in seconds
      path: "/",
    });

    return {
      success: true,
      user: JSON.stringify(user),
    };
  } catch (error) {
    console.log("Authentication Error: ", error);
    return {
      error: "Invalid Credentials",
    };
  }
}

export default createSession;
