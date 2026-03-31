"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BsPinAngleFill } from "react-icons/bs";
import PhotoUploadSingle from "@/components/photoUpload/PhotoUploadSingle";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import Option from "@/components/Option";
import { NewPhotoItem, NewsType } from "@/types";
import { AdminEventSummary, createEvent, updateEvent } from "@/lib/actions/news";
import { uploadPhotos } from "@/lib/api-service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Photo } from "@/app/generated/prisma";

type FormState = {
  title: string;
  date: string;
  text: string;
  isPinned: boolean;
  type: NewsType;
  removeCoverPhoto: boolean;
};

type NewsEditorFormProps = {
  mode: "create" | "edit";
  event?: AdminEventSummary;
};

function getInitialState(event?: AdminEventSummary): FormState {
  if (!event) {
    return {
      title: "",
      date: "",
      text: "",
      isPinned: false,
      type: "Običajna novica",
      removeCoverPhoto: false,
    };
  }

  return {
    title: event.title,
    date: event.date ? event.date.slice(0, 10) : "",
    text: event.text,
    isPinned: event.isPinned,
    type: event.type as NewsType,
    removeCoverPhoto: false,
  };
}

export default function NewsEditorForm({ mode, event }: NewsEditorFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(getInitialState(event));
  const [existingPhoto] = useState<Photo | null>(event?.coverPhoto ?? null);
  const [newPhoto, setNewPhoto] = useState<NewPhotoItem | null>(null);
  const [replaceRemove, setReplaceRemove] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log(existingPhoto, newPhoto);
  }, [existingPhoto, newPhoto]);

  const handleInputChange = (field: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildFormData = () => {
    const nextFormData = new FormData();

    nextFormData.append("title", formState.title);
    nextFormData.append("date", formState.date);
    nextFormData.append("text", formState.text);
    nextFormData.append("isPinned", String(formState.isPinned));
    nextFormData.append("type", formState.type);

    return nextFormData;
  };

  const handleSubmit = async (submitEvent: React.FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setIsSubmitting(true);

    const payload = buildFormData();

    payload.append("replaceRemove", replaceRemove.toString());

    if (newPhoto) {
      const uploadedPhotosResult = await uploadPhotos(newPhoto ? [newPhoto.file] : []);

      if (!uploadedPhotosResult.success) {
        toast.error(uploadedPhotosResult.error);
        setIsSubmitting(false);
        return;
      }

      if (uploadedPhotosResult.data[0]) {
        payload.append("photoUrl", uploadedPhotosResult.data[0]);
      }
    }

    const result = mode === "edit" && event ? await updateEvent(event.id, payload) : await createEvent(payload);

    if (!result.success) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(mode === "edit" ? "Novica posodobljena" : "Novica ustvarjena");
    router.push("/admin/news");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h1 className="text-xl lg:text-2xl font-semibold">{mode === "edit" ? "Urejanje novice" : "Objava novic"}</h1>
          <Link href="/admin/news" className="font-light text-gray-600">
            {"<"} <span className="underline">Nazaj na seznam</span>
          </Link>
        </div>
        <div className="hidden lg:flex lg:items-center items-center lg:gap-3">
          <div className="flex flex-row items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-gray-900 border border-gray-200">
            <input
              type="checkbox"
              checked={formState.isPinned}
              onChange={(inputEvent) => handleInputChange("isPinned", inputEvent.target.checked)}
              className="w-5 h-5"
            />
            <div className="flex items-center gap-1">
              <BsPinAngleFill />
              <Label>Pripni na vrh</Label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
              {mode === "edit" ? "Shrani spremembe" : "Objavi"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <section className="flex flex-col gap-8 lg:gap-3 lg:w-1/3">
          <div>
            <Label>Tip novice</Label>
            <div className="inline-flex flex-row border border-gray-300 rounded-md overflow-hidden">
              <Option
                title="Običajna novica"
                value="Običajna novica"
                selectedType={formState.type}
                setSelectedType={(value) => handleInputChange("type", value)}
              />
              <Option
                title="Alpinistična šola"
                value="Alpinistična šola"
                selectedType={formState.type}
                setSelectedType={(value) => handleInputChange("type", value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="title" className="mb-1">
              Naslov
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Naziv dogodka"
              value={formState.title}
              onChange={(inputEvent) => handleInputChange("title", inputEvent.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="date" className="mb-1">
              Datum (opcijsko, če gre za dogodek)
            </Label>
            <Input
              type="date"
              id="date"
              name="date"
              className="border rounded w-full py-2 px-3"
              value={formState.date}
              onChange={(inputEvent) => handleInputChange("date", inputEvent.target.value)}
            />
          </div>
        </section>

        <section className="flex flex-col gap-8 md:w-2/3">
          <div className="flex flex-col h-full">
            <Label htmlFor="text" className="mb-1">
              Opis
            </Label>
            <TextArea
              id="text"
              name="text"
              placeholder="Besedilo..."
              className="min-h-56"
              value={formState.text}
              onChange={(inputEvent) => handleInputChange("text", inputEvent.target.value)}
            />
          </div>
        </section>
      </div>

      <div className="mt-7">
        <Label className="mb-1">Naslovna slika</Label>
        <PhotoUploadSingle
          existingPhoto={existingPhoto}
          newPhoto={newPhoto}
          setNewPhoto={setNewPhoto}
          replaceRemove={replaceRemove}
          setReplaceRemove={setReplaceRemove}
        />
      </div>

      <div className="lg:hidden flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2 rounded-md bg-gray-100 px-4 py-3 text-gray-900 border border-gray-200 mt-5">
          <input
            type="checkbox"
            checked={formState.isPinned}
            onChange={(inputEvent) => handleInputChange("isPinned", inputEvent.target.checked)}
            className="w-5 h-5"
          />
          <div className="flex items-center gap-1">
            <BsPinAngleFill />
            <Label>Pripni na vrh</Label>
          </div>
        </div>
        <Button type="submit" className="block w-full" disabled={isSubmitting} loading={isSubmitting}>
          {mode === "edit" ? "Shrani spremembe" : "Objavi"}
        </Button>
      </div>
    </form>
  );
}
