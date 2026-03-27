"use client";

import { useAuth } from "@/context/authContext";
import { addComment } from "@/lib/actions/comment";
import { useState } from "react";
import { toast } from "react-toastify";
import Input from "../ui/Input";
import { MdSend } from "react-icons/md";
import cn from "clsx";
import Button from "../ui/Button";

function CommentForm({ ascentId }: { ascentId: string }) {
  const [text, setText] = useState("");

  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      return;
    }
    const response = await addComment({ text, ascentId });
    if (!response.success) {
      toast.error(response.error);
    } else {
      setText("");
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <form onSubmit={handleSubmit}>
          <div className="w-full flex items-center gap-2">
            <Input
              type="text"
              name="text"
              value={text}
              placeholder="Oddaj komentar"
              onChange={(e) => setText(e.target.value)}
              className="border rounded w-full py-2 px-3"
            />
            <button
              type="submit"
              className={cn(
                "flex items-center justify-center rounded-full w-10 h-10",
                text.trim() ? "bg-primary text-white cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed",
              )}
            >
              <MdSend size={20} />
            </button>
          </div>
        </form>
      ) : (
        <p className="font-medium">Za objavo komentarjev morate biti prijavljeni.</p>
      )}
    </div>
  );
}

export default CommentForm;
