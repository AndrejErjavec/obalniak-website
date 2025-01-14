"use client"

import PhotoUploadMulti from "@/components/photoUpload/PhotoUploadMulti";
import {useEffect, useState} from "react";
import UserSelect from "@/components/UserSelect";
import {createAscent} from "@/app/lib/actions/ascent";
import {toast} from "react-toastify";
import * as form from "next/dist/lib/picocolors";
import {useAuth} from "@/context/authContext";

export default function CreateClimb() {
  const difficulties = [
    "1",
    "2",
    "3",
    "4",
    "5a",
    "5b",
    "5c",
    "6a", // Beginner
    "6a+",
    "6b",
    "6b+",
    "6c",
    "6c+",
    "7a",
    "7a+", // Intermediate
    "7b",
    "7b+",
    "7c",
    "7c+",
    "8a",
    "8a+",
    "8b", // Advanced
    "8b+",
    "8c",
    "8c+",
    "9a",
    "9a+",
    "9b",
    "9b+", // Pro
  ];

  const [coClimbers, setCoClimbers] = useState([]);
  const [photos, setPhotos] = useState([]);

  const handleSubmit = async (formData) => {
    const coClimbersString = JSON.stringify(coClimbers);
    formData.append("coClimbers", coClimbersString);

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    const result = await createAscent(formData);

    if (result.success) {
      toast.success("objava ustvarjena");

      for (let key of formData.keys()) {
        formData.delete(key)
      }
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="px-5 mx-auto md:container">
      <form action={handleSubmit}>
        <div className="flex flex-col py-6 gap-5 md:flex-row md:justify-between md:py-8">
          <h1 className="text-3xl font-semibold">Ustvari poročilo o vzponu</h1>
          <button type={"submit"}
                  className="hidden md:block bg-blue-500 text-white font-medium px-4 py-2 rounded-md">Objavi
          </button>
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <section className="flex flex-col gap-3 md:w-1/3">
            <div>
              <label htmlFor="title">Naslov</label>
              <input
                type="text"
                id="title"
                name="title"
                className="border rounded w-full py-2 px-3"
                placeholder="Ime vzpona/ture"
              />
            </div>
            <div>
              <label htmlFor="route">Smer</label>
              <input
                type="text"
                id="route"
                name="route"
                className="border rounded w-full py-2 px-3"
                placeholder="Naziv smeri/poti"
              />
            </div>
            <div>
              <label htmlFor="difficulty">Težavnost</label>
              <select
                id="difficulty"
                name="difficulty"
                className="border rounded w-full py-2 px-3"
              >
                <option disabled value selected className="text-gray-100">
                  Izberite težavnost
                </option>
                {difficulties.map((d) => (
                  <option value={d} key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date">Datum vzpona</label>
              <input
                type="date"
                name="date"
                className="border rounded w-full py-2 px-3"
              />
            </div>
            <UserSelect users={coClimbers} setUsers={setCoClimbers}/>
          </section>
          <section className="flex flex-col gap-8 md:w-2/3">
            <div className="flex flex-col h-full">
              <label htmlFor="text">Opis vzpona/ture</label>
              <textarea
                placeholder="Besedilo..."
                name="text"
                className="border rounded py-2 px-3 h-48 md:h-full"
              />
            </div>
          </section>
        </div>
        <div className="mt-7">
          <PhotoUploadMulti photos={photos} setPhotos={setPhotos}/>
        </div>
        <button type={"submit"}
                className="block md:hidden w-full mt-7 bg-blue-500 text-white font-medium px-4 py-2 rounded-md">Objavi
        </button>
      </form>
    </div>
  );
}
