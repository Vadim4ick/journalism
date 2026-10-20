"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { SiteSearch } from "@/components/site-search";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <Header
      search={<SiteSearch />}
      variant={
        pathname === "/" ||
        pathname === "/news" ||
        pathname === "/documents" ||
        pathname === "/gallery" ||
        pathname === "/newspapers" ||
        pathname === "/events" ||
        pathname === "/projects" ||
        pathname === "/about"
          ? "default"
        : pathname === "/account" ||
            pathname === "/account/voting" ||
            pathname.startsWith("/account/voting/")
            ? "account"
          : "inner"
      }
    />
  );
}
