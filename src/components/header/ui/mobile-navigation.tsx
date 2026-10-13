"use client";

import { Typography } from "@/shared/ui/typography";
import effects from "@/shared/assets/style/link-effects.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { nav } from "@/shared/const/nav.const";
import { Logo } from "@/shared/icons/logo";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/shared/ui/sheet";
import {
  useAccessibilityStore,
  useEffectiveReducedMotion,
} from "@/state/accessibility";
import { cn } from "@/shared/lib/utils";
import { isActiveNavigationLink } from "@/shared/lib/navigation";

function BurgerIcon({ open }: { open: boolean }) {
  const reducedMotion = useEffectiveReducedMotion();
  const transition = { duration: reducedMotion ? 0 : 0.25 };
  return (
    <span aria-hidden="true" className="relative block size-6">
      <motion.span
        className="absolute top-[11px] left-0 h-0.5 w-6 rounded-full bg-current"
        initial={false}
        animate={{ y: open ? 0 : -6, rotate: open ? 45 : 0 }}
        transition={transition}
      />
      <motion.span
        className="absolute top-[11px] left-0 h-0.5 w-6 rounded-full bg-current"
        initial={false}
        animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
        transition={transition}
      />
      <motion.span
        className="absolute top-[11px] right-0 h-0.5 rounded-full bg-current"
        initial={false}
        animate={{
          y: open ? 0 : 6,
          rotate: open ? -45 : 0,
          width: open ? 24 : 16,
        }}
        transition={transition}
      />
    </span>
  );
}

function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reducedMotion = useEffectiveReducedMotion();
  const enabled = useAccessibilityStore((state) => state.enabled);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1250px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="secondary" />}
        aria-label="Открыть навигацию"
        className="ml-auto flex size-11 rounded-full desktop1250:hidden"
      >
        <span className="scale-[0.8]">
          <BurgerIcon open={open} />
        </span>
      </SheetTrigger>
      <SheetContent
        className={cn(
          "flex flex-col px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))] mobileSmall:px-10",
          enabled ? "bg-background text-foreground" : "bg-foreground text-white",
        )}
      >
        <SheetTitle className="sr-only">Навигация по сайту</SheetTitle>
        <SheetDescription className="sr-only">
          Разделы Дома журналистики
        </SheetDescription>
        <div className="flex items-start justify-between gap-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="Дом журналистики — главная"
            className={`${effects.link} ${effects.logo}`}
          >
            <Logo className="h-auto w-16" />
          </Link>
          <SheetClose
            render={<Button variant="ghost" />}
            aria-label="Закрыть навигацию"
            className={cn(
              "size-12 rounded-full",
              enabled
                ? "bg-secondary text-foreground hover:bg-muted hover:text-foreground"
                : "bg-white/10 text-white hover:bg-white/20 hover:text-white",
            )}
          >
            <BurgerIcon open={open} />
          </SheetClose>
        </div>
        <nav aria-label="Мобильная навигация" className="my-auto py-8">
          <ul className="space-y-1">
          {nav.map((item, index) => {
            const active = isActiveNavigationLink(pathname, item.link);

            return (
              <motion.li
                key={item.name}
                initial={reducedMotion ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.3,
                  delay: reducedMotion ? 0 : 0.08 + index * 0.035,
                }}
              >
                <Link
                  href={item.link}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`${effects.link} ${effects.menu} group flex items-baseline gap-5 rounded-xl px-3 py-3`}
                >
                  <Typography
                    as="span"
                    variant="caption"
                    aria-hidden="true"
                    className={enabled ? "text-muted-foreground" : "text-white/40"}
                  >
                    {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][index]}
                  </Typography>
                  <Typography
                    as="span"
                    variant="navigation-mobile"
                    className={active ? "underline underline-offset-4" : undefined}
                  >
                    {item.name}
                  </Typography>
                </Link>
              </motion.li>
            );
          })}
          </ul>
        </nav>
        <Typography
          as="p"
          variant="small"
          className={cn(
            "border-t pt-5",
            enabled
              ? "border-border text-muted-foreground"
              : "border-white/15 text-white/50",
          )}
        >
          Медиацентр «Дом журналистики»
        </Typography>
      </SheetContent>
    </Sheet>
  );
}

export { MobileNavigation };
