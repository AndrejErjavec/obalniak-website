import ProfileImage from '../profile/ProfileImage';
import {relativeTime} from "@/util";

export default function CommentItem({ comment }) {
  return (
    <div className="flex flex-row items-start gap-2">
      <ProfileImage firstName={comment.author.firstName} lastName={comment.author.lastName} />
      <div className="flex flex-col px-3 py-2 bg-gray-100 rounded shadow-sm">
        <span className="text-xs font-semibold">{comment.author.firstName} {comment.author.lastName}</span>
        <p>{comment.text}</p>
        <span className="text-xs text-gray-500">{relativeTime(comment.createdAt)}</span>
      </div>
    </div>
  )
}