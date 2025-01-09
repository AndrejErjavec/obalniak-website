"use client"

import PhotoUploadSingle from "@/components/photoUpload/PhotoUploadSingle";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {createEvent} from "@/app/lib/actions/event";

export default function CreateEvent() {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setLoading(true);
    if (photo) {
      formData.append("photo", photo);
    }
    const result = await createEvent(formData);
    if (result.success) {
      toast.success("objava ustvarjena");
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  return (
    <div className="px-5 mx-auto md:container">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col py-6 gap-5 md:flex-row md:justify-between md:py-8">
          <h1 className="text-3xl md:text-2xl font-semibold">Ustvari vabilo na dogodek</h1>
          <button
            type={"submit"}
            className="hidden md:block bg-blue-500 text-white font-medium px-4 py-2 rounded-md disabled:bg-blue-300 min-w-20"
            disabled={loading}
          >
            {loading ? (<>...</>) : <>Objavi</>}
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
                placeholder="npr. Vzpon na Malo Mojstrovko"
              />
            </div>
            <div>
              <label htmlFor="date">Datum</label>
              <input
                type="date"
                name="date"
                className="border rounded w-full py-2 px-3"
              />
            </div>
          </section>
          <section className="flex flex-col gap-8 md:w-2/3">
            <div className="flex flex-col h-full">
              <label htmlFor="text">Opis</label>
              <textarea
                placeholder="besedilo..."
                name="text"
                className="border rounded py-2 px-3 h-48 md:h-full"
              />
            </div>
          </section>
        </div>
        <div className="mt-7">
          <PhotoUploadSingle photo={photo} setPhoto={setPhoto} />
        </div>
        <button type={"submit"}
                className="block md:hidden w-full mt-7 bg-blue-500 text-white font-medium px-4 py-2 rounded-md">Objavi
        </button>
      </form>
    </div>
  );
}
