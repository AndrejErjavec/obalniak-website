import ProfileImage from "@/components/profile/ProfileImage";
import ExperienceLevelTicket from "@/components/ExperienceLevelTicket";
import Link from "next/link";

export default function ProfileCard({user}) {
  return (
    <Link href={`/profile/${user.id}`}>
      <div className="flex items-center gap-3">
        <ProfileImage firstName={user.firstName} lastName={user.lastName} size={60}/>
        <div className="flex flex-col gap-1 items-start">
          <p className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xl font-semibold">{user.name}</p>
          <p>{user.email}</p>

          {user.experienceLevel ? (
            <ExperienceLevelTicket level={user.experienceLevel}/>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Link>
  )
}