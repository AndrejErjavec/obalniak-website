"use client";

import { useAuth } from "@/context/authContext";

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

  return <div>Admin page</div>;
}
