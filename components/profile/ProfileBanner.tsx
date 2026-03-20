import cn from "clsx";
import Link from "next/link";
import ProfileImage from "./ProfileImage";

interface ProfileBannerProps {
  firstName: string;
  lastName: string;
  userId?: string;
  isLink?: boolean;
  iconSize?: number;
  textSize?: number;
}

export default function ProfileBanner({
  firstName,
  lastName,
  userId,
  isLink = false,
  iconSize = 32,
  textSize = 16,
}: ProfileBannerProps) {
  return (
    <>
      {isLink ? (
        <Link
          href={userId ? `/profile/${userId}` : "#"}
          className={cn("flex gap-2 items-center", userId ? "cursor-pointer" : "cursor-default pointer-events-none")}
        >
          <ProfileImage firstName={firstName} lastName={lastName} size={iconSize} />
          <p style={{ fontSize: textSize }}>
            {firstName} {lastName}
          </p>
        </Link>
      ) : (
        <div className="flex gap-2 items-center">
          <ProfileImage firstName={firstName} lastName={lastName} size={iconSize} />
          <p style={{ fontSize: textSize }}>
            {firstName} {lastName}
          </p>
        </div>
      )}
    </>
  );
}
