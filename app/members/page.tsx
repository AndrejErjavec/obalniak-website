import { getUsers } from "@/lib/actions/user";
import ProfileBanner from "@/components/profile/ProfileBanner";
import ExperienceLevelTicket from "@/components/ExperienceLevelTicket";

export default async function Members() {
  const result = await getUsers();

  if ("error" in result) {
    return <div>result.error</div>;
  }

  const members = result.data;

  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold my-8">Člani</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {members.map((member) => (
          <div
            className="flex flex-col gap-3 items-start p-3 rounded-lg shadow-xs border border-gray-200"
            key={member.id}
          >
            <ProfileBanner
              firstName={member.firstName}
              lastName={member.lastName}
              isLink={false}
              iconSize={40}
              textSize={18}
            />
            {member.experienceLevel && <ExperienceLevelTicket level={member.experienceLevel} />}
          </div>
        ))}
      </div>
    </div>
  );
}
