import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ProfileHeader } from "@/components/profile-header";
import { PostCard } from "@/components/post-card";

export default async function ProfilePage({ params }: { params: { handle: string } }) {
  const username = params.handle.startsWith("@") ? params.handle.slice(1) : params.handle;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) notFound();

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    include: { author: true, media: true, likes: true, comments: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-4">
      <ProfileHeader user={user} />
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
