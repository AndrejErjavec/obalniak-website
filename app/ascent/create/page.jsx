"use client"

import PhotoUpload from "@/components/PhotoUpload";
import {useEffect, useState} from "react";
import UserSelect from "@/components/UserSelect";
import {createAscent} from "@/app/lib/actions/ascent";
import {toast} from "react-toastify";

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
    coClimbers.forEach((coClimber) => {
      formData.append("coClimbers", coClimber);
    });

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    const result = await createAscent(formData);

    if (result.success) {
      toast.success("objava ustvarjena");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="container mx-auto">
      <form action={handleSubmit}>
        <div className="flex flex-row justify-between my-8">
          <h1 className="text-3xl font-semibold">Ustvari prispevek</h1>
          <button type={"submit"} className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md">Objavi</button>
        </div>
        <div className="flex flex-row gap-8">
          <section className="flex flex-col gap-3 w-1/3">
            <div>
              <label htmlFor="title">Naslov</label>
              <input
                type="text"
                id="title"
                name="title"
                className="border rounded w-full py-2 px-3"
                placeholder="npr. Vzpon na Malo Mojstrovko"
              />
            </div>
            <div>
              <label htmlFor="route">Smer</label>
              <input
                type="text"
                id="route"
                name="route"
                className="border rounded w-full py-2 px-3"
                placeholder="npr. Hanzona pot"
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
          <section className="flex flex-col gap-8 w-2/3">
            <div className="flex flex-col h-full">
              <label htmlFor="text">Opis vzpona/ture</label>
              <textarea
                placeholder="besedilo..."
                name="text"
                className="border rounded h-full py-2 px-3 "
              />
            </div>
          </section>
        </div>
      </form>
      <div className="mt-7">
        <PhotoUpload photos={photos} setPhotos={setPhotos}/>
      </div>
    </div>

  );
}
