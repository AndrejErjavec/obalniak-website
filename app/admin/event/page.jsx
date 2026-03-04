"use client";

import PhotoUploadSingle from "@/components/photoUpload/PhotoUploadSingle";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createEvent } from "@/lib/actions/event";

function PostTypeOption({ title, value, selectedType, setSelectedType }) {
  const isActive = value === selectedType;

  return (
    <div
      className={`px-3 py-2 font-medium transition cursor-pointer ${
        isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={() => setSelectedType(value)}
    >
      {title}
    </div>
  );
}

export default function CreateEventPage() {
  const [photo, setPhoto] = useState(null);
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("Običajna novica");

  useEffect(() => {
    console.log(isPinned);
  }, [isPinned]);

  const handlePinChange = (e) => {
    setIsPinned(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setLoading(true);
    if (photo) {
      formData.append("photo", photo);
    }
    formData.append("isPinned", isPinned);
    formData.append("type", type);

    const result = await createEvent(formData);
    if (result.success) {
      toast.success("objava ustvarjena");
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="flex flex-col pb-6 gap-5 md:flex-row md:justify-between md:pb-8">
        <h1 className="text-xl md:text-2xl font-semibold">Objava novic</h1>
        <div className="hidden md:flex md:gap-5">
          <div className="flex flex-row items-center gap-2">
            <input
              type="checkbox"
              name="pinned"
              id="pinned"
              checked={isPinned}
              onChange={handlePinChange}
              className="w-5 h-5"
            />
            <label htmlFor="pined">Pripni na vrh</label>
          </div>

          <button
            type={"submit"}
            className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md disabled:bg-blue-300 min-w-20"
            disabled={loading}
          >
            {loading ? <>...</> : <>Objavi</>}
          </button>
        </div>
      </div>
      <div className="inline-flex flex-row mb-6 border border-gray-300 rounded-md overflow-hidden">
        <PostTypeOption
          title={"Običajna novica"}
          value={"Običajna novica"}
          selectedType={type}
          setSelectedType={setType}
        />
        <PostTypeOption
          title={"Alpinistična šola"}
          value={"Alpinistična šola"}
          selectedType={type}
          setSelectedType={setType}
        />
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <section className="flex flex-col gap-8 md:gap-3 md:w-1/3">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
              Naslov
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Naziv dogodka"
            />
          </div>
          <div>
            <label htmlFor="date">Datum (opcijsko, če gre za dogodek)</label>
            <input type="date" name="date" className="border rounded w-full py-2 px-3" />
          </div>
        </section>
        <section className="flex flex-col gap-8 md:w-2/3">
          <div className="flex flex-col h-full">
            <label htmlFor="text">Opis</label>
            <textarea placeholder="Besedilo..." name="text" className="border rounded py-2 px-3 h-48 md:h-full" />
          </div>
        </section>
      </div>
      <div className="mt-7">
        <PhotoUploadSingle photo={photo} setPhoto={setPhoto} />
      </div>
      <button
        type={"submit"}
        className="block md:hidden w-full mt-7 bg-blue-500 text-white font-medium px-4 py-2 rounded-md"
      >
        Objavi
      </button>
    </form>
  );
}
