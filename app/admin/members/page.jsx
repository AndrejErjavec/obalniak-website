"use client";
import MembersTable from "@/components/MembersTable";

export default function AdminPage() {
  return (
    <>
      <h2 className="text-xl md:text-2xl font-semibold pb-6 md:pb-8">Upravljanje članov</h2>
      <MembersTable />
    </>
  );
}
