import Image from "next/image"
import { format } from 'date-fns'
import { sl } from 'date-fns/locale';
import {MdCalendarMonth} from "react-icons/md";
import Link from "next/link";

export default function EventCard({event}) {
  return (
    <div
      key={event.id}
      className="flex flex-col border rounded cursor-pointer"
    >
      <Link href={`/news/events/${event.id}`}>
          {event.coverPhoto && (
            <Image
              src={event.coverPhoto.url}
              alt={"image"}
              width={1000}
              height={1000}
              className="w-full h-48 object-cover object-center rounded-t"/>
          )}
          <div className="flex flex-col gap-5 px-5 py-5">
            {/* Head */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              {/* Event date */}
              <div className="flex flex-row items-center gap-1">
                <MdCalendarMonth size={24}/>
                <p className="text-lg">{format(event.date, "EEEE, dd. MMMM yyyy", {locale: sl})}</p>
              </div>
            </div>
            <div className="border-b border-gray-300"></div>
            <p className="text-justify overflow-hidden max-h-48">{event.text}</p>
          </div>
      </Link>
    </div>
  )
}