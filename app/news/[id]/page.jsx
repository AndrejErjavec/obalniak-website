import Image from "next/image";
import ProfileBanner from "@/components/profile/ProfileBanner";
import { MdAltRoute, MdCalendarMonth } from "react-icons/md";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { getEvent } from "@/lib/actions/event";

export default async function Event(props) {
  const params = await props.params;
  const id = params.id;

  const event = await getEvent(id);

  // if (loading) {
  //   return (
  //     <div className="flex w-full h-screen items-center justify-center text-xl">
  //       nalaganje
  //     </div>
  //   );
  // }

  if (!event) {
    return <div>No event</div>;
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
                <div className="inline-flex justify-center items-center px-4 py-2 rounded-full bg-white border border-gray-200 mb-5">
                  <div className="flex flex-row gap-2 items-center text-gray-800">
                    <MdCalendarMonth size={22} />
                    <p className="text-md font-medium">{format(event.date, "EEEE, dd. MMMM yyyy", { locale: sl })}</p>
                  </div>
                </div>
              )}

              {/* <div className="flex flex-row gap-5 py-5">
                  <div className="flex gap-1 items-center">
                    <MdCalendarMonth size={24} />
                    <p className="text-lg font-medium">{format(event.date, "EEEE, dd. MMMM yyyy", { locale: sl })}</p>
                  </div>
                </div> */}

              {/* Author */}
              <div className="mb-3">
                {/* <p className="font-medium mb-2">Avtor</p> */}
                <ProfileBanner
                  firstName={event.author.firstName}
                  lastName={event.author.lastName}
                  userId={event.author.id}
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
