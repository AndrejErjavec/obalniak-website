import Image from "next/image";
import { FiCameraOff } from "react-icons/fi";
import ProfileBanner from "@/components/profile/ProfileBanner";
import {formatDate} from "@/util";
import { MdCalendarMonth,MdAltRoute } from "react-icons/md";
import Link from "next/link";

export default function AscentItem({ascent}) {
  return (
    <Link href={`/ascent/${ascent.id}`}>
      <div className="flex flex-row border rounded h-32 cursor-pointer">
          {ascent.photos?.length > 0 ? (
            <Image
              src={ascent.photos[0].url}
              alt={"image"}
              width={176}
              height={128}
              className="rounded-l object-cover h-full w-32 md:w-44"
            />
          ) : (
            <div className="flex justify-center items-center bg-gray-200 rounded-l w-32 md:w-44">
              <FiCameraOff size={24}/>
            </div>
          )}

          <div className="flex flex-row flex-1 justify-between items-center px-5">
            <div className="flex flex-col gap-3 md:gap-5">
              {/* Header row */}
              <div className="flex flex-col md:flex-row gap-1 md:gap-10">
                <p className=" text-xl font-medium">{ascent.title}</p>
                <ProfileBanner firstName={ascent.author.firstName} lastName={ascent.author.lastName} iconSize={25}/>
              </div>
              {/* Details row */}
              <div className="flex flex-col md:flex-row md:gap-5">
                <div className="flex gap-1 items-center">
                  <MdCalendarMonth size={18}/>
                  <p>{formatDate(ascent.date)}</p>
                </div>
                <div className="flex gap-1 items-center">
                  <MdAltRoute size={18}/>
                  <p>{ascent.route} ({ascent.difficulty})</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </Link>
  )
}