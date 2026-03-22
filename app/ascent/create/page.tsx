"use client";

import PhotoUploadMulti, { UploadPhoto } from "@/components/photoUpload/PhotoUploadMulti";
import { useRef, useState } from "react";
import UserSelect from "@/components/UserSelect";
import { createAscent } from "@/lib/actions/ascent";
import type { User } from "@/app/generated/prisma";
import { toast } from "react-toastify";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { ActionResult } from "@/types";
import { err, ok } from "@/lib/action.utils";

type CoClimber = User | string;

export default function CreateAscentPage() {
  const formRef = useRef<HTMLFormElement>(null);

  const [coClimbers, setCoClimbers] = useState<CoClimber[]>([]);
  const [photos, setPhotos] = useState<UploadPhoto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSelectKey, setUserSelectKey] = useState(0);

  const router = useRouter();

  const uploadPhotos = async (files: File[]): Promise<ActionResult<string[]>> => {
    if (files.length === 0) {
      return ok([]);
    }

    const formData = new FormData();
    for (const photo of files) {
      formData.append("photos", photo);
    }

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return err(result.error);
      }

      return ok(result.data.map((d: { url: string; publicId: string }) => d.url));
    } catch {
      return err("Photo upload failed");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const photoFiles = photos.map((photo) => photo.file);
    const uploadedPhotosResult = await uploadPhotos(photoFiles);

    if ("error" in uploadedPhotosResult) {
      toast.error(uploadedPhotosResult.error);
      return;
    }

    for (const photoUrl of uploadedPhotosResult.data) {
      formData.append("photoUrls", photoUrl);
    }

    formData.append("coClimbers", JSON.stringify(coClimbers));

    const result = await createAscent(formData);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    formRef.current?.reset();
    setCoClimbers([]);
    setPhotos([]);
    setUserSelectKey((currentKey) => currentKey + 1);

    setIsSubmitting(false);
    toast.success("Objava ustvarjena");
    router.push(`/ascent/${result.data?.id}`);
  };

  return (
    <div className="px-5 mx-auto md:container">
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="flex flex-col py-6 gap-5 md:flex-row md:justify-between md:py-8">
          <h1 className="text-3xl font-semibold">Ustvari poročilo o vzponu</h1>
          <Button type="submit" className="hidden! md:inline-flex!" loading={isSubmitting} disabled={isSubmitting}>
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
              <Input type="text" id="difficulty" name="difficulty" />
            </div>

            <div>
              <Label htmlFor="date" className="mb-1">
                Datum vzpona
              </Label>
              <Input type="date" id="date" name="date" />
            </div>

            <UserSelect key={userSelectKey} setUsers={setCoClimbers} />
          </section>

          <section className="flex flex-col gap-8 md:w-2/3">
            <div className="flex flex-col h-full">
              <Label htmlFor="text" className="mb-1">
                Opis vzpona/ture
              </Label>
              <TextArea id="text" name="text" placeholder="Besedilo..." />
            </div>
          </section>
        </div>

        <div className="mt-7">
          <PhotoUploadMulti photos={photos} setPhotos={setPhotos} />
        </div>

        <Button type="submit" className="md:hidden! w-full mt-7" loading={isSubmitting} disabled={isSubmitting}>
          Objavi
        </Button>
      </form>
    </div>
  );
}
