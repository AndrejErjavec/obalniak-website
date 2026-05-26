"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { type ActionResult } from "@/types";
import { MembershipRequestStatus, User } from "@/app/generated/prisma";
import { err, ok } from "../action-utils";
import { revalidatePath } from "next/cache";

type UpdateMemberData = {
  firstName: string;
  lastName: string;
  email: string;
  experienceLevel: string | null;
  status: MembershipRequestStatus;
};

export async function createUser(
  prevState: ActionResult<User> | null,
  formData: FormData,
): Promise<ActionResult<User>> {
  const firstName = formData.get("firstName")?.toString().trim() ?? "";
  const lastName = formData.get("lastName")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = String(formData.get("password"));
  const confirmPassword = String(formData.get("confirm-password"));

  if (!email || !firstName || !lastName || !password) {
    return {
      success: false,
      error: "Please fill in all fields",
    };
  }

  // if (password.length < 8) {
  //   return {
  //     success: false,
  //     error: "Password must be at least 8 characters long",
  //   };
  // }

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

type UpdateMemberResult = "UPDATED" | "REJECTED";

export async function updateMember(
  id: string,
  data: UpdateMemberData,
): Promise<ActionResult<{ user: User; status: UpdateMemberResult }>> {
  let updatedMember: User;
  let updateStatus: UpdateMemberResult;
  const firstName = data.firstName.trim();
  const lastName = data.lastName.trim();
  const email = data.email.trim().toLowerCase();
  const { experienceLevel, status } = data;

  if (status !== "REJECTED" && (!firstName || !lastName || !email)) {
    return err("Izpolnite vsa polja");
  }

  if (status === "ACCEPTED" && !experienceLevel) {
    return err("Izberite izkušenost");
  }

  try {
    if (status === "REJECTED") {
      updateStatus = "REJECTED";
      updatedMember = await prisma.user.delete({
        where: {
          id,
        },
      });
    } else {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive",
          },
          NOT: {
            id,
          },
        },
      });

      if (existingUser) {
        return err("Email je že registriran");
      }

      updateStatus = "UPDATED";
      updatedMember = await prisma.user.update({
        where: {
          id,
        },
        data: {
          firstName,
          lastName,
          email,
          experienceLevel,
          status,
        },
      });
    }

    revalidatePath("/members");
    revalidatePath("/admin/members");
    return ok({ user: updatedMember, status: updateStatus });
  } catch (error) {
    console.error("Error in updateMember", error);
    return err("Uporabnika ni bilo mogoče posodobiti");
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
