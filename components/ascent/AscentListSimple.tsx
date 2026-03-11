import Link from "next/link";
import ProfileBanner from "../profile/ProfileBanner";
import { formatDate } from "@/util";
import Badge from "../Badge";

function AscentListSimple({ ascents }) {
  return (
    <div className=" flex flex-col divide-y divide-gray-300">
      {ascents.map((ascent) => (
        <Link href={`/ascent/${ascent.id}`} className="flex flex-col gap-3 px-2 py-3 hover:bg-gray-100" key={ascent.id}>
          {/* title & date */}
          <div className="flex flex-row justify-between gap-2 items-center">
            <p className="font-medium text-lg md:text-base">{ascent.title}</p>
            <Badge content={formatDate(ascent.date)} bgColor="#f9f9f9" textClassName="text-gray-900" />
          </div>
          <ProfileBanner
            firstName={ascent.author.firstName}
            lastName={ascent.author.lastName}
            iconSize={24}
            textSize={14}
          />
        </Link>
      ))}
    </div>
  );
}

export default AscentListSimple;
