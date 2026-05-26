"use client";

import EditMemberForm from "@/components/admin/EditMemberForm";
import { getAllUsers } from "@/lib/actions/user";
import { experienceLevel } from "@/util";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { MembershipRequestStatus, User } from "@/app/generated/prisma";
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlinePencil, HiOutlineXCircle } from "react-icons/hi";

function StatusIndicator({ status }: { status: MembershipRequestStatus }) {
  switch (status) {
    case MembershipRequestStatus.ACCEPTED:
      return (
        <div className="flex items-center gap-2">
          <HiOutlineCheckCircle size={24} className="text-green-600/90" />
          <span className="text-green-600/90 font-medium">Sprejet</span>
        </div>
      );
    case MembershipRequestStatus.PENDING:
      return (
        <div className="flex items-center gap-2">
          <HiOutlineClock size={24} className="text-yellow-600/90" />
          <span className="text-yellow-600/90 font-medium">Čaka na sprejem</span>
        </div>
      );
    case MembershipRequestStatus.REJECTED:
      return (
        <div className="flex items-center gap-2">
          <HiOutlineXCircle size={24} className="text-red-600/90" />
          <span className="text-red-600/90 font-medium">Zavrnjen</span>
        </div>
      );
  }
}

export default function AdminPage() {
  const [members, setMembers] = useState<User[]>([]);
  const [editingMember, setEditingMember] = useState<User | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      const result = await getAllUsers();

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      setMembers(result.data);
    };

    fetchMembers();
  }, []);

  const openEditMember = (member: User) => {
    setEditingMember(member);
  };

  const closeEditMember = () => {
    setEditingMember(null);
  };

  const handleMemberSaved = (updatedMember: User, updateStatus: "UPDATED" | "REJECTED") => {
    setMembers((prev) =>
      updateStatus === "REJECTED"
        ? prev.filter((member) => member.id !== updatedMember.id)
        : prev.map((member) => (member.id === updatedMember.id ? updatedMember : member)),
    );
    setEditingMember(null);
    toast.success(updateStatus === "REJECTED" ? "Uporabnik je bil odstranjen" : "Uporabnik je bil posodobljen");
  };

  return (
    <>
      {editingMember && <EditMemberForm member={editingMember} onClose={closeEditMember} onSaved={handleMemberSaved} />}

      <div className="flex justify-between items-center pb-6 md:pb-8">
        <h2 className="text-xl md:text-2xl font-semibold">Upravljanje članov</h2>
      </div>
      <div className="w-full">
        {members.length > 0 ? (
          <div>
            <div className="rounded-md border border-gray-200 overflow-hidden">
              <table className="min-w-full text-gray-900 md:table">
                <thead className="rounded-md text-left text-sm font-normal">
                  <tr className="bg-gray-100">
                    <th scope="col" className="px-4 py-5 font-medium">
                      Ime in priimek
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Izkušenost
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Status potrditve
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {members.map((member) => (
                    <tr key={member.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        {member.firstName} {member.lastName}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">{member.email}</td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {member.experienceLevel ? experienceLevel[member.experienceLevel]?.name : "-"}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <StatusIndicator status={member.status} />
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditMember(member)}
                            className="rounded p-2 text-gray-700 hover:bg-gray-100"
                            aria-label={`Uredi ${member.firstName} ${member.lastName}`}
                            title="Uredi"
                          >
                            <HiOutlinePencil size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>Ni najdenih članov</p>
        )}
      </div>
    </>
  );
}
