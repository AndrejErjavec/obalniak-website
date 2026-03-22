import Image from "next/image";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { MdCalendarMonth } from "react-icons/md";
import Link from "next/link";
import { BsPinAngleFill } from "react-icons/bs";
import Badge from "../Badge";
import cn from "clsx";

export default function NewsCard({ event }) {
  const showSchoolBadge = event.type === "Alpinistična šola";
  const needsBadgeSpacing = showSchoolBadge && !event.coverPhoto;

  return (
    <div
      key={event.id}
      className="relative flex flex-col border border-gray-200 rounded-lg shadow-lg overflow-visible bg-white"
    >
      {event.isPinned && (
        <div className="absolute left-0 top-0 -translate-x-1/3 -translate-y-1/3 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-xs font-semibold text-white shadow-md pointer-events-none">
          <BsPinAngleFill size={16} className="-rotate-90" />
        </div>
      )}
      {showSchoolBadge && (
        <div className="absolute top-3 right-2">
          <span className="flex items-center justify-center py-1 px-2 rounded-md z-50 bg-blue-600 text-white text-sm font-medium">
            Alpinistična šola
          </span>
        </div>
      )}
      <Link href={`/news/${event.id}`} className="block">
        {event.coverPhoto && (
          <Image
            src={event.coverPhoto.url}
            alt={event.title}
            width={1000}
            height={1000}
            className="w-full h-48 object-cover object-center rounded-t-lg"
          />
        )}
        <div className={cn("flex flex-col gap-4 p-5", needsBadgeSpacing && "pt-14")}>
          {/* Head */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-medium text-gray-800">{event.title}</h3>

            {/* event date badge */}
            {event.date && (
              <Badge
                content={format(event.date, "EEEE, dd. MMMM yyyy", { locale: sl })}
                icon={MdCalendarMonth}
                iconColor="#fff"
                iconBgColor="#000"
                textClassName="text-gray-900 font-medium"
              />
            )}

            <p className="text-gray-600 text-xs font-base">
              Objavljeno: {format(event.createdAt, "EEEE, dd. MMMM yyyy", { locale: sl })}
            </p>
          </div>
          <div className="border-b border-gray-300"></div>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">{event.text}</p>
        </div>
      </Link>
    </div>
  );
}
