"use client"

import PhotoUpload from "@/components/PhotoUpload";
import {useEffect, useState} from "react";
import {getUsersByName} from "@/app/lib/actions/user";
import UserSearch from "@/components/UserSearch";
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

  const [formData, setFormData] = useState({
    title: "",
    route: "",
    difficulty: "",
    date: "",
    text: "",
  });

  const [coClimbers, setCoClimbers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {...formData, coClimbers};
    console.log(data);
    const result = await createAscent(data);

    if (result.success) {
      toast.success("objava ustvarjena");
    } else {
      toast.error(result.error);
    }
  }

  const handleChange = (e) => {
    setFormData(prevState => ({
      ...prevState, [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    console.log(coClimbers);
  }, [coClimbers]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold my-8">Ustvari prispevek</h1>
      <form action="" className="flex flex-row gap-8" onSubmit={handleSubmit}>
        <section className="flex flex-col gap-3 w-1/3">
          <div>
            <label htmlFor="title">Naslov</label>
            <input
              type="text"
              id="title"
              name="title"
              className="border rounded w-full py-2 px-3"
              placeholder="npr. Vzpon na Malo Mojstrovko"
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="difficulty">Težavnost</label>
            <select
              id="difficulty"
              name="difficulty"
              className="border rounded w-full py-2 px-3"
              onChange={handleChange}
            >
              <option disabled selected value className="text-gray-100">
                Izberite težavnost
              </option>
              {difficulties.map((d) => (
                <option value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date">Datum vzpona</label>
            <input
              type="date"
              name="date"
              className="border rounded w-full py-2 px-3"
              onChange={handleChange}
            />
          </div>
          <UserSearch options={coClimbers} setOptions={setCoClimbers} />
        </section>
        <section className="flex flex-col gap-8 w-2/3">
          <div className="flex flex-col h-full">
            <label htmlFor="text">Opis vzpona/ture</label>
            <textarea
              placeholder="besedilo..."
              name="text"
              className="border rounded h-full py-2 px-3 "
              onChange={handleChange}
            />
          </div>
        </section>
        <button type={"submit"} className="bg-blue-500 text-white">Ustvari</button>
      </form>
      <div className="mt-7">
        <PhotoUpload></PhotoUpload>
      </div>
    </div>

  );
}
