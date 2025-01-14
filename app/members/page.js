import {getUsers} from "@/app/lib/actions/user";
import ProfileCard from "@/components/profile/ProfileCard";

export default async function Members() {
  const members = await getUsers();

  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold mt-8 mb-5">Člani</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-3">
        {members.map(member => (
          <ProfileCard user={member} key={member.id} />
        ))}
      </div>
    </div>
  )
}