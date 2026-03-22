import { getComments } from "@/lib/actions/comment";
import CommentItem from "@/components/comments/CommentItem";
import CommentForm from "./CommentForm";

export default async function CommentSection({ ascentId }: { ascentId: string }) {
  const response = await getComments(ascentId);

  if (!response.success) {
    return <div>{response.error}</div>;
  }

  const comments = response.data;

  return (
    <section className="flex flex-col gap-5">
      <CommentForm ascentId={ascentId} />
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
