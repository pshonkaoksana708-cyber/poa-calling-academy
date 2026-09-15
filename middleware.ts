import { NextRequest, NextResponse } from "next/server";
import { LOGISTICS_ACCESS_COOKIE } from "@/lib/course-access-cookie";

const ACCESS_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

export function middleware(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.next();
  }

  const cleanUrl = request.nextUrl.clone();
  cleanUrl.searchParams.delete("token");
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const response =
    process.env.NODE_ENV === "production"
      ? NextResponse.redirect(cleanUrl, 303)
      : NextResponse.next();

  response.cookies.set(LOGISTICS_ACCESS_COOKIE, token, {
    httpOnly: true,
    maxAge: ACCESS_COOKIE_MAX_AGE_SECONDS,
    path: "/course/logistics",
    sameSite: "lax",
    secure:
      forwardedProtocol === "https" || request.nextUrl.protocol === "https:",
  });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");

  return response;
}

export const config = {
  matcher: "/course/logistics/:path*",
};
