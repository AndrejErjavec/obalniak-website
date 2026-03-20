"use client";

import PhotoUploadMulti from "@/components/photoUpload/PhotoUploadMulti";
import { useActionState, useEffect, useState } from "react";
import UserSelect from "@/components/UserSelect";
import { createAscent } from "@/lib/actions/ascent";
import { toast } from "react-toastify";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";

const initialState = {
  success: false,
  error: null as string | null,
};

export default function CreateAscentPage() {
  const [coClimbers, setCoClimbers] = useState([]);
  const [photos, setPhotos] = useState([]);

  const [state, formAction, isPending] = useActionState(createAscent, initialState);

  const handleSubmit = async (formData: FormData) => {
    const coClimbersString = JSON.stringify(coClimbers);
    formData.append("coClimbers", coClimbersString);

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    await formAction(formData);
  };

  useEffect(() => {
    if (state.success) {
      toast.success("objava ustvarjena");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="px-5 mx-auto md:container">
      <form action={handleSubmit}>
        <div className="flex flex-col py-6 gap-5 md:flex-row md:justify-between md:py-8">
          <h1 className="text-3xl font-semibold">Ustvari poročilo o vzponu</h1>
          <Button type={"submit"} className="!hidden md:!inline-flex" loading={isPending} disabled={isPending}>
            Objavi
          </Button>
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <section className="flex flex-col gap-3 md:w-1/3">
            <div>
              <Label htmlFor="title" className="mb-1">
                Naslov
              </Label>
              <Input type="text" id="title" name="title" placeholder="Ime vzpona/ture" />
            </div>
            <div>
              <Label htmlFor="route" className="mb-1">
                Smer
              </Label>
              <Input type="text" id="route" name="route" placeholder="Naziv smeri/poti" />
            </div>
            <div>
              <Label htmlFor="difficulty" className="mb-1">
                Težavnost
              </Label>
              <Input type="text" name="difficulty" />
            </div>
            <div>
              <Label htmlFor="date" className="mb-1">
                Datum vzpona
              </Label>
              <Input type="date" name="date" />
            </div>
            <UserSelect users={coClimbers} setUsers={setCoClimbers} />
          </section>
          <section className="flex flex-col gap-8 md:w-2/3">
            <div className="flex flex-col h-full">
              <Label htmlFor="text" className="mb-1">
                Opis vzpona/ture
              </Label>
              <TextArea placeholder="Besedilo..." name="text" />
            </div>
          </section>
        </div>
        <div className="mt-7">
          <PhotoUploadMulti setPhotos={setPhotos} />
        </div>
        <Button type={"submit"} className="md:!hidden w-full mt-7" loading={isPending} disabled={isPending}>
          Objavi
        </Button>
      </form>
    </div>
  );
}
