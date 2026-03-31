"use client";

import Image from "next/image";
import { formatDate } from "@/util";
import { MdCalendarMonth } from "react-icons/md";
import { FiCameraOff } from "react-icons/fi";
import Badge from "../Badge";
import AscentParticipantsList from "./AscentParticipantsList";
import Button from "../ui/Button";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import Link from "next/link";
import { UnregisteredParticipation, User } from "@/app/generated/prisma";
import { AscentWithData, deleteAscent } from "@/lib/actions/ascent";
import { toast } from "react-toastify";
import { useState } from "react";
import Divider from "../ui/Divider";

function AscentsTable({
  ascents,
  totalAscents,
  withHeader,
}: {
  ascents: AscentWithData[];
  totalAscents?: number;
  withHeader: boolean;
}) {
  const [editMode, setEditMode] = useState(false);
  const toggleEditMode = () => {
    setEditMode((curr) => !curr);
  };

  const handleDeleteAscent = async (id: string) => {
    const result = await deleteAscent(id);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Objava izbrisana");
  };

  return (
    <>
      {withHeader && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-row gap-3 items-center py-5">
              <h3 className="text-xl font-semibold">Vzponi</h3>
              <div className="flex w-8 h-8 rounded-full bg-slate-500 text-white justify-center items-center">
                <p className="text-sm font-medium">{totalAscents}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="flex gap-3 items-center">
                <Link href="/ascent/create">
                  <Button>Novo poročilo</Button>
                </Link>
                <Button className="my-3" onClick={toggleEditMode} variant={editMode === false ? "primary" : "danger"}>
                  <span>{editMode === false ? "Uredi" : "Prekliči urejanje"}</span>
                </Button>
              </div>
            </div>
          </div>
          <Divider />
        </>
      )}

      <div className="rounded-md border border-gray-200">
        <table className="table-auto min-w-full text-gray-900 md:table">
          <tbody className="divide-y divide-gray-200 text-gray-900">
            {ascents.map((ascent) => {
              const participants = [
                `${ascent.author.firstName} ${ascent.author.lastName}`,
                ...ascent.registeredParticipants.map((p: User) => `${p.firstName} ${p.lastName}`),
                ...ascent.unregisteredParticipants.map((p: UnregisteredParticipation) => `${p.name}`),
              ];

              return (
                <tr key={ascent.id}>
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
                        <Link className="font-semibold cursor-pointer hover:underline" href={`/ascent/${ascent.id}`}>
                          {ascent.route} ({ascent.difficulty})
                        </Link>
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
                  {editMode && (
                    <td>
                      <div className="flex gap-4">
                        <Link
                          href={`/ascent/${ascent.id}/edit/`}
                          type="button"
                          className="inline-flex rounded-full bg-white/90 p-1.5 border border-gray-200 hover:bg-white cursor-pointer"
                          aria-label="uredi"
                        >
                          <HiOutlinePencilAlt size={20} />
                        </Link>
                        <button
                          type="button"
                          className="inline-flex rounded-full bg-white/90 p-1.5 border border-gray-200 hover:bg-white cursor-pointer"
                        >
                          <HiOutlineTrash size={20} color={"red"} onClick={() => handleDeleteAscent(ascent.id)} />
                        </button>
                      </div>
                    </td>
                  )}
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
