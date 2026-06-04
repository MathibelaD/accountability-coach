export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/coach/:path*", "/member/:path*"],
};
