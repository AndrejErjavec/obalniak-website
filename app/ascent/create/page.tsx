"use client";

import PhotoUploadMulti from "@/components/photoUpload/PhotoUploadMulti";
import { useState } from "react";
import UserSelect from "@/components/UserSelect";
import { createAscent } from "@/lib/actions/ascent";
import { toast } from "react-toastify";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";

export default function CreateClimb() {
  const [coClimbers, setCoClimbers] = useState([]);
  const [photos, setPhotos] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    const coClimbersString = JSON.stringify(coClimbers);
    formData.append("coClimbers", coClimbersString);

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    const result = await createAscent(formData);

    if (result.success) {
      toast.success("objava ustvarjena");

      for (const key of formData.keys()) {
        formData.delete(key);
      }
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="px-5 mx-auto md:container">
      <form action={handleSubmit}>
        <div className="flex flex-col py-6 gap-5 md:flex-row md:justify-between md:py-8">
          <h1 className="text-3xl font-semibold">Ustvari poročilo o vzponu</h1>
          <button type={"submit"} className="hidden md:block bg-blue-500 text-white font-medium px-4 py-2 rounded-md">
            Objavi
          </button>
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <section className="flex flex-col gap-3 md:w-1/3">
            <div>
              <Label htmlFor="title">Naslov</Label>
              <Input type="text" id="title" name="title" placeholder="Ime vzpona/ture" />
            </div>
            <div>
              <Label htmlFor="route">Smer</Label>
              <Input
                type="text"
                id="route"
                name="route"
                className="border rounded w-full py-2 px-3"
                placeholder="Naziv smeri/poti"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Težavnost</Label>
              <Input type="text" name="difficulty" className="border rounded w-full py-2 px-3" />
            </div>
            <div>
              <Label htmlFor="date">Datum vzpona</Label>
              <Input type="date" name="date" className="border rounded w-full py-2 px-3" />
            </div>
            <UserSelect users={coClimbers} setUsers={setCoClimbers} />
          </section>
          <section className="flex flex-col gap-8 md:w-2/3">
            <div className="flex flex-col h-full">
              <Label htmlFor="text">Opis vzpona/ture</Label>
              <TextArea placeholder="Besedilo..." name="text" />
            </div>
          </section>
        </div>
        <div className="mt-7">
          <PhotoUploadMulti setPhotos={setPhotos} />
        </div>
        <button
          type={"submit"}
          className="block md:hidden w-full mt-7 bg-blue-500 text-white font-medium px-4 py-2 rounded-md"
        >
          Objavi
        </button>
      </form>
    </div>
  );
}
