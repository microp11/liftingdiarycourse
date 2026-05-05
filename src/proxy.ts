import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const handleAuthRedirect = clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  if (userId && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
});

export default handleAuthRedirect;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};