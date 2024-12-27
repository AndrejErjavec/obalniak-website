import { useEffect, useState } from "react";
import {FaUser, FaSignOutAlt, FaUserShield} from "react-icons/fa";
import { destroySession } from "@/app/lib/actions/auth";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ProfileImage from "./ProfileImage";

export default function UserDropdown({ user, setIsOpen, handleLogout }) {
  const { isAuthenticated, currentUser, setIsAuthenticated, setCurrentUser } =
    useAuth();

  return (
    <div className="relative">
      <ul className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg">
          {user.isAdmin && (
            <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center">
              <Link
                href="/admin"
                className="text-gray-800 hover:text-gray-600"
                onClick={() => setIsOpen(false)}
              >
                <FaUserShield className="inline mr-1" size={20}/> Pogled skrbnika
              </Link>
            </li>
          )}

            <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center">
          <Link
            href="/profile"
            className=" text-gray-800 hover:text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <FaUser className="inline mr-1" /> Uporabniški profil
          </Link>
        </li>

        <li
          className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="inline mr-1" /> Odjava
        </li>
      </ul>
    </div>
  );
}
