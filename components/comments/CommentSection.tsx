"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdSend } from "react-icons/md";
import { addComment } from "@/lib/actions/comment";
import { getComments } from "@/lib/actions/comment";
import { useAuth } from "@/context/authContext";
import CommentItem from "@/components/comments/CommentItem";
import Input from "../ui/Input";
import cn from "clsx";

export default function CommentSection({ ascentId }: { ascentId: string }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const { user, isAuthenticated } = useAuth();

  const fetchComments = async (ascentId: string) => {
    const result = await getComments(ascentId);
    if (result.error) {
      toast.error(result.error);
    } else {
      setComments(result.data);
    }
  };

  useEffect(() => {
    fetchComments(ascentId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      return;
    }
    const result = await addComment({ text, ascentId });
    if (result.error) {
      toast.error(result.error);
    } else {
      setText("");
      setComments((prevComments) => [result.data, ...prevComments]);
    }
  };

  return (
    <section className="flex flex-col gap-5">
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
                text.trim() ? "bg-blue-500 text-white cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed",
              )}
            >
              <MdSend size={20} />
            </button>
          </div>
        </form>
      ) : (
        <p className="font-medium">Za objavo komentarjev morate biti prijavljeni.</p>
      )}

      {comments.length > 0 ? (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <CommentItem comment={comment} key={comment.id} />
          ))}
        </div>
      ) : (
        <p>Ni komentarjev</p>
      )}
    </section>
  );
}
