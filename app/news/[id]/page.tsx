import Image from "next/image";
import ProfileBanner from "@/components/profile/ProfileBanner";
import { MdCalendarMonth } from "react-icons/md";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { getEvent } from "@/lib/actions/news";
import Badge from "@/components/Badge";
import PhotoGallery from "@/components/PhotoGallery";
import Divider from "@/components/ui/Divider";

export default async function Event({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const eventResponse = await getEvent(id);

  if (!eventResponse.success) {
    return <div>{eventResponse.error}</div>;
  }

  const event = eventResponse.data;
  const coverPhoto = event.photos[0];

  return (
    <>
      {event && (
        <div>
          {/* Cover Photo */}
          {coverPhoto && (
            <section className="w-full md:h-80">
              <Image
                src={coverPhoto.url}
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
                  textClassName="text-gray-900 font-medium"
                  textSize="base"
                  iconSize="base"
                />
              )}

              {/* Author */}
              <div className="mb-5">
                {/* <p className="font-medium mb-2">Avtor</p> */}
                <ProfileBanner
                  name={`${event.author.firstName} ${event.author.lastName}`}
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
              <p className="whitespace-pre-line text-justify">{event.text}</p>
            </div>
          </section>

          {event.photos.length > 0 && (
            <section className="mt-10 px-5 md:px-20">
              <div>
                <p className="text-xl font-medium mb-4">Fotogalerija</p>
                <Divider />
                <PhotoGallery photos={event.photos} />
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
