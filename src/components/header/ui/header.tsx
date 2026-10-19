import effects from "@/shared/assets/style/link-effects.module.css";
import { Logo } from "@/shared/icons/logo";
import { Container } from "@/shared/ui/container";
import { TextModeToggle } from "@/components/text-mode";
import Link from "next/link";
import type { ReactNode } from "react";
import { HeaderNavigation } from "./header-navigation";
import { MobileNavigation } from "./mobile-navigation";
import { HeaderAuthControl } from "./header-auth-control";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { SiteSearch } from "@/components/site-search";
import { cn } from "@/shared/lib/utils";

type HeaderProps = {
  search: ReactNode;
  variant?: "default" | "auth" | "inner" | "account";
};

const Header = ({ search, variant = "default" }: HeaderProps) => {
  return (
    <header
      data-site-header
      className={cn(
        "z-20 py-5 text-white",
        variant === "default"
          ? "absolute inset-x-4 top-5 mx-auto max-w-[1840px]"
          : variant === "inner"
            ? "relative mx-2 mt-5 w-[calc(100%-1rem)] max-w-[1840px] rounded-[24px] bg-[linear-gradient(249.78deg,#01211E_3.44%,#02534A_93.72%)] mobile:mx-4 mobile:w-[calc(100%-2rem)] mobile:rounded-[32px] desktop1250:mx-auto"
            : variant === "account"
              ? "relative mx-2 mt-5 w-[calc(100%-1rem)] max-w-[1840px] rounded-[24px] bg-[linear-gradient(249.78deg,#01211E_3.44%,#02534A_93.72%)] mobile:mx-4 mobile:w-[calc(100%-2rem)] mobile:rounded-[32px] desktop1250:mx-auto desktop1250:mt-5"
              : "relative mx-2 mt-5 max-w-[1840px] rounded-[24px] bg-[linear-gradient(90deg,#01211E_0%,#01211E_18%,#013E37_55%,#013E37_100%)] mobile:mx-4 mobile:rounded-[32px] desktop1250:absolute desktop1250:inset-x-4 desktop1250:top-5 desktop1250:mx-auto desktop1250:mt-0",
      )}
    >
      <Container className={cn(
        "grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-6 px-4 mobile:gap-x-5 mobile:px-6 desktop1250:grid-cols-12 desktop1250:gap-x-7.5",
        variant === "account" && "desktop1250:grid-cols-[124px_minmax(0,1fr)_auto]",
      )}>
        <Link
          data-site-header-logo
          href="/"
          aria-label="Дом журналистики — главная"
          className={cn(
            effects.link,
            effects.logo,
            "justify-self-start desktop1250:col-span-2",
            variant === "account" && "desktop1250:col-span-1",
          )}
        >
          <span className="text-mode-hidden">
            <Logo
              className={cn(
                "h-auto",
                variant === "auth"
                  ? "w-[76px] mobile:w-[100px] desktop1250:w-[124px]"
                  : "w-14 mobile:w-20 desktop1250:w-[124px]",
              )}
            />
          </span>
          <span className="text-mode-only">Медиацентр «Дом журналистики»</span>
        </Link>

        <div data-site-header-center className={cn(
          "col-span-2 row-start-2 flex min-w-0 flex-col items-center gap-4 desktop1250:col-span-8 desktop1250:col-start-3 desktop1250:row-start-1 desktop1250:gap-8",
          variant === "account" && "desktop1250:col-span-1 desktop1250:col-start-2",
        )}>
          <span data-site-header-search className="hidden w-full max-w-[28.75rem] items-center gap-2 desktop1250:flex">
            {search}
          </span>
          <div data-site-header-nav className="w-full">
            <HeaderNavigation />
          </div>
        </div>

        <div data-site-header-actions className={cn(
          "col-start-2 row-start-1 justify-self-end desktop1250:col-span-2 desktop1250:col-start-11",
          variant === "account"
            ? "flex flex-col items-end gap-3 desktop1250:col-span-1 desktop1250:col-start-3"
            : "grid grid-cols-4 items-center justify-items-end gap-1 mobile:gap-2 desktop1250:flex desktop1250:flex-wrap desktop1250:justify-end desktop1250:gap-y-3",
        )}>
          {variant === "account" ? (
            <>
              <div className="flex items-center gap-2">
                <span className="desktop1250:hidden">
                  <SiteSearch compact />
                </span>
                <TextModeToggle />
                <AccessibilityPanel triggerClassName="size-11 rounded-full desktop1250:size-13" />
                <div className="text-mode-hidden desktop1250:hidden">
                  <MobileNavigation />
                </div>
              </div>
              <HeaderAuthControl />
            </>
          ) : (
            <>
              <span className="desktop1250:hidden">
                <SiteSearch compact />
              </span>
              <TextModeToggle />
              <AccessibilityPanel triggerClassName="size-11 rounded-full desktop1250:size-13" />
              <div className="text-mode-hidden desktop1250:hidden">
                <MobileNavigation />
              </div>
              <HeaderAuthControl publicLayout />
            </>
          )}
        </div>
      </Container>
    </header>
  );
};

export { Header };
