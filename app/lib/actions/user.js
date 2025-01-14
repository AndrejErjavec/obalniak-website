"use server";

import prisma from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function createUser(previousState, formData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");

  // Validate required fields
  if (!email || !firstName || !lastName || !password) {
    return {
      error: "Please fill in all fields",
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters long",
    };
  }

  if (password !== confirmPassword) {
    return {
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
        error: "Email is already registered",
      };
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const result = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword.toString(), // Store hashed password
      }
    });

    return {
      success: true,
      //userId: result.insertedId,
    };
  } catch (error) {
    console.log("Registration Error: ", error);
    return {
      error: "Could not register user",
    };
  }
}

export async function acceptMember(id, experienceLevel) {
  if (!experienceLevel) {
    return {
      error: "Izberite izkušenost",
    };
  }
  try {
    const acceptedMember = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        experienceLevel: experienceLevel,
        accepted: true,
      },
    });
    return acceptedMember;
  } catch (error) {
    console.error("Error in accept member", error);
    return { error: "Error in accept member" };
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.log(error);
    return {
      error: "Napaka pri pridobivanju podatkov"
    }
  }
}

export async function getUser(id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        password: false
      }
    });
    return user;
  } catch (error) {
    console.log("Error in getting user", error);
    return {
      error: "Error in getUser"
    }
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      // where: {
      //   accepted: false,
      // },
      orderBy: {
        accepted: "asc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching pending members:", error);
    return { error: "Could not retrieve pending members" };
  }
}

export async function getUsersByName(nameQuery) {
  // if (nameQuery === "") {
  //   return []
  // }
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

    return users;
  } catch (error) {
    console.error("Error fetching pending members:", error);
    return { error: "Could not retrieve pending members" };
  }
}