export { auth as middleware } from "@/lib/auth/auth";

export const config = {
  matcher: ["/feed/:path*", "/new/:path*"],
};
