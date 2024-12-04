"use client";

import { useRouter, redirect } from "next/navigation";
import { useAuth } from "@/context/authContext";
import ProfileImage from "@/components/ProfileImage";

export default function Profile() {
  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
    useAuth();

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <div className="container mx-auto h-screen">
      <div className="shadow-lg rounded-lg flex items-center p-6 w-full max-w-sm mt-10">
        <ProfileImage user={currentUser} size={60} />
        <div className="flex flex-col">
          <p className="text-xl font-semibold">
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className="text-xl font-semibold">{currentUser.name}</p>
          <p>{currentUser.email}</p>
        </div>
      </div>
    </div>
  );
}
