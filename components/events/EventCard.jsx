import Image from "next/image"
import { format } from 'date-fns'
import { sl } from 'date-fns/locale';
import {MdCalendarMonth} from "react-icons/md";
import Link from "next/link";

export default function EventCard({ event }) {
  return (
    <div
      key={event.id}
      className="flex flex-col border rounded-lg shadow-lg overflow-hidden bg-white"
    >
      <Link href={`/news/events/${event.id}`} className="block">
        {event.coverPhoto && (
          <Image
            src={event.coverPhoto.url}
            alt={event.title}
            width={1000}
            height={1000}
            className="w-full h-48 object-cover object-center"
          />
        )}
        <div className="flex flex-col gap-4 p-5">
          {/* Head */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-gray-800">{event.title}</h3>
            {/* Event date */}
            <div className="flex flex-row items-center gap-2 text-gray-600">
              <MdCalendarMonth size={20} />
              <p className="text-sm font-medium">
                {format(event.date, "EEEE, dd. MMMM yyyy", { locale: sl })}
              </p>
            </div>
          </div>
          <div className="border-b border-gray-300"></div>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
            {event.text}
          </p>
        </div>
      </Link>
    </div>
  );
}
