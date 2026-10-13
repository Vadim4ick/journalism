import { CONTACTS } from "@/shared/const/contacts.const";
import effects from "@/shared/assets/style/link-effects.module.css";
import { cn } from "@/shared/lib/utils";

export function SocialLinks({ size = "large", whiteIcons = false, className }: {
  size?: "small" | "large";
  whiteIcons?: boolean;
  className?: string;
}) {
  const iconClassName = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
    size === "small" ? "size-11" : "size-[52px]",
  );

  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {CONTACTS.socials.map(({ name, href, Icon }) => (
        <li key={name}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className={cn(effects.link, effects.social, "inline-flex min-h-11 items-center")}
            >
              <span className={cn(iconClassName, "text-mode-hidden")}>
                <Icon aria-hidden="true" className="max-h-[70%] max-w-[70%]" style={whiteIcons ? { color: "var(--primary-foreground)" } : undefined} />
              </span>
              <span className="text-mode-only">{name}</span>
            </a>
          ) : (
            <span className="inline-flex min-h-11 items-center" aria-label={`${name}: ссылка не указана`}>
              <span className={cn(iconClassName, "text-mode-hidden")}>
                <Icon aria-hidden="true" className="max-h-[70%] max-w-[70%]" style={whiteIcons ? { color: "var(--primary-foreground)" } : undefined} />
              </span>
              <span className="text-mode-only">{name}: ссылка не указана</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
