import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { listFeedForUser } from "@/server/queries/feed";
import { PostCard } from "@/components/post-card";

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  if (!session.user.username) redirect("/onboarding");

  const posts = await listFeedForUser(session.user.id, undefined, 20);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Feed</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
