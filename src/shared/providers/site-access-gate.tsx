"use client";

import type { ReactNode } from "react";
import { SiteStatus } from "@/components/site-status";
import { Button } from "@/shared/ui/button";
import { useSiteSettingsStore } from "@/state/site-settings.store";

export function SiteAccessGate({ children }: { children: ReactNode }) {
  const settings = useSiteSettingsStore((state) => state.settings);
  const status = useSiteSettingsStore((state) => state.status);

  if (status === "error") {
    return (
      <SiteStatus
        kind="error"
        action={<RetryButton>Повторить попытку</RetryButton>}
      />
    );
  }

  if (!settings) {
    return <SiteStatus kind="loading" />;
  }

  if (settings.is_public_part_closed) {
    return (
      <SiteStatus
        kind="maintenance"
        action={<RetryButton>Проверить доступность</RetryButton>}
      />
    );
  }

  return children;
}

function RetryButton({ children }: { children: ReactNode }) {
  return (
    <Button
      type="button"
      variant="default"
      className="min-h-12 gap-3 rounded-full px-7"
      onClick={() => window.location.reload()}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </Button>
  );
}
