import Image from "next/image";
import ProfileBanner from "@/components/profile/ProfileBanner";
import { MdAltRoute, MdCalendarMonth } from "react-icons/md";
import { format } from 'date-fns'
import { sl } from 'date-fns/locale';
import {getEvent} from "@/app/lib/actions/event";

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
    return (<div>No event</div>)
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

          {/* Ascent header */}
          <section className="flex flex-col py-5 bg-gray-50">
            <div className="px-5 md:px-20">
              <h1 className="text-3xl font-medium">{event.title}</h1>
              <div className="flex flex-col">
                {/* Date and route */}
                <div className="flex flex-row gap-5 py-5">
                  <div className="flex gap-1 items-center">
                    <MdCalendarMonth size={24}/>
                    <p className="text-lg font-medium">{format(event.date, "EEEE, dd. MMMM yyyy", {locale: sl})}</p>
                  </div>
                </div>

                {/* People */}
                <div className="flex flex-col items-start gap-5 md:flex-row md:gap-20 md:items-center">
                  {/* Author */}
                  <div>
                    <p className="font-medium mb-2">Avtor</p>
                    <ProfileBanner firstName={event.author.firstName} lastName={event.author.lastName} userId={event.author.id} size={25}/>
                  </div>
                </div>
              </div>
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
