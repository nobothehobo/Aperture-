import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: { strategy: "database" },
  pages: {
    newUser: "/onboarding",
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = user.username;
      }
      return session;
    },
    authorized: async ({ auth: session, request }) => {
      const pathname = request.nextUrl.pathname;
      if (pathname.startsWith("/feed") || pathname.startsWith("/new")) {
        return !!session?.user;
      }
      return true;
    },
  },
});
