"use client";

import PhotoUploadSingle from "@/components/photoUpload/PhotoUploadSingle";
import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createEvent } from "@/lib/actions/news";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { BsPinAngleFill } from "react-icons/bs";
import { NewsType } from "@/types";

function PostTypeOption({
  title,
  value,
  selectedType,
  setSelectedType,
}: {
  title: string;
  value: NewsType;
  selectedType: NewsType;
  setSelectedType: (value: NewsType) => void;
}) {
  const isActive = value === selectedType;

  return (
    <div
      className={`px-3 py-2 text-sm font-semibold transition cursor-pointer ${
        isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={() => setSelectedType(value)}
    >
      {title}
    </div>
  );
}

const initialState = {
  success: false,
  error: null as string | null,
};

export default function CreateNewsPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [type, setType] = useState<NewsType>("Običajna novica");

  const [state, formAction, isPending] = useActionState(createEvent, initialState);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPinned(e.target.checked);
  };

  const handleSubmit = async (formData: FormData) => {
    if (photo) {
      formData.append("photo", photo);
    }
    formData.append("isPinned", isPinned.toString());
    formData.append("type", type);

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
    <form action={handleSubmit}>
      <h1 className="text-xl lg:text-2xl font-semibold">Objava novic</h1>

      <div className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center py-5">
        {/* news type selector */}
        <div>
          <Label>Tip novice</Label>
          <div className="inline-flex flex-row border border-gray-300 rounded-md overflow-hidden">
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
        </div>
        <div className="hidden lg:flex lg:items-center items-center lg:gap-3">
          <div className="flex flex-row items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-gray-900 border border-gray-200">
            <input
              type="checkbox"
              name="pinned"
              id="pinned"
              checked={isPinned}
              onChange={handlePinChange}
              className="w-5 h-5"
            />
            <div className="flex items-center gap-1">
              <BsPinAngleFill />
              <Label htmlFor="pined">Pripni na vrh</Label>
            </div>
          </div>
          <Button type={"submit"} disabled={isPending} loading={isPending}>
            Objavi
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <section className="flex flex-col gap-8 lg:gap-3 lg:w-1/3">
          <div>
            <Label htmlFor="title" className="mb-1">
              Naslov
            </Label>
            <Input type="text" id="title" name="title" placeholder="Naziv dogodka" />
          </div>
          <div>
            <Label htmlFor="date" className="mb-1">
              Datum (opcijsko, če gre za dogodek)
            </Label>
            <Input type="date" name="date" className="border rounded w-full py-2 px-3" />
          </div>
        </section>
        <section className="flex flex-col gap-8 md:w-2/3">
          <div className="flex flex-col h-full">
            <Label htmlFor="text" className="mb-1">
              Opis
            </Label>
            <TextArea placeholder="Besedilo..." name="text" className="min-h-50" />
          </div>
        </section>
      </div>
      <div className="mt-7">
        <PhotoUploadSingle photo={photo} setPhoto={setPhoto} />
      </div>
      <div className="lg:hidden flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2 rounded-md bg-gray-100 px-4 py-3 text-gray-900 border border-gray-200 mt-5">
          <input
            type="checkbox"
            name="pinned"
            id="pinned"
            checked={isPinned}
            onChange={handlePinChange}
            className="w-5 h-5"
          />
          <div className="flex items-center gap-1">
            <BsPinAngleFill />
            <Label htmlFor="pined">Pripni na vrh</Label>
          </div>
        </div>
        <Button type="submit" className="block w-full" disabled={isPending} loading={isPending}>
          Objavi
        </Button>
      </div>
    </form>
  );
}
