"use client";

import { Typography } from "@/shared/ui/typography";
import effects from "@/shared/assets/style/link-effects.module.css";
import { useEffect, useRef, useState } from "react";
import { MobileNavigation } from "./mobile-navigation";
import { cn } from "@/shared/lib/utils";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { nav } from "@/shared/const/nav.const";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveNavigationLink } from "@/shared/lib/navigation";
import {
  useAccessibilityStore,
  useEffectiveReducedMotion,
} from "@/state/accessibility";

function NavigationItems({ floating = false }: { floating?: boolean }) {
  const isPresent = useIsPresent();
  const pathname = usePathname();
  const reducedMotion = useEffectiveReducedMotion();
  const enabled = useAccessibilityStore((state) => state.enabled);

  return (
    <motion.nav
      initial={
        floating
          ? {
              opacity: 0,
              y: reducedMotion ? 0 : -18,
              scale: reducedMotion ? 1 : 0.98,
            }
          : false
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        y: reducedMotion ? 0 : -10,
        transition: { duration: reducedMotion ? 0 : 0.16 },
      }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 380, damping: 32, mass: 0.8 }
      }
      aria-label={floating ? "Закреплённая навигация" : "Основная навигация"}
      aria-hidden={!isPresent}
      inert={!isPresent}
      className={cn(
        "relative w-full",
        !floating && "hidden desktop1250:block",
        floating &&
          "fixed right-3 top-4 z-50 w-auto rounded-2xl border border-white/10 bg-footer-background/95 p-1 text-footer-foreground shadow-lg shadow-black/15 backdrop-blur-xl mobile:right-4 desktop1250:inset-x-4 desktop1250:mx-auto desktop1250:w-[calc(100%-2rem)] desktop1250:max-w-[1200px] desktop1250:rounded-2xl desktop1250:px-2 desktop1250:py-1",
      )}
    >
      {floating && <MobileNavigation />}
      <ul
        className={cn(
          "hidden items-center justify-center gap-0.5 desktop1250:flex desktop1450:gap-2",
          enabled && "flex-wrap gap-2",
        )}
      >
        {nav.map((section, index) => {
          const active = isActiveNavigationLink(pathname, section.link);

          return (
            <motion.li
              key={section.name}
              initial={floating && !reducedMotion ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.2,
                delay: floating && !reducedMotion ? 0.06 + index * 0.025 : 0,
              }}
            >
              <Link
                href={section.link}
                aria-current={active ? "page" : undefined}
                className={`${effects.link} ${effects.nav}`}
              >
                <Typography
                  as="span"
                  variant="navigation"
                  className={`block rounded-full px-1 py-2 desktop1450:px-2${active ? " underline underline-offset-4" : ""}`}
                >
                  {section.name}
                </Typography>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </motion.nav>
  );
}

function HeaderNavigation() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [headerPassed, setHeaderPassed] = useState(false);
  const enabled = useAccessibilityStore((state) => state.enabled);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const pathname = usePathname();

  useEffect(() => {
    if (textMode) return;
    const header = anchorRef.current?.closest("header");
    if (!header) return;

    const observer = new IntersectionObserver(([entry]) => {
      setHeaderPassed(
        !entry.isIntersecting && entry.boundingClientRect.bottom <= 0,
      );
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, [textMode]);

  if (textMode) {
    return (
      <nav aria-label="Основная навигация">
        <ul>
          {nav.map((section) => {
            const active = isActiveNavigationLink(pathname, section.link);

            return (
              <li key={section.name}>
                <Link
                  href={section.link}
                  aria-current={active ? "page" : undefined}
                  className={active ? "underline underline-offset-4" : undefined}
                >
                  {section.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <div
      ref={anchorRef}
      className="h-0 w-full desktop1250:h-auto desktop1250:min-h-11"
    >
      <NavigationItems />
      <AnimatePresence>
        {headerPassed && !enabled && (
          <NavigationItems key="floating-navigation" floating />
        )}
      </AnimatePresence>
    </div>
  );
}

export { HeaderNavigation };
