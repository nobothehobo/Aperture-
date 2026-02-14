import { User } from "@prisma/client";

export function ProfileHeader({ user }: { user: User }) {
  return (
    <section className="space-y-2 rounded-lg border border-zinc-800 p-4">
      <h1 className="text-2xl font-semibold">{user.displayName ?? user.name ?? `@${user.username}`}</h1>
      <p className="text-zinc-400">@{user.username}</p>
      {user.bio && <p>{user.bio}</p>}
      <div className="grid gap-1 text-sm text-zinc-400">
        {user.location && <p>📍 {user.location}</p>}
        {user.website && <p>🔗 {user.website}</p>}
        {user.gear && <p>📷 {user.gear}</p>}
        <p>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </section>
  );
}
