import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { completeOnboardingAction } from "./actions";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  if (session.user.username) redirect(`/@${session.user.username}`);

  return (
    <form action={completeOnboardingAction} className="mx-auto grid max-w-2xl gap-3 rounded-lg border border-zinc-800 p-4">
      <h1 className="text-2xl font-semibold">Set up your profile</h1>
      <p className="text-sm text-zinc-400">Choose a unique username to unlock posting and profile URL.</p>
      <input name="username" placeholder="username" className="rounded bg-zinc-900 p-2" required />
      <input name="displayName" placeholder="Display name" className="rounded bg-zinc-900 p-2" />
      <textarea name="bio" placeholder="Bio" className="rounded bg-zinc-900 p-2" />
      <input name="location" placeholder="Location" className="rounded bg-zinc-900 p-2" />
      <input name="website" placeholder="Website" className="rounded bg-zinc-900 p-2" />
      <textarea name="gear" placeholder="Gear" className="rounded bg-zinc-900 p-2" />
      <button className="rounded bg-sky-500 p-2 font-medium">Save profile</button>
    </form>
  );
}
