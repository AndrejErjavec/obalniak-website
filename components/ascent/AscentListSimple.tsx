import Link from "next/link";
import { formatDate } from "@/util";
import Badge from "../Badge";
import AscentParticipantsList from "./AscentParticipantsList";

function AscentListSimple({ ascents }) {
  return (
    <div className=" flex flex-col divide-y divide-gray-300">
      {ascents.map((ascent) => {
        const participants = [
          `${ascent.author.firstName} ${ascent.author.lastName}`,
          ...ascent.registeredParticipants.map((p) => `${p.firstName} ${p.lastName}`),
          ...ascent.unregisteredParticipants.map((p) => `${p.name}`),
        ];
        return (
          <Link
            href={`/ascent/${ascent.id}`}
            className="flex flex-col gap-5 px-2 py-3 hover:bg-gray-100 rounded-md"
            key={ascent.id}
          >
            {/* title & date */}
            <div className="flex flex-row justify-between gap-2 items-center">
              <p className="font-medium text-lg md:text-base">
                {ascent.route} ({ascent.difficulty})
              </p>
              <Badge content={formatDate(ascent.date)} bgColor="#f9f9f9" textClassName="text-gray-900" textSize="xs" />
            </div>
            <AscentParticipantsList names={participants} limit={2} />
            {/* <div className="flex flex-row items-center gap-2">
              <ProfileBanner
                name={`${ascent.author.firstName} ${ascent.author.lastName}`}
                iconSize={25}
                textSize={14}
              />
              {otherParticipants > 0 && (
                <div className="flex items-center justify-center bg-gray-100/30 border border-gray-200 text-xs rounded-md px-1.5 py-0.5">
                  <span>+{otherParticipants}</span>
                </div>
              )}
            </div> */}
          </Link>
        );
      })}
    </div>
  );
}

export default AscentListSimple;
