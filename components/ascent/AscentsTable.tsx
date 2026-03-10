import Image from "next/image";
import { formatDate } from "@/util";
import ProfileBanner from "../profile/ProfileBanner";
import { MdAltRoute, MdCalendarMonth } from "react-icons/md";
import { FiCameraOff } from "react-icons/fi";
import Badge from "../Badge";

function AscentsTable({ ascents }) {
  return (
    <>
      <div className="rounded-md border border-gray-200">
        <table className="table-auto min-w-full text-gray-900 md:table">
          <tbody className="divide-y divide-gray-200 text-gray-900">
            {ascents.map((ascent) => (
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
                  <div className="flex flex-col gap-2 align-top">
                    <p className="font-semibold">{ascent.title}</p>
                    {/* mobile ascent details */}
                    <div className="flex flex-col gap-2 text-sm md:hidden">
                      <ProfileBanner
                        firstName={ascent.author.firstName}
                        lastName={ascent.author.lastName}
                        iconSize={22}
                      />
                      <div className="flex flex-row gap-4 md:hidden">
                        <Badge
                          content={formatDate(ascent.date)}
                          icon={MdCalendarMonth}
                          iconColor="#fff"
                          iconBgColor="#117ec6"
                          textClassName="text-gray-900 font-semibold"
                        />
                        <Badge
                          content={`${ascent.route} (${ascent.difficulty})`}
                          icon={MdAltRoute}
                          iconColor="#fff"
                          iconBgColor="#e29212"
                          textClassName="text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                {/* desktop ascent details */}
                <td className="hidden md:table-cell py-5">
                  <ProfileBanner firstName={ascent.author.firstName} lastName={ascent.author.lastName} iconSize={25} />
                </td>
                <td className="hidden md:table-cell py-5">
                  <Badge
                    content={formatDate(ascent.date)}
                    icon={MdCalendarMonth}
                    iconColor="#fff"
                    iconBgColor="#117ec6"
                    textClassName="text-gray-900 font-semibold"
                  />
                </td>
                <td className="hidden md:table-cell py-5">
                  <Badge
                    content={`${ascent.route} (${ascent.difficulty})`}
                    icon={MdAltRoute}
                    iconColor="#fff"
                    iconBgColor="#e29212"
                    textClassName="text-gray-900 font-semibold"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AscentsTable;
