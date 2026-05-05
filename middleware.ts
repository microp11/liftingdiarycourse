import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (authHandler, request) => {
  const { userId } = await authHandler();
  const pathname = request.nextUrl.pathname;

  if (userId && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+|_next). *)", "/", "/(api|trpc)(.*)"],
};