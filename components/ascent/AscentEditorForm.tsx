"use client";

import { Photo, UnregisteredParticipation, User } from "@/app/generated/prisma";
import { AscentWithData, createAscent, updateAscent } from "@/lib/actions/ascent";
import { useRef, useState } from "react";
import PhotoUploadMulti, { UploadPhoto } from "../photoUpload/PhotoUploadMulti";
import { ActionResult } from "@/types";
import { err, ok } from "@/lib/action.utils";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Input from "../ui/Input";
import UserSelect from "../UserSelect";
import TextArea from "../ui/TextArea";
import { useRouter } from "next/navigation";

type FormState = {
  route: string;
  difficulty: string;
  routeLength: number;
  date: string;
  text: string;
  registeredParticipants: User[];
  unregisteredParticipants: UnregisteredParticipation[];
  removePhotos: Photo[];
};

type AscentEditorFormProps = {
  userId: string;
  mode: "create" | "edit";
  ascent?: AscentWithData;
};

type CoClimber = User | string;

function getInitialState(ascent?: AscentWithData): FormState {
  if (!ascent) {
    return {
      route: "",
      difficulty: "",
      routeLength: 0,
      date: "",
      text: "",
      registeredParticipants: [],
      unregisteredParticipants: [],
      removePhotos: [],
    };
  }

  return {
    route: ascent.route,
    difficulty: ascent.difficulty,
    routeLength: ascent.routeLength,
    date: ascent.date,
    text: ascent.text || "",
    registeredParticipants: ascent.registeredParticipants,
    unregisteredParticipants: ascent.unregisteredParticipants,
    removePhotos: ascent.photos,
  };
}

function getInitialCoClimbers(ascent?: AscentWithData): CoClimber[] {
  if (!ascent) {
    return [];
  }

  return [...ascent.registeredParticipants, ...ascent.unregisteredParticipants.map((participant) => participant.name)];
}

function AscentEditorForm({ userId, mode, ascent }: AscentEditorFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, setFormState] = useState<FormState>(getInitialState(ascent));
  const [coClimbers, setCoClimbers] = useState<CoClimber[]>(getInitialCoClimbers(ascent));
  const [photos, setPhotos] = useState<UploadPhoto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleInputChange = (field: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildFormData = () => {
    const nextFormData = new FormData();

    nextFormData.append("route", formState.route);
    nextFormData.append("difficulty", formState.difficulty);
    nextFormData.append("routeLength", String(formState.routeLength));
    nextFormData.append("date", String(formState.date));
    nextFormData.append("text", String(formState.text));
    nextFormData.append("authorId", String(userId));

    // if (photo) {
    //   nextFormData.append("photo", photo);
    // }

    return nextFormData;
  };

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
    setIsSubmitting(true);

    const payload = buildFormData();
    payload.append("coClimbers", JSON.stringify(coClimbers));

    const photoFiles = photos.map((photo) => photo.file);
    const uploadedPhotosResult = await uploadPhotos(photoFiles);

    if ("error" in uploadedPhotosResult) {
      toast.error(uploadedPhotosResult.error);
      setIsSubmitting(false);
      return;
    }

    for (const photoUrl of uploadedPhotosResult.data) {
      payload.append("photoUrls", photoUrl);
    }

    const result = mode === "edit" && ascent ? await updateAscent(ascent.id, payload) : await createAscent(payload);

    if (!result.success) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    formRef.current?.reset();
    setCoClimbers([]);
    setPhotos([]);

    toast.success(mode === "edit" ? "Objava posodobljena" : "Objava ustvarjena");

    router.push(`/ascent/${result.data?.id}`);
  };

  return (
    <div className="px-5 mx-auto md:container">
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="flex flex-col py-6 gap-5 md:flex-row md:justify-between md:py-8">
          <h1 className="text-3xl font-semibold">{mode === "create" ? "Ustvari" : "Uredi"} poročilo o vzponu</h1>
          <Button type="submit" className="hidden! md:inline-flex!" loading={isSubmitting} disabled={isSubmitting}>
            {mode === "edit" ? "Shrani spremembe" : "Objavi"}
          </Button>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <section className="flex flex-col gap-3 md:w-1/3">
            <div>
              <Label htmlFor="route" className="mb-1">
                Smer
              </Label>
              <Input
                type="text"
                id="route"
                name="route"
                placeholder="Naziv smeri/poti"
                value={formState.route}
                onChange={(inputEvent) => handleInputChange("route", inputEvent.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="difficulty" className="mb-1">
                Težavnost
              </Label>
              <Input
                type="text"
                id="difficulty"
                name="difficulty"
                value={formState.difficulty}
                onChange={(inputEvent) => handleInputChange("difficulty", inputEvent.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="length" className="mb-1">
                Dolžina
              </Label>
              <Input
                type="number"
                id="length"
                name="length"
                placeholder="dolžina smeri v metrih"
                value={formState.routeLength}
                onChange={(inputEvent) => handleInputChange("routeLength", inputEvent.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="date" className="mb-1">
                Datum vzpona
              </Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formState.date}
                onChange={(inputEvent) => handleInputChange("date", inputEvent.target.value)}
              />
            </div>

            <UserSelect userId={userId} selectedUsers={coClimbers} setUsers={setCoClimbers} />
          </section>

          <section className="flex flex-col gap-8 md:w-2/3">
            <div className="flex flex-col h-full">
              <Label htmlFor="text" className="mb-1">
                Opis vzpona/ture
              </Label>
              <TextArea
                id="text"
                name="text"
                placeholder="Besedilo..."
                value={formState.text}
                onChange={(inputEvent) => handleInputChange("text", inputEvent.target.value)}
              />
            </div>
          </section>
        </div>

        <div className="mt-7">
          <PhotoUploadMulti photos={photos} setPhotos={setPhotos} />
        </div>

        <Button type="submit" className="md:hidden! w-full mt-7" loading={isSubmitting} disabled={isSubmitting}>
          {mode === "edit" ? "Shrani spremembe" : "Objavi"}
        </Button>
      </form>
    </div>
  );
}

export default AscentEditorForm;
