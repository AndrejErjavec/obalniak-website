import {useEffect, useState} from "react";
import {acceptMember, getAllUsers} from "@/app/lib/actions/user";
import {toast} from "react-toastify";
import {experienceLevel} from "@/util";
import {FaCheckCircle, FaClock, FaSave} from "react-icons/fa";

export default function MembersTable() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const result = await getAllUsers();
        if (result.error) {
          toast.error(result.error);
        } else {
          setMembers(result);
        }
      } catch (err) {
        toast.error("Failed to fetch pending members.");
        console.error(err);
      }
    };

    fetchMembers();
  }, []);

  const updateExperienceLevel = (e, id) => {
    setMembers((prev) =>
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
    setMembers((pendingMembers) =>
      pendingMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  return (
    <div className="w-full">
      {members.length > 0 ? (
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
            {members.map((member) => (
              <tr key={member.id} className="group">
                <td
                  className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
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
                    {Object.entries(experienceLevel).map(([key, level]) => (
                      <option value={key}>{level.name}</option>
                    ))}
                  </select>
                </td>
                <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                  {member.accepted ? (
                    <FaCheckCircle className="text-xl text-green-500"/>
                  ) : (
                    <FaClock className="text-xl text-yellow-400"/>
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
                <FaCheckCircle className="text-xl text-green-500 mr-2"/>{" "}
                sprejet član
              </div>
              <div className="flex items-center">
                <FaClock className="text-xl text-yellow-400 mr-2"/> čaka na
                sprejem
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Ni najdenih članov</p>
      )}
    </div>
  )
}