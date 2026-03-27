import { FaUser } from "react-icons/fa";
import cn from "clsx";

export default function ProfileImage({
  text,
  size = 32,
  isRegistered = true,
}: {
  text: string;
  size: number;
  isRegistered?: boolean;
}) {
  const fontSize = size * 0.45;
  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0 font-medium text-white rounded-full",
        isRegistered ? "bg-primary" : "bg-slate-600",
      )}
      style={{ width: size, height: size, fontSize: fontSize }}
    >
      {isRegistered ? <span>{text}</span> : <FaUser size={fontSize} />}
    </div>
  );
}
