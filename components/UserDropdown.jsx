import { useEffect, useState } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { destroySession } from "@/app/lib/actions/auth";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ProfileImage from "./ProfileImage";

export default function UserDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, currentUser, setIsAuthenticated, setCurrentUser } =
    useAuth();

  const router = useRouter();

  const handleLogout = async () => {
    const { success, error } = await destroySession();
    if (success) {
      setIsAuthenticated(false);
      setCurrentUser({});
      setIsOpen(false);
      router.push("/login");
    } else {
      toast.error(error);
    }
  };


  const handleToggleMenu = () => {
    setIsOpen((currentState) => !currentState);
  };

  return (
    <div className="relative">
      <button onClick={handleToggleMenu} className="flex items-center">
        <ProfileImage user={user} />
        {user.firstName}
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg">
          <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center">
            <Link
              onClick={handleToggleMenu}
              href="/profile"
              className=" text-gray-800 hover:text-gray-600"
            >
              <FaUser className="inline mr-1" /> Uporabniški profil
            </Link>
          </li>

          <li
            onClick={handleLogout}
            className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center"
          >
            <FaSignOutAlt className="inline mr-1" /> Odjava
          </li>
        </ul>
      )}
    </div>
  );
}
