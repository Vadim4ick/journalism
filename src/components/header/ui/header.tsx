import { typographyVariants } from "@/shared/ui/typography";
import effects from "@/shared/assets/style/link-effects.module.css";
import { Logo } from "@/shared/icons/logo";
import { Container } from "@/shared/ui/container";
import { Button } from "@/shared/ui/button";
import { SiteImage as Image } from "@/components/site-image";
import { TextModeToggle } from "@/components/text-mode";
import Link from "next/link";
import type { ReactNode } from "react";
import { HeaderNavigation } from "./header-navigation";
import { MobileNavigation } from "./mobile-navigation";
import { AccountMenu } from "./account-menu";
import { AccessibilityPanel } from "@/components/accessibility-panel";
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
          ? "absolute inset-x-4 top-5 mobile:inset-x-10"
          : variant === "inner"
            ? "relative mx-4 mt-5 w-[calc(100%-2rem)] max-w-[1840px] rounded-[24px] bg-[linear-gradient(249.78deg,#01211E_3.44%,#02534A_93.72%)] mobile:mx-10 mobile:w-[calc(100%-5rem)] mobile:rounded-[32px] desktop1250:mx-auto"
            : variant === "account"
              ? "relative mx-4 mt-5 w-[calc(100%-2rem)] max-w-[1835px] rounded-[24px] bg-[linear-gradient(249.78deg,#01211E_3.44%,#02534A_93.72%)] mobile:mx-6 mobile:w-[calc(100%-3rem)] mobile:rounded-[32px] desktop1250:mx-auto desktop1250:mt-5"
              : "relative mx-4 mt-5 rounded-[24px] bg-[linear-gradient(90deg,#01211E_0%,#01211E_18%,#013E37_55%,#013E37_100%)] mobile:mx-6 mobile:rounded-[32px] desktop1250:absolute desktop1250:inset-x-10 desktop1250:top-5 desktop1250:mx-0 desktop1250:mt-0",
      )}
    >
      <Container className={cn(
        "grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-6 desktop1250:grid-cols-12 desktop1250:gap-x-7.5",
        variant === "account" && "desktop1250:grid-cols-[124px_minmax(0,1fr)_auto]",
      )}>
        <Link
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
                  : "w-16 mobile:w-20 desktop1250:w-[124px]",
              )}
            />
          </span>
          <span className="text-mode-only">Медиацентр «Дом журналистики»</span>
        </Link>

        <div className={cn(
          "col-span-2 row-start-2 flex min-w-0 flex-col items-center gap-4 desktop1250:col-span-8 desktop1250:col-start-3 desktop1250:row-start-1 desktop1250:gap-8",
          variant === "account" && "desktop1250:col-span-1 desktop1250:col-start-2",
        )}>
          <div className="flex w-full max-w-[28.75rem] items-center gap-2">
            {search}
          </div>
          <HeaderNavigation />
        </div>

        <div className={cn(
          "col-start-2 row-start-1 justify-self-end desktop1250:col-span-2 desktop1250:col-start-11",
          variant === "account"
            ? "flex flex-col items-end gap-3 desktop1250:col-span-1 desktop1250:col-start-3"
            : "grid grid-cols-3 items-center justify-items-end gap-2 desktop1250:flex",
        )}>
          {variant === "account" ? (
            <>
              <div className="flex items-center gap-2">
                <TextModeToggle />
                <AccessibilityPanel triggerClassName="size-11 rounded-full desktop1250:size-13" />
                <div className="text-mode-hidden desktop1250:hidden">
                  <MobileNavigation />
                </div>
              </div>
              <AccountMenu />
            </>
          ) : (
            <>
              <TextModeToggle />
              <AccessibilityPanel triggerClassName="size-11 rounded-full desktop1250:size-13" />
              <div className="text-mode-hidden desktop1250:hidden">
                <MobileNavigation />
              </div>
              <Button
                variant="secondary"
                nativeButton={false}
                render={<Link href="/login" aria-label="Войти в аккаунт" />}
                className={`${typographyVariants["button-login"]} col-span-3 min-h-11 gap-3 rounded-full py-2 pr-1 pl-4 disabled:opacity-100 desktop1250:min-h-13 desktop1250:gap-4 desktop1250:py-1.5 desktop1250:pr-1.5`}
              >
                Войти
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary desktop1250:size-10"
                >
                  <Image
                    src="/images/header/account.svg"
                    alt=""
                    width={15}
                    height={17}
                    className="h-[17px] w-[15px]"
                  />
                </span>
              </Button>
            </>
          )}
        </div>
      </Container>
    </header>
  );
};

export { Header };
