import ProfileImage from "@/components/profile/ProfileImage";
import Link from "next/link";

export default function ProfileBanner({firstName, lastName, userId, iconSize=32, textSize=16}) {
  return (
    <>
      {userId? (
        <Link href={`/profile/${userId}`} className="flex gap-2 items-center cursor-pointer">
          <ProfileImage firstName={firstName} lastName={lastName} size={iconSize} />
          <p style={{fontSize: textSize}}>{firstName} {lastName}</p>
        </Link>
      ) : (
        <div className="flex gap-2 items-center">
          <ProfileImage firstName={firstName} lastName={lastName} size={iconSize} />
          <p style={{fontSize: textSize}}>{firstName} {lastName}</p>
        </div>
      )}
    </>

  )
}