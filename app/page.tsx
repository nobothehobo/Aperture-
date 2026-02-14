import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/feed");
  }

  return (
    <section className="space-y-6 py-20 text-center">
      <h1 className="text-4xl font-bold">Aperture</h1>
      <p className="mx-auto max-w-xl text-zinc-300">
        A photo-first social platform built for photographers. Share single-image posts, discover creators, and build your portfolio-focused network.
      </p>
      <Link className="inline-flex rounded bg-sky-500 px-5 py-2 font-medium text-white" href="/api/auth/signin">
        Sign in to start posting
      </Link>
    </section>
  );
}
