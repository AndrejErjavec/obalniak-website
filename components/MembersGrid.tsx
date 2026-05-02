import { User } from "@/app/generated/prisma";
import ProfileBanner from "./profile/ProfileBanner";
import ExperienceLevelTicket from "./ExperienceLevelTicket";

export default async function MembersGrid({ members }: { members: User[] }) {
  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold my-8">Člani</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {members.map((member) => (
          <div
            className="flex flex-col gap-3 items-start p-3 rounded-lg shadow-xs border border-gray-200"
            key={member.id}
          >
            <ProfileBanner name={`${member.firstName} ${member.lastName}`} isLink={false} iconSize={40} textSize={18} />
            {member.experienceLevel && <ExperienceLevelTicket level={member.experienceLevel} />}
          </div>
        ))}
      </div>
    </div>
  );
}
