import Image from "next/image";
import ProfileBanner from "@/components/profile/ProfileBanner";
import { MdCalendarMonth } from "react-icons/md";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { getEvent } from "@/lib/actions/event";
import Badge from "@/components/Badge";

export default async function Event({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: event, error } = await getEvent(id);

  if (error) {
    return <div>error</div>;
  }

  return (
    <>
      {event && (
        <div>
          {/* Cover Photo */}
          {event.coverPhoto && (
            <section className="w-full md:h-80">
              <Image
                src={event.coverPhoto.url}
                alt={"image"}
                width={1000}
                height={1000}
                className="w-full h-full object-cover object-center"
              />
            </section>
          )}

          {/* Event header */}
          <section className="flex flex-col py-5 bg-gray-50">
            <div className="px-5 md:px-20">
              <h1 className="text-3xl font-medium mb-5 md:text-4xl mt-3">{event.title}</h1>

              {/* event date badge */}
              {event.date && (
                <Badge
                  content={format(event.date, "EEEE, dd. MMMM yyyy", { locale: sl })}
                  icon={MdCalendarMonth}
                  iconColor="#fff"
                  iconBgColor="#000"
                  className="mb-5"
                  bgColor="#fff"
                  textClassName="text-gray-900 font-semibold"
                />
              )}

              {/* Author */}
              <div className="mb-3">
                {/* <p className="font-medium mb-2">Avtor</p> */}
                <ProfileBanner
                  firstName={event.author.firstName}
                  lastName={event.author.lastName}
                  iconSize={30}
                  textSize={14}
                />
              </div>
              <p className="text-gray-600 text-sm font-base">
                Objavljeno: {format(event.createdAt, "EEEE, dd. MMMM yyyy", { locale: sl })}
              </p>
            </div>
          </section>

          {/* Text section */}
          <section className="px-5 md:px-20">
            <div className="mt-7">
              <p className="text-justify">{event.text}</p>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
