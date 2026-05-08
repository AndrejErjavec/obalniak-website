"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { type ActionResult } from "@/types";
import { MembershipRequestStatus, User } from "@/app/generated/prisma";
import { err, ok } from "../action-utils";
import { revalidatePath } from "next/cache";

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
  rejected: User[];
  failed: Array<{
    id: string;
    error: string;
  }>;
};

type UpdateMemberResult = "UPDATED" | "REJECTED";

export async function updateMember(
  id: string,
  experienceLevel: string | null,
  status: MembershipRequestStatus,
): Promise<ActionResult<{ user: User; status: UpdateMemberResult }>> {
  let updatedMember: User;
  let updateStatus: UpdateMemberResult;
  try {
    if (status === "REJECTED") {
      updateStatus = "REJECTED";
      updatedMember = await prisma.user.delete({
        where: {
          id,
        },
      });
    } else {
      if (!experienceLevel) {
        return err("Izberite izkušenost");
      }
      updateStatus = "UPDATED";
      updatedMember = await prisma.user.update({
        where: {
          id,
        },
        data: {
          experienceLevel,
          status,
        },
      });
    }

    revalidatePath("/members");
    return ok({ user: updatedMember, status: updateStatus });
  } catch (error) {
    console.error("Error in accept member", error);
    return err("Error in accept member");
  }
}

export async function updateMembersBulk(
  updates: { id: string; experienceLevel: string | null; status: MembershipRequestStatus }[],
) {
  try {
    const results = await Promise.all(
      updates.map(async ({ id, experienceLevel, status }) => {
        const result = await updateMember(id, experienceLevel, status);
        return { id, result };
      }),
    );
    const updated: User[] = [];
    const rejected: User[] = [];
    const failed: BulkUpdateMembersData["failed"] = [];
    for (const { id, result } of results) {
      if (!result.success) {
        failed.push({
          id,
          error: result.error!,
        });
      } else {
        if (result.data.status === "UPDATED") {
          updated.push(result.data.user);
        } else if (result.data.status === "REJECTED") {
          rejected.push(result.data.user);
        } else {
        }
      }
    }
    console.log("success");
    revalidatePath("/members");
    return {
      data: {
        updated,
        rejected,
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
      where: {
        NOT: {
          status: "REJECTED",
        },
      },
      orderBy: {
        status: "asc",
      },
    });

    return ok(users);
  } catch (error) {
    console.error("Error fetching members:", error);
    return err("Could not retrieve members");
  }
}

export async function getAllAcceptedUsers(): Promise<ActionResult<User[]>> {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: "ACCEPTED",
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    });

    return ok(users);
  } catch (error) {
    console.error("Error fetching members:", error);
    return err("Could not retrieve members");
  }
}

export async function getUsersByName(nameQuery: string): Promise<ActionResult<User[]>> {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: "ACCEPTED",
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
    console.error("Error fetching members:", error);
    return err("Could not retrieve members");
  }
}
