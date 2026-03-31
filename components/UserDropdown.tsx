import { useEffect, useRef } from "react";
import { FaUser, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import Link from "next/link";
import Modal from "@/components/Modal";

export default function UserDropdown({ user, setIsOpen, handleLogout }) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (dropdownRef.current && target && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div ref={dropdownRef}>
      <Modal open={true} className="left-auto right-0 w-52 border border-gray-200">
        <ul>
          {user.isAdmin && (
            <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center">
              <Link href="/admin" className="text-gray-800 hover:text-gray-600" onClick={() => setIsOpen(false)}>
                <FaUserShield className="inline mr-1" size={20} /> Pogled skrbnika
              </Link>
            </li>
          )}

          <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center">
            <Link
              href={`/profile/${user.id}`}
              className="text-gray-800 hover:text-gray-600"
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
      </Modal>
    </div>
  );
}
