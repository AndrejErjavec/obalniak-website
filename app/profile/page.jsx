"use client";

import { useRouter, redirect } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function Profile() {
  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
    useAuth();

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <div className="container mx-auto h-screen">
      <div className="shadow-lg rounded-lg p-6 w-full max-w-sm mt-10">
        {isAuthenticated && (
          <h3 className="text-xl font-semibold">{currentUser.name}</h3>
        )}
        <p>{currentUser.email}</p>
      </div>
    </div>
  );
}
