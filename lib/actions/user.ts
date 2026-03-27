"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { type ActionResult } from "@/types";
import { User } from "@/app/generated/prisma";
import { err, ok } from "../action.utils";

export async function createUser(
  prevState: ActionResult<User> | null,
  formData: FormData,
): Promise<ActionResult<User>> {
  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const confirmPassword = String(formData.get("confirm-password"));

  // Validate required fields
  if (!email || !firstName || !lastName || !password) {
    return {
      success: false,
      error: "Please fill in all fields",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: "Passwords do not match",
    };
  }

  try {
    // Check if user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return {
        success: false,
        error: "Email is already registered",
      };
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword.toString(), // Store hashed password
      },
    });

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.log("Registration Error: ", error);
    return {
      success: false,
      error: "Could not register user",
    };
  }
}

type BulkUpdateMembersData = {
  updated: User[];
  failed: Array<{
    id: string;
    error: string;
  }>;
};

export async function updateMember(id: string, experienceLevel: string | null): Promise<ActionResult<User>> {
  if (!experienceLevel) {
    return err("Izberite izkušenost");
  }

  try {
    const updatedMember = await prisma.user.update({
      where: {
        id,
      },
      data: {
        experienceLevel,
        accepted: true,
      },
    });

    return ok(updatedMember);
  } catch (error) {
    console.error("Error in accept member", error);
    return err("Error in accept member");
  }
}

export async function updateMembersBulk(updates: { id: string; experienceLevel: string | null }[]) {
  try {
    const results = await Promise.all(
      updates.map(async ({ id, experienceLevel }) => {
        const result = await updateMember(id, experienceLevel);
        return { id, result };
      }),
    );

    const updated: User[] = [];
    const failed: BulkUpdateMembersData["failed"] = [];

    for (const { id, result } of results) {
      if (!result.success) {
        failed.push({
          id,
          error: result.error!,
        });
      } else {
        updated.push(result.data);
      }
    }

    return {
      data: {
        updated,
        failed,
      },
    };
  } catch (error) {
    console.error("Error in updateMembersBulk", error);
    return {
      error: "Failed to update members",
    };
  }
}

export async function getUsers(): Promise<ActionResult<User[]>> {
  try {
    const users = await prisma.user.findMany();
    return ok(users);
  } catch (error) {
    console.log(error);
    return err("Napaka pri pridobivanju podatkov");
  }
}

export async function getUser(id: string): Promise<ActionResult<User>> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return err("Uporabnik ni najden");
    }
    return ok(user);
  } catch (error) {
    console.log("Error in getting user", error);
    return err("Error in getUser");
  }
}

export async function getAllUsers(): Promise<ActionResult<User[]>> {
  try {
    const users = await prisma.user.findMany({
      // where: {
      //   accepted: false,
      // },
      orderBy: {
        accepted: "asc",
      },
    });

    return ok(users);
  } catch (error) {
    console.error("Error fetching pending members:", error);
    return err("Could not retrieve pending members");
  }
}

export async function getUsersByName(nameQuery: string): Promise<ActionResult<User[]>> {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { startsWith: nameQuery, mode: "insensitive" } },
          { lastName: { startsWith: nameQuery, mode: "insensitive" } },
        ],
      },
      orderBy: {
        firstName: "asc",
      },
    });

    return ok(users);
  } catch (error) {
    console.error("Error fetching pending members:", error);
    return err("Could not retrieve pending members");
  }
}
