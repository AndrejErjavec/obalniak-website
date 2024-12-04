"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import getPendingMembers from "@/app/lib/actions/getPendingMembers";
import acceptMember from "../lib/actions/acceptMember";
import { FaCheckCircle, FaClock, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { ExperienceLevel } from "@prisma/client";

export default function AdminPage() {
  const [pendingMembers, setPendingMembers] = useState([]);

  useEffect(() => {
    // Fetch pending members on component load
    const fetchPendingMembers = async () => {
      try {
        const members = await getPendingMembers();
        if (members.error) {
          toast.error(members.error);
        } else {
          setPendingMembers(members);
        }
      } catch (err) {
        toast.error("Failed to fetch pending members.");
        console.error(err);
      }
    };

    fetchPendingMembers();
  }, []);

  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
    useAuth();

  const updateExperienceLevel = (e, id) => {
    setPendingMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, experienceLevel: e.target.value, changed: true }
          : m
      )
    );
  };

  const handleAcceptMember = async (id, experienceLevel) => {
    const updatedMember = await acceptMember(id, experienceLevel);
    if (updatedMember.error) {
      toast.error(updatedMember.error);
      return;
    }
    setPendingMembers((pendingMembers) =>
      pendingMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl">Nimate dostopa do te strani</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-semibold my-5">Člani</h2>
      <div className="w-full">
        {pendingMembers.length > 0 ? (
          <div>
            <table className="min-w-full rounded-md text-gray-900 md:table">
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
                {pendingMembers.map((member) => (
                  <tr key={member.id} className="group">
                    <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                      {member.firstName} {member.lastName}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {member.email}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      <select
                        onChange={(e) => updateExperienceLevel(e, member.id)}
                        value={member.experienceLevel}
                      >
                        {!member.experienceLevel && (
                          <option disabled selected value>
                            izberite izkušenost
                          </option>
                        )}
                        <option value={ExperienceLevel.BEGINNER}>
                          Začetnik
                        </option>
                        <option value={ExperienceLevel.INTERMEDIATE}>
                          Srednje izkušen
                        </option>
                        <option value={ExperienceLevel.ADVANCED}>
                          Zelo izkušen
                        </option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {member.accepted ? (
                        <FaCheckCircle className="text-xl text-green-500" />
                      ) : (
                        <FaClock className="text-xl text-yellow-400" />
                      )}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {!member.accepted ? (
                        <button
                          className="btn px-2 py-1 bg-blue-500 rounded-lg text-white"
                          onClick={() =>
                            handleAcceptMember(
                              member.id,
                              member.experienceLevel
                            )
                          }
                        >
                          Potrdi
                        </button>
                      ) : member.changed ? (
                        <FaSave
                          className="text-xl text-blue-500 cursor-pointer"
                          onClick={() =>
                            handleAcceptMember(
                              member.id,
                              member.experienceLevel
                            )
                          }
                        />
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex my-7">
              <div className="flex flex-col gap-3">
                <div className="flex items-center">
                  <FaCheckCircle className="text-xl text-green-500 mr-2" />{" "}
                  sprejet član
                </div>
                <div className="flex items-center">
                  <FaClock className="text-xl text-yellow-400 mr-2" /> čaka na
                  sprejem
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No members found.</p>
        )}
      </div>
    </div>
  );
}
