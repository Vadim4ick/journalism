"use client";

import { Max } from "@/shared/icons/seti/max";
import { Tg } from "@/shared/icons/seti/tg";
import { Vk } from "@/shared/icons/seti/vk";
import { Yd } from "@/shared/icons/seti/yd";
import { useSiteSettingsStore } from "@/state/site-settings.store";
import effects from "@/shared/assets/style/link-effects.module.css";
import { cn } from "@/shared/lib/utils";

const socialMetadata = {
  vk: { name: "ВКонтакте", Icon: Vk },
  max: { name: "MAX", Icon: Max },
  telegram: { name: "Telegram", Icon: Tg },
  dzen: { name: "Дзен", Icon: Yd },
};

export function SocialLinks({
  size = "large",
  className,
}: {
  size?: "small" | "large";
  className?: string;
}) {
  const socials = useSiteSettingsStore((state) => state.settings?.socials);
  if (!socials?.length) return null;

  const iconClassName = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full bg-primary",
    size === "small" ? "size-11" : "size-[52px]",
  );

  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {socials.map(({ type, value }, index) => {
        const metadata = socialMetadata[type as keyof typeof socialMetadata];
        const name = metadata?.name ?? type;
        const Icon = metadata?.Icon;
        if (!/^https?:\/\//i.test(value)) return null;
        return (
          <li key={`${type}-${index}`}>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className={cn(effects.link, effects.social, "inline-flex min-h-11 items-center")}
            >
              {Icon ? (
                <span className={cn(iconClassName, "text-mode-hidden")}>
                  <Icon
                    aria-hidden="true"
                    className="max-h-[70%] max-w-[70%]"
                    style={{ color: "var(--primary-foreground)" }}
                  />
                </span>
              ) : (
                <span className="text-mode-hidden">{name}</span>
              )}
              <span className="text-mode-only">{name}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
