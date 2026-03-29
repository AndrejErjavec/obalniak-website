"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import Button from "@/components/ui/Button";
import { deleteEvent } from "@/lib/actions/news";

export default function DeleteNewsButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("Ali želite izbrisati to novico?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteEvent(eventId);

    if (!result.success) {
      toast.error(result.error);
      setIsDeleting(false);
      return;
    }

    toast.success("Novica izbrisana");
    router.refresh();
  };

  return (
    <Button type="button" variant="danger" onClick={handleDelete} disabled={isDeleting} loading={isDeleting}>
      <span className="inline-flex items-center gap-2">
        <MdDeleteOutline size={18} />
        Izbriši
      </span>
    </Button>
  );
}
