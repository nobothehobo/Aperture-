import Image from "next/image";
import Link from "next/link";
import { Post, Media, User, Like, Comment, Tag, PostTag } from "@prisma/client";

type PostWithRelations = Post & {
  author: User;
  media: Media[];
  likes: Like[];
  comments: (Comment & { author?: User })[];
  tags: (PostTag & { tag: Tag })[];
};

export function PostCard({ post }: { post: PostWithRelations }) {
  const media = post.media[0];

  return (
    <article className="space-y-3 rounded-lg border border-zinc-800 p-4">
      <div className="flex items-center justify-between text-sm text-zinc-400">
        <Link href={`/@${post.author.username}`} className="font-semibold text-zinc-100">@{post.author.username}</Link>
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      {media && (
        <Image src={media.url} alt={post.caption} width={media.width} height={media.height} className="h-auto w-full rounded" />
      )}
      <p>{post.caption}</p>
      <div className="text-xs text-zinc-400">
        {post.camera && <p>Camera: {post.camera}</p>}
        {post.lens && <p>Lens: {post.lens}</p>}
        {post.settings && <p>Settings: {post.settings}</p>}
      </div>
      <div className="flex gap-3 text-sm text-zinc-300">
        <span>{post.likes.length} likes</span>
        <Link href={`/post/${post.id}`}>{post.comments.length} comments</Link>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {post.tags.map((item) => (
          <Link key={item.tagId} href={`/feed?tag=${encodeURIComponent(item.tag.name)}`} className="rounded bg-zinc-800 px-2 py-1">
            {item.tag.name}
          </Link>
        ))}
      </div>
    </article>
  );
}
