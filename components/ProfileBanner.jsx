import ProfileImage from "@/components/ProfileImage";

export default function ProfileBanner({user, iconSize=32}) {
  return (
    <div className="flex gap-2 items-center">
      <ProfileImage user={user} size={iconSize}/>
      <p>{user.firstName} {user.lastName}</p>
    </div>
  )
}