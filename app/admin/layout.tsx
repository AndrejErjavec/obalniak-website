"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";

function SidebarLink({ href, label }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 font-medium transition ${
        isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminLayout({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser?.isAdmin) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl">Nimate dostopa do te strani</p>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 mx-auto md:container">
      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full md:w-64">
          <nav className="h-full flex flex-col gap-2 border-b md:border-r border-gray-200 p-3">
            <SidebarLink href="/admin/members" label="Upravljanje članov" />
            <SidebarLink href="/admin/event" label="Objava novic" />
          </nav>
        </aside>

        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
