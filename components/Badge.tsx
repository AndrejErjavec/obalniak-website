import { IconType } from "react-icons/lib";
import cn from "clsx";

type SizeOption = "xs" | "sm" | "base";

interface BadgeProps {
  content: React.ReactNode;
  icon?: IconType;
  bgColor?: string;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
  textClassName?: string;
  textSize?: SizeOption;
  iconSize?: SizeOption;
}

const textSizeClasses: Record<SizeOption, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
};

const iconSizeClasses: Record<SizeOption, number> = {
  xs: 14,
  sm: 16,
  base: 18,
};

function Badge({
  content,
  icon: Icon,
  bgColor,
  iconColor,
  iconBgColor,
  className,
  textClassName,
  textSize = "sm",
  iconSize = "sm",
}: BadgeProps) {
  return (
    <div
      className={cn(
        "text-white inline-flex self-start justify-center shrink-0 items-center pr-2.5 py-1 rounded-full bg-gray-100/30 border border-gray-200",
        Icon ? "pl-1" : "pl-2.5",
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
            <Icon size={iconSizeClasses[iconSize]} color={iconColor} />
          </div>
        )}
        <p className={cn(textClassName, textSizeClasses[textSize])}>{content}</p>
      </div>
    </div>
  );
}

export default Badge;
