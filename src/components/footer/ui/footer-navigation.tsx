"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/shared/const/nav.const";
import { isActiveNavigationLink } from "@/shared/lib/navigation";
import effects from "@/shared/assets/style/link-effects.module.css";
import { Typography } from "@/shared/ui/typography";

export function FooterNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Навигация в подвале" className="w-full desktop1250:flex-1">
      <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 desktop1250:justify-end desktop1250:gap-x-1">
        {nav.map((item) => {
          const active = isActiveNavigationLink(pathname, item.link);

          return (
            <li key={item.name}>
              <Link
                href={item.link}
                aria-current={active ? "page" : undefined}
                className={`${effects.link} ${effects.nav} inline-flex rounded-full px-2 py-2 desktop1250:px-2.5`}
              >
                <Typography
                  as="span"
                  variant="navigation"
                  className={`block text-base text-footer-foreground${active ? " underline underline-offset-4" : ""}`}
                >
                  {item.name}
                </Typography>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
