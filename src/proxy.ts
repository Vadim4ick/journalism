import { NextResponse, type NextRequest } from "next/server";
import { EnumTokens } from "@/shared/const/const";
import { $serverApi } from "@/shared/api/server-axios";
import type { SiteSettingsResponse } from "@/shared/types/model/settings.type";

export async function proxy(request: NextRequest) {
  try {
    const { data } = await $serverApi.get<SiteSettingsResponse>("/settings");
    if (
      data.status !== "success" ||
      !data.data ||
      data.data.is_public_part_closed
    ) {
      return NextResponse.rewrite(new URL("/technical-works", request.url));
    }
  } catch {
    return NextResponse.rewrite(new URL("/technical-works", request.url));
  }

  // Route hint only; the API validates the token when protected data is requested.
  const hasAuthCookie = Boolean(
    request.cookies.get(EnumTokens.ACCESS_TOKEN)?.value ||
    request.cookies.get(EnumTokens.REFRESH_TOKEN)?.value,
  );

  if (request.nextUrl.pathname === "/login") {
    return hasAuthCookie
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/account")) {
    return hasAuthCookie
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|technical-works|images|favicon.ico|icon.svg|sitemap.xml|robots.txt|file.svg|vercel.svg|next.svg|globe.svg|window.svg).*)",
  ],
};
