"use client";
import { useAuth } from "@/context/authContext";
import MembersTable from "@/components/MembersTable";
import Link from "next/link";

export default function AdminPage() {


  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
    useAuth();

  if (!currentUser?.isAdmin) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl">Nimate dostopa do te strani</p>
      </div>
    );
  }

  return (
    <div className="px-5 mx-auto md:container">
      <h2 className="text-xl font-semibold py-5">Upravljanje članov</h2>
      <MembersTable/>
      <h2 className="text-xl font-semibold py-5">Objava novic</h2>
      <Link
        href="/admin/event/create"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Nov dogodek
      </Link>
    </div>
  );
}
