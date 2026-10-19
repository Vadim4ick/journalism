"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { typographyVariants } from "@/shared/ui/typography";
import { useAuthStore } from "@/state/auth.store";
import { cn } from "@/shared/lib/utils";
import { AccountMenu } from "./account-menu";

export function HeaderAuthControl({ publicLayout = false }: { publicLayout?: boolean }) {
  const initialized = useAuthStore((state) => state.initialized);
  const hasSession = useAuthStore((state) => state.hasSession);

  if (!initialized) return null;

  return (
    <div className={cn(
      "col-span-4 justify-self-end desktop1250:col-span-1",
      hasSession && publicLayout && "desktop1250:flex desktop1250:basis-full desktop1250:justify-end",
    )}>
      {hasSession ? (
        <AccountMenu />
      ) : (
        <Button
          variant="secondary"
          nativeButton={false}
          render={<Link href="/login" aria-label="Войти в аккаунт" />}
          className={`${typographyVariants["button-login"]} min-h-11 gap-3 rounded-full py-2 pr-1 pl-4 disabled:opacity-100 desktop1250:min-h-13 desktop1250:gap-4 desktop1250:py-1.5 desktop1250:pr-1.5`}
        >
          Войти
          <span
            aria-hidden="true"
            className="text-mode-hidden flex size-9 shrink-0 items-center justify-center rounded-full bg-primary desktop1250:size-10"
            style={{ color: "var(--primary-foreground)" }}
          >
            <svg width="15" height="17" viewBox="0 0 14.8333 16.5" fill="none" aria-hidden="true">
              <path d="M0.75 15.75V14.9167C0.75 12.1583 2.99167 9.91667 5.75 9.91667H9.08333C11.8417 9.91667 14.0833 12.1583 14.0833 14.9167V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.41634 7.41667C5.57467 7.41667 4.08301 5.925 4.08301 4.08333C4.08301 2.24167 5.57467 0.75 7.41634 0.75C9.25801 0.75 10.7497 2.24167 10.7497 4.08333C10.7497 5.925 9.25801 7.41667 7.41634 7.41667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Button>
      )}
    </div>
  );
}
