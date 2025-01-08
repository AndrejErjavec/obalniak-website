import Link from "next/link";
import ProfileBanner from "@/components/profile/ProfileBanner";
import {formatDate} from "@/util";

export default function AscentItemSimple({ ascent }) {
  return (
    <Link
      href={`/ascent/${ascent.id}`}
      className="flex flex-col gap-2 px-2 py-3"
      key={ascent.id}
    >
      <p className="font-medium text-lg md:text-base">{ascent.title}</p>
      <div className="flex flex-row gap-5 items-center">
        <p className="text-sm">{formatDate(ascent.date)}</p>
        <ProfileBanner firstName={ascent.author.firstName} lastName={ascent.author.lastName} iconSize={24} textSize={14} />
      </div>
    </Link>
  )
}