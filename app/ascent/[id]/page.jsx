import { getAscent, getAscents } from "@/app/lib/actions/ascent";
import Image from "next/image";
import ProfileBanner from "@/components/profile/ProfileBanner";
import { MdAltRoute, MdCalendarMonth } from "react-icons/md";
import { formatDate } from "@/util";
import PhotoGallery from "@/components/PhotoGallery";
import CommentSection from "@/components/comments/CommentSection";

export default async function Ascent(props) {
  const params = await props.params;
  const id = params.id;

  const ascent = await getAscent(id);

  // const [ascent, setAscent] = useState(null);
  // const [loading, setLoading] = useState(false);

  // const fetchAscent = async () => {
  //   setLoading(true);
  //   const result = await getAscent(id);
  //   if (result.error) {
  //     toast.error(result.error);
  //   } else {
  //     setAscent(result.data);
  //   }
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   fetchAscent();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="flex w-full h-screen items-center justify-center text-xl">
  //       nalaganje
  //     </div>
  //   );
  // }

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
                <div className="flex flex-row gap-5 py-5">
                  <div className="flex gap-1 items-center">
                    <MdCalendarMonth size={18} />
                    <p>{formatDate(ascent.date)}</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <MdAltRoute size={18} />
                    <p>
                      {ascent.route} ({ascent.difficulty})
                    </p>
                  </div>
                </div>

                {/* People */}
                <div className="flex flex-col items-start gap-5 md:flex-row md:gap-20 md:items-center">
                  {/* Author */}
                  <div>
                    <p className="font-medium mb-2">Avtor</p>
                    <ProfileBanner
                      firstName={ascent.author.firstName}
                      lastName={ascent.author.lastName}
                      userId={ascent.author.id}
                      size={25}
                    />
                  </div>
                  {/* CoClimbers */}
                  <div>
                    <p className="font-medium mb-2">Soplezalci</p>
                    <ul className="flex gap-5 flex-wrap items-center">
                      {ascent.registeredParticipants.map((participant) => (
                        <li key={participant.id}>
                          <ProfileBanner
                            firstName={participant.firstName}
                            lastName={participant.lastName}
                            userId={participant.id}
                            size={25}
                          />
                        </li>
                      ))}
                      {ascent.unregisteredParticipants.map(
                        (participant, index) => (
                          <li key={index}>{participant}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
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
                <PhotoGallery photos={ascent.photos} />
              </div>
            </section>
          )}

          {/* Comment section */}
          <section className="mt-10 px-5 md:px-20">
            <p className="text-xl font-medium mb-4">Komentarji</p>
            <CommentSection ascentId={id} />
          </section>
        </div>
      )}
    </>
  );
}
