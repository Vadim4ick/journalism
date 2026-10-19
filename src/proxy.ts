import { NextResponse, type NextRequest } from "next/server";
import { EnumTokens } from "@/shared/const/const";

export function proxy(request: NextRequest) {
  // Route hint only; the API validates the token when protected data is requested.
  const hasAuthCookie = Boolean(
    request.cookies.get(EnumTokens.ACCESS_TOKEN)?.value ||
    request.cookies.get(EnumTokens.REFRESH_TOKEN)?.value,
  );

  if (request.nextUrl.pathname === "/login") {
    return hasAuthCookie
      ? NextResponse.redirect(new URL("/account", request.url))
      : NextResponse.next();
  }

  return hasAuthCookie
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/account/:path*", "/login"],
};
