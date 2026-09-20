export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/ideas/:path*", "/calendar/:path*"],
};
