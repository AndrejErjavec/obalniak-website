import Link from "next/link";
import { formatDate } from "@/util";
import Badge from "../Badge";
import AscentParticipantsList from "./AscentParticipantsList";

function AscentListSimple({ ascents }) {
  return (
    <div className=" flex flex-col rounded-lg shadow-sm divide-y divide-gray-300 border border-gray-200">
      {ascents.map((ascent) => {
        const participants = [
          `${ascent.author.firstName} ${ascent.author.lastName}`,
          ...ascent.registeredParticipants.map((p) => `${p.firstName} ${p.lastName}`),
          ...ascent.unregisteredParticipants.map((p) => `${p.name}`),
        ];

        return (
          <Link
            href={`/ascent/${ascent.id}`}
            className="flex flex-col gap-3 px-3 py-3 hover:bg-gray-100"
            key={ascent.id}
          >
            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between gap-2 min-w-0">
              <p className="font-medium truncate min-w-0 max-w-full">
                {ascent.route} ({ascent.difficulty})
              </p>

              <span className="text-sm lg:text-xs text-gray-600 shrink-0">{formatDate(ascent.date)}</span>
            </div>

            <AscentParticipantsList names={participants} limit={2} />
          </Link>
        );
      })}
    </div>
  );
}

export default AscentListSimple;
