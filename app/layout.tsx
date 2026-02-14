import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import { auth } from "@/lib/auth/auth";

export const metadata = {
  title: "Aperture",
  description: "Photo-first social platform for photographers",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <header className="border-b border-zinc-800">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/" className="text-lg font-semibold text-zinc-100">Aperture</Link>
            <div className="flex gap-4 text-sm">
              {session?.user ? (
                <>
                  <Link href="/feed">Feed</Link>
                  <Link href="/new">New post</Link>
                  <Link href={`/@${session.user.username ?? "onboarding"}`}>Profile</Link>
                </>
              ) : (
                <Link href="/api/auth/signin">Sign in</Link>
              )}
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
