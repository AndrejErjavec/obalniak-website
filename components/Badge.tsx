import { IconType } from "react-icons/lib";
import cn from "clsx";

interface BadgeProps {
  content: string;
  icon?: IconType;
  bgColor?: string;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
  textClassName?: string;
}

function Badge({ content, icon, bgColor, iconColor, iconBgColor, className, textClassName }: BadgeProps) {
  const Icon = icon;

  return (
    <div
      className={cn(
        "text-white inline-flex self-start justify-center items-center pr-2.5 py-1 rounded-full bg-gray-100/30 border border-gray-200",
        icon ? "pl-1" : "pl-2.5",
        className,
      )}
      style={{ backgroundColor: bgColor ? bgColor : "#fff" }}
    >
      <div className="flex flex-row gap-1 items-center">
        {Icon && (
          <div
            className="rounded-full p-1 flex items-center justify-center mr-1"
            style={iconBgColor ? { backgroundColor: iconBgColor } : undefined}
          >
            <Icon size={16} color={iconColor} />
          </div>
        )}
        <p className={cn("text-sm", textClassName)}>{content}</p>
      </div>
    </div>
  );
}

export default Badge;
