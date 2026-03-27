"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { MdCampaign, MdGroups } from "react-icons/md";
import type { IconType } from "react-icons";
import type { ReactNode } from "react";

function SidebarLink({
  href,
  label,
  // description,
  icon: Icon,
}: {
  href: string;
  label: string;
  // description: string;
  icon: IconType;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg border px-3 py-3 transition ${
        isActive
          ? "border-primary bg-primary text-white shadow-sm"
          : "border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-50"
      }`}
    >
      <Icon size={20} />
      <span className="flex min-w-0 flex-col">
        <span className="font-medium leading-5">{label}</span>
        {/* <span className={`text-sm ${isActive ? "text-blue-100" : "text-gray-500"}`}>{description}</span> */}
      </span>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
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
      <div className="flex flex-col gap-4 md:grid md:grid-cols-[280px_minmax(0,1fr)] md:gap-4">
        <aside className="md:sticky">
          <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-4">
              <h2 className="mt-1 text-lg font-semibold text-gray-900">Nadzorna plošča</h2>
            </div>
            <nav className="flex flex-col gap-2 p-3">
              <SidebarLink
                href="/admin/members"
                label="Upravljanje članov"
                // description="Potrjevanje in pregled članov"
                icon={MdGroups}
              />
              <SidebarLink
                href="/admin/news"
                label="Objava novic"
                // description="Ustvari ali uredi obvestila"
                icon={MdCampaign}
              />
            </nav>
          </div>
        </aside>

        <main className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">{children}</main>
      </div>
    </div>
  );
}
