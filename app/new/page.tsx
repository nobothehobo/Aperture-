import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { createPostAction } from "./actions";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  if (!session.user.username) redirect("/onboarding");

  return (
    <form action={createPostAction} className="mx-auto grid max-w-2xl gap-3 rounded-lg border border-zinc-800 p-4">
      <h1 className="text-2xl font-semibold">Create post</h1>
      <input name="imageUrl" placeholder="Image URL (from uploaded storage)" className="rounded bg-zinc-900 p-2" required />
      <div className="grid grid-cols-2 gap-2">
        <input name="width" type="number" placeholder="Image width" className="rounded bg-zinc-900 p-2" required />
        <input name="height" type="number" placeholder="Image height" className="rounded bg-zinc-900 p-2" required />
      </div>
      <textarea name="caption" placeholder="Caption" className="min-h-32 rounded bg-zinc-900 p-2" required />
      <input name="camera" placeholder="Camera (optional)" className="rounded bg-zinc-900 p-2" />
      <input name="lens" placeholder="Lens (optional)" className="rounded bg-zinc-900 p-2" />
      <input name="settings" placeholder="Settings (optional)" className="rounded bg-zinc-900 p-2" />
      <input name="tags" placeholder="#street,#portrait" className="rounded bg-zinc-900 p-2" />
      <button className="rounded bg-sky-500 p-2 font-medium">Publish</button>
    </form>
  );
}
