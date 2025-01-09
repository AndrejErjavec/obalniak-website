"use client"

import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import { MdSend } from "react-icons/md";
import {addComment} from "@/app/lib/actions/comment";
import {getComments} from "@/app/lib/actions/comment";
import {useAuth} from "@/context/authContext";
import CommentItem from "@/components/comments/CommentItem";

export default function CommentSection({ascentId}) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const {user, isAuthenticated} = useAuth();

  const fetchComments = async (ascentId) => {
    const result = await getComments(ascentId);
    if (result.error) {
      toast.error(result.error);
    } else {
      setComments(result.data);
    }
  }

  useEffect(() => {
    fetchComments(ascentId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      return;
    }
    const result = await addComment({text, ascentId});
    console.log(result);
    if (result.error) {
      toast.error(result.error);
    } else {
      setText("");
      setComments((prevComments) => [result.data, ...prevComments]);
    }
  }

  return (
    <section className="flex flex-col gap-5">
      { isAuthenticated ? (
        <form onSubmit={handleSubmit}>
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              name="text"
              value={text}
              placeholder="Oddaj komentar"
              onChange={(e) => setText(e.target.value)}
              className="border rounded w-full py-2 px-3"
            />
            <button
              type="submit"
              className={`flex items-center justify-center rounded-full w-10 h-10 ${
                text.trim()
                  ? "bg-gray-800 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <MdSend size={20}/>
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
  )
}