import { CONTACTS } from "@/shared/const/contacts.const";
import effects from "@/shared/assets/style/link-effects.module.css";
import { cn } from "@/shared/lib/utils";

export function SocialLinks({ size = "large", className }: {
  size?: "small" | "large";
  className?: string;
}) {
  const iconClassName = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full bg-primary",
    size === "small" ? "size-11" : "size-[52px]",
  );

  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {CONTACTS.socials.map(({ name, href, Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className={cn(effects.link, effects.social, "inline-flex min-h-11 items-center")}
          >
            <span className={cn(iconClassName, "text-mode-hidden")}>
              <Icon aria-hidden="true" className="max-h-[70%] max-w-[70%]" style={{ color: "var(--primary-foreground)" }} />
            </span>
            <span className="text-mode-only">{name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
