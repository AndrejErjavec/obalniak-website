import { getAscent } from "@/lib/actions/ascent";
import Image from "next/image";
import ProfileBanner from "@/components/profile/ProfileBanner";
import { MdAltRoute, MdCalendarMonth } from "react-icons/md";
import { formatDate } from "@/util";
import PhotoGallery from "@/components/PhotoGallery";
import CommentSection from "@/components/comments/CommentSection";
import Badge from "@/components/Badge";
import Divider from "@/components/ui/Divider";

export default async function Ascent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const response = await getAscent(id);
  const ascent = response.data;

  const participants = ascent ? ascent?.registeredParticipants.length + ascent?.unregisteredParticipants.length : 0;

  return (
    <>
      {ascent && (
        <div>
          {/* Cover Photo */}
          {ascent.photos && ascent.photos.length > 0 && (
            <section className="w-full md:h-80">
              <Image
                src={ascent.photos[0].url}
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
              <h1 className="text-3xl font-medium">{ascent.title}</h1>
              <div className="flex flex-col">
                {/* Date and route */}
                <div className="flex flex-row gap-3 py-5">
                  <Badge
                    content={formatDate(ascent.date)}
                    icon={MdCalendarMonth}
                    iconColor="#fff"
                    iconBgColor="#117ec6"
                    textClassName="text-gray-900 font-medium"
                  />
                  <Badge
                    content={`${ascent.route} (${ascent.difficulty})`}
                    icon={MdAltRoute}
                    iconColor="#fff"
                    iconBgColor="#e29212"
                    textClassName="text-gray-900 font-medium"
                  />
                </div>

                {/* People */}
                <div className="flex flex-col items-start gap-5 md:flex-row md:gap-20 mb-5">
                  {/* Author */}
                  <div>
                    <p className="font-medium mb-2">Avtor</p>
                    <ProfileBanner
                      firstName={ascent.author.firstName}
                      lastName={ascent.author.lastName}
                      userId={ascent.author.id}
                      textSize={14}
                      iconSize={28}
                    />
                  </div>
                  {/* CoClimbers */}
                  <div>
                    <p className="font-medium mb-2">Soplezalci</p>
                    <>
                      {participants > 0 ? (
                        <ul className="flex gap-5 flex-wrap items-center">
                          {ascent.registeredParticipants.map((participant) => (
                            <li key={participant.id}>
                              <ProfileBanner
                                firstName={participant.firstName}
                                lastName={participant.lastName}
                                userId={participant.id}
                                textSize={14}
                                iconSize={28}
                              />
                            </li>
                          ))}
                          {ascent.unregisteredParticipants.map((participant, index) => (
                            <li key={index}>{participant}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="font-light">/</div>
                      )}
                    </>
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-base">
                  Objavljeno: {formatDate(ascent.createdAt.toDateString())}
                </p>
              </div>
            </div>
          </section>

          {/* Text section */}
          <section className="px-5 md:px-20">
            <div className="mt-7">
              <p className="text-justify">{ascent.text}</p>
            </div>
          </section>

          {/* Gallery */}
          {ascent.photos && ascent.photos.length > 0 && (
            <section className="mt-10 px-5 md:px-20">
              <div>
                <p className="text-xl font-medium mb-4">Fotogalerija</p>
                <Divider />
                <PhotoGallery photos={ascent.photos} />
              </div>
            </section>
          )}

          {/* Comment section */}
          <section className="mt-10 px-5 md:px-20">
            <p className="text-xl font-medium mb-4">Komentarji</p>
            <Divider />
            <CommentSection ascentId={id} />
          </section>
        </div>
      )}
    </>
  );
}
