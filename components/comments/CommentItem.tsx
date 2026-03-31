import ProfileImage from "../profile/ProfileImage";
import { relativeTime } from "@/util";
import cn from "clsx";

export default function CommentItem({ comment, userId }) {
  const isOwnComment = comment.author.id === userId;
  return (
    <div className="flex flex-row items-start gap-2">
      <ProfileImage text={`${comment.author.firstName.slice(0, 1)}${comment.author.lastName.slice(0, 1)}`} />
      <div className={cn("flex flex-col px-3 py-2 rounded shadow-sm", isOwnComment ? "bg-primary/20" : "bg-gray-100")}>
        <span className="text-xs font-medium text-gray-700">
          {comment.author.firstName} {comment.author.lastName}
        </span>
        <p className="text-base text-gray-700">{comment.text}</p>
        <span className="text-xs text-gray-500">{relativeTime(comment.createdAt)}</span>
      </div>
    </div>
  );
}
