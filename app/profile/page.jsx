"use client";

import { useRouter, redirect } from "next/navigation";
import { useAuth } from "@/context/authContext";
import ProfileImage from "@/components/ProfileImage";
import { FaExclamationCircle } from "react-icons/fa";
import ExperienceLevelTicket from "@/components/ExperienceLevelTicket";
import {useEffect} from "react";

export default function Profile() {
  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
    useAuth();

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <div className="container mx-auto h-screen">
      {!currentUser.accepted ? (
        <div className="flex flex-row items-center gap-1">
          <FaExclamationCircle className="text-orange-600 text-xl" />
          <p className="text-orange-600 font-medium my-5">
            Vaš uporabniški profil še ni potrjen s strani administratorja.
          </p>
        </div>
      ) : (
        <></>
      )}
      <div className="shadow-lg rounded-lg flex items-center p-6 w-full max-w-sm gap-3">
        <ProfileImage user={currentUser} size={60} />
        <div className="flex flex-col gap-1 items-start">
          <p className="text-xl font-semibold">
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className="text-xl font-semibold">{currentUser.name}</p>
          <p>{currentUser.email}</p>

          {currentUser.experienceLevel ? (
            <ExperienceLevelTicket level={currentUser.experienceLevel} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
