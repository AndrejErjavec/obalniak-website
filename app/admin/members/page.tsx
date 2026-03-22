"use client";

import Button from "@/components/ui/Button";
import { getAllUsers, updateMember, updateMembersBulk } from "@/lib/actions/user";
import { experienceLevel } from "@/util";
import { ChangeEvent, useEffect, useState } from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";

import { User } from "@/app/generated/prisma";

type UserWithChanaged = User & { changed?: boolean };

export default function AdminPage() {
  const [members, setMembers] = useState<UserWithChanaged[]>([]);

  const hasChanges = members.some((member) => member.changed);

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

  const updateExperienceLevel = (e: ChangeEvent, id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, experienceLevel: e.target.value, changed: true } : m)));
  };

  const handleAcceptMember = async (id: string, experienceLevel: string | null) => {
    const result = await updateMember(id, experienceLevel);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    const { data: updatedMember } = result;

    setMembers((prev) => prev.map((member) => (member.id === updatedMember.id ? updatedMember : member)));
  };

  const handleSaveChanges = async () => {
    const memebersToUpdate = members.filter((member) => member.changed !== null && member.changed == true);

    const result = await updateMembersBulk(memebersToUpdate);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    const { updated, failed } = result.data;

    if (failed.length > 0) {
      toast.error(`Failed to update ${failed.length} member(s).`);
    }

    setMembers((prev) =>
      prev.map((member) => {
        const updatedMember = updated.find((updatedItem) => updatedItem.id === member.id);

        if (!updatedMember) {
          return member;
        }

        return {
          ...updatedMember,
          changed: false,
        };
      }),
    );
  };

  return (
    <>
      <div className="flex justify-between items-center pb-6 md:pb-8">
        <h2 className="text-xl md:text-2xl font-semibold">Upravljanje članov</h2>
        <Button onClick={handleSaveChanges} disabled={!hasChanges}>
          Shrani
        </Button>
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
                      Potrjen član
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Status potrditve
                    </th>
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
                        <select
                          onChange={(e) => updateExperienceLevel(e, member.id)}
                          value={member.experienceLevel}
                          className="cursor-pointer"
                        >
                          {!member.experienceLevel && (
                            <option disabled selected value>
                              izberite izkušenost
                            </option>
                          )}
                          {Object.entries(experienceLevel).map(([key, level]) => (
                            <option value={key} key={key}>
                              {level.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {member.accepted ? (
                          <FaCheckCircle className="text-xl text-green-500" />
                        ) : (
                          <div className="flex gap-3 items-center">
                            <FaClock className="text-xl text-yellow-400" />
                            <button
                              className="underline cursor-pointer"
                              onClick={() => handleAcceptMember(member.id, member.experienceLevel)}
                            >
                              Potrdi
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex my-7">
              <div className="flex flex-col gap-3">
                <div className="flex items-center">
                  <FaCheckCircle className="text-xl text-green-500 mr-2" /> sprejet član
                </div>
                <div className="flex items-center">
                  <FaClock className="text-xl text-yellow-400 mr-2" /> čaka na sprejem
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Ni najdenih članov</p>
        )}
      </div>
    </>
  );
}
