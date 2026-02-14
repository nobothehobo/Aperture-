import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PostCard } from "@/components/post-card";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      media: true,
      likes: true,
      comments: { include: { author: true }, orderBy: { createdAt: "desc" } },
      tags: { include: { tag: true } },
    },
  });

  if (!post) notFound();

  return (
    <div className="space-y-4">
      <PostCard post={post} />
      <section className="space-y-3 rounded-lg border border-zinc-800 p-4">
        <h2 className="font-semibold">Comments</h2>
        {post.comments.map((comment) => (
          <div key={comment.id} className="rounded bg-zinc-900 p-2 text-sm">
            <p className="font-medium">@{comment.author.username}</p>
            <p>{comment.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
