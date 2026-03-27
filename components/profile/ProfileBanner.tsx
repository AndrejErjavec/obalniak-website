import cn from "clsx";
import Link from "next/link";
import ProfileImage from "./ProfileImage";

interface ProfileBannerProps {
  name: string;
  isRegistered?: boolean;
  userId?: string;
  isLink?: boolean;
  iconSize?: number;
  textSize?: number;
}

export default function ProfileBanner({
  name,
  isRegistered = true,
  userId,
  isLink = false,
  iconSize = 32,
  textSize = 16,
}: ProfileBannerProps) {
  if (!name) return;
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length >= 2 ? nameParts[1] : "";
  const initials = nameParts.length >= 2 ? `${firstName.slice(0, 1)}${lastName.slice(0, 1)}` : name.slice(0, 1);

  return (
    <>
      {isLink ? (
        <Link
          href={userId ? `/profile/${userId}` : "#"}
          className={cn("flex gap-2 items-center", userId ? "cursor-pointer" : "cursor-default pointer-events-none")}
        >
          <ProfileImage size={iconSize} text={initials} isRegistered={isRegistered} />
          <p style={{ fontSize: textSize }}>
            {firstName} {lastName}
          </p>
        </Link>
      ) : (
        <div className="flex gap-2 items-center">
          <ProfileImage size={iconSize} text={initials} isRegistered={isRegistered} />
          <p style={{ fontSize: textSize }}>
            {firstName} {lastName}
          </p>
        </div>
      )}
    </>
  );
}
