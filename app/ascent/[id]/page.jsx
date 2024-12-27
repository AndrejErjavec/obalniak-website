"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {getAscent, getAscents} from "@/app/lib/actions/ascent";
import { useParams } from "next/navigation";
import Image from "next/image";
import ProfileBanner from "@/components/ProfileBanner";
import { MdAltRoute, MdCalendarMonth } from "react-icons/md";
import { formatDate } from "@/util";
import PhotoGallery from "@/components/PhotoGallery";

export default function Ascent() {
  const params = useParams();
  const id = params.id;

  const [ascent, setAscent] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAscent = async () => {
    setLoading(true);
    const result = await getAscent(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      setAscent(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAscent();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center text-xl">
        nalaganje
      </div>
    );
  }

  return (
    <>
      {ascent && (
        <div>
          {/* Cover Photo */}
          <section>
            {ascent.photos && ascent.photos.length > 0 && (
              <div className="w-full">
                <Image
                  src={ascent.photos[0].url}
                  alt={"image"}
                  width={1000}
                  height={1000}
                  className="w-full object-contain object-center"
                />
              </div>
            )}
          </section>

          {/* Ascent header */}
          <section className="flex flex-col py-5 bg-gray-100">
            <div className="px-5 md:px-20">
              <h1 className="text-3xl font-medium">{ascent.title}</h1>
              <div className="flex flex-col">
                {/* Date and route */}
                <div className="flex flex-row gap-5 py-5">
                  <div className="flex gap-1 items-center">
                    <MdCalendarMonth size={18}/>
                    <p>{formatDate(ascent.date)}</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <MdAltRoute size={18}/>
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
                    <ProfileBanner user={ascent.author} size={25}/>
                  </div>
                  {/* CoClimbers */}
                  <div>
                    <p className="font-medium mb-2">Soplezalci</p>
                    <ul className="flex gap-5 flex-wrap items-center">
                      {ascent.registeredParticipants.map((participant) => (
                        <li>
                          <ProfileBanner user={participant} size={25}/>
                        </li>
                      ))}
                      {ascent.unregisteredParticipants.map((participant) => (
                        <li>{participant}</li>
                      ))}
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
          <div className="mt-10 px-5 md:px-20">
            <div>
              <p className="text-xl font-medium mb-4">Fotogalerija</p>
              <PhotoGallery photos={ascent.photos}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
