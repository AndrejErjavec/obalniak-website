"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserShield,
  FaBars
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useAuth } from "@/context/authContext";
import UserDropdown from "./UserDropdown";
import {useEffect, useState} from "react";
import ProfileImage from "@/components/profile/ProfileImage";
import {destroySession} from "@/app/lib/actions/auth";
import {toast} from "react-toastify";
import ProfileBanner from "@/components/profile/ProfileBanner";
import DropdownMenu from "@/components/DropdownMenu";


const Header = () => {
  const links = [
    {
      title: "Naši vzponi",
      href: "/ascent",
    },
    {
      title: "Novice",
      dropdown: true,
      items: [
        {
          title: "Dogodki",
          href: "/news/events",
        },
        {
          title: "Alpinistična šola",
          href: "/news/alpine-school",
        }
      ]
    },
    {
      title: "O nas",
      href: "/about",
    },
    {
      title: "Člani",
      href: "/members",
    },
    {
      title: "Pravila",
      href: "/rules"
    }
  ]

  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const router = useRouter();

  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
    useAuth();

  const handleToggleMenu = () => {
    setMenuOpen((currentState) => !currentState);
  };

  const handleToggleUserDropdown = () => {
    setUserDropdownOpen((currentState) => !currentState);
  }

  const handleLogout = async () => {
    const { success, error } = await destroySession();
    if (success) {
      setIsAuthenticated(false);
      setCurrentUser({});
      setUserDropdownOpen(false);
      setMenuOpen(false);
      router.push("/login");
    } else {
      toast.error(error);
    }
  };

  return (
    <header className="bg-white">
      <nav className=" hidden md:block mx-auto container sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex flex-row items-center gap-2 text-2xl font-bold"
            >
              <Image
                className="h-12 w-12"
                src="/oak-logo.png"
                width={191}
                height={183}
                alt="oak-logo"
                priority={true}
              />
              <h1>Obalni alpinistični klub</h1>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">{}</div>
            </div>
          </div>
          {/* <!-- Right Side Menu --> */}
          <div className="">
            <div className="ml-4 flex items-center gap-4 md:ml-6">
              {links.map((link) =>
                link.dropdown ? (
                  <DropdownMenu title={link.title} items={link.items} key={link.title} setParentOpen={setMenuOpen} />
                ) : (
                  <Link
                    href={link.href}
                    className="font-medium text-gray-800 hover:text-gray-600"
                    key={link.href}
                  >
                    {link.title}
                  </Link>
                )
              )}

              {/* <!-- Logged Out Only --> */}
              {!isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    className="text-gray-800 hover:text-gray-600 ml-3"
                  >
                    <FaSignInAlt className="inline mr-1"/> Prijava
                  </Link>
                </>
              )}

              {isAuthenticated && currentUser && (
                <button onClick={handleToggleUserDropdown} className="flex items-center gap-2 ml-3">
                  <ProfileImage firstName={currentUser.firstName} lastName={currentUser.lastName} />
                  {currentUser.firstName} {currentUser.lastName}
                </button>
              )}
            </div>
          </div>
        </div>
        {userDropdownOpen && (
          <UserDropdown
            user={currentUser}
            setIsOpen={setUserDropdownOpen}
            handleLogout={handleLogout}
          />
        )}
      </nav>

      {/* <!-- Mobile header --> */}
      <nav className="md:hidden mx-auto px-5">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex flex-row items-center gap-2 text-2xl font-bold"
            >
              <Image
                className="h-12 w-12"
                src="/oak-logo.png"
                width={191}
                height={183}
                alt="oak-logo"
                priority={true}
              />
              <h1 className="text-xl">Obalni alpinistični klub</h1>
            </Link>
          </div>
          <div onClick={handleToggleMenu}>
            {menuOpen ? <FaXmark size={24} /> : <FaBars size={24} />}
          </div>
        </div>
        {/* Hamburger Menu */}
        {menuOpen && (
          <div className="fixed absolute left-0 top-15 bg-white w-full border-10 border-gray-300 border-t shadow-md">
            <div className="ml-auto">
              <div className="flex flex-col">
                {links.map((link) =>
                  link.dropdown ? (
                    <DropdownMenu title={link.title} items={link.items} key={link.title} setParentOpen={setMenuOpen} />
                  ) : (
                    <Link
                      href={link.href}
                      className="py-3 px-4 font-medium text-gray-800 hover:text-gray-600"
                      key={link.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  )
                )}
                {/* <!-- Logged Out Only --> */}
                {!isAuthenticated && (
                  <div className="py-3 px-4 border-t border-gray-300">
                    <Link
                      href="/login"
                      className="text-gray-800 hover:text-gray-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaSignInAlt className="inline mr-1"/> Prijava
                    </Link>
                  </div>
                )}

                {isAuthenticated && currentUser?.isAdmin && (
                  <div className="py-5 px-4 border-t border-gray-300">
                    <Link
                      href="/admin"
                      className="text-gray-800 hover:text-gray-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaUserShield className="inline mr-1" size={20}/> Pogled skrbnika
                    </Link>
                  </div>
                )}

                {isAuthenticated && currentUser && (
                  <div className="flex flex-row items-center justify-between py-5 px-4 border-10 border-gray-300 border-t">
                    <div className="flex flex-row items-center">
                      <Link
                        href={`/profile/${currentUser.id}`}
                        className="flex flex-row gap-2 items-center text-gray-800 hover:text-gray-600"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ProfileBanner firstName={currentUser.firstName} lastName={currentUser.lastName} />
                      </Link>

                    </div>
                    <FaSignOutAlt
                      size={18}
                      onClick={handleLogout}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
