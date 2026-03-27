"use client";

import Image from "next/image";
import { formatDate } from "@/util";
import { MdCalendarMonth } from "react-icons/md";
import { FiCameraOff } from "react-icons/fi";
import Badge from "../Badge";
import { useRouter } from "next/navigation";
import AscentParticipantsList from "./AscentParticipantsList";

function AscentsTable({ ascents }) {
  const router = useRouter();

  return (
    <>
      <div className="rounded-md border border-gray-200">
        <table className="table-auto min-w-full text-gray-900 md:table">
          <tbody className="divide-y divide-gray-200 text-gray-900">
            {ascents.map((ascent) => {
              const participants = [
                `${ascent.author.firstName} ${ascent.author.lastName}`,
                ...ascent.registeredParticipants.map((p) => `${p.firstName} ${p.lastName}`),
                ...ascent.unregisteredParticipants.map((p) => `${p.name}`),
              ];

              return (
                <tr
                  key={ascent.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/ascent/${ascent.id}`)}
                  className="cursor-pointer hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <td className="w-32 h-24 p-2">
                    {ascent.photos?.length > 0 ? (
                      <Image
                        src={ascent.photos[0].url}
                        alt={"image"}
                        width={100}
                        height={100}
                        className="block object-cover h-full w-full rounded-md"
                      />
                    ) : (
                      <div className="flex justify-center items-center bg-gray-200 h-full w-full rounded-md">
                        <FiCameraOff size={24} />
                      </div>
                    )}
                  </td>
                  <td className="py-5 pl-3 md:pl-6 align-center">
                    <div className="flex flex-col gap-3 align-top">
                      <div className="flex gap-3 items-center">
                        <p className="font-semibold">
                          {ascent.route} ({ascent.difficulty})
                        </p>
                        <p className="font-base text-sm">{ascent.routeLength} m</p>
                      </div>

                      {/* mobile ascent details */}
                      <div className="md:hidden flex flex-col gap-3">
                        <AscentParticipantsList names={participants} limit={1} />
                        <Badge
                          content={formatDate(ascent.date)}
                          icon={MdCalendarMonth}
                          iconColor="#fff"
                          iconBgColor="#117ec6"
                          textClassName="text-gray-800 font-medium"
                        />
                      </div>
                    </div>
                  </td>
                  {/* desktop ascent details */}
                  <td className="hidden md:table-cell py-5">
                    <AscentParticipantsList names={participants} limit={3} />
                  </td>
                  <td className="hidden md:table-cell py-5">
                    <Badge
                      content={formatDate(ascent.date)}
                      icon={MdCalendarMonth}
                      iconColor="#fff"
                      iconBgColor="#117ec6"
                      textClassName="text-gray-800 font-medium"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AscentsTable;
