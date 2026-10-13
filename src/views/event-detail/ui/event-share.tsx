import Link from "next/link";
import { seti } from "@/shared/const/footer.const";
import effects from "@/shared/assets/style/link-effects.module.css";
import { Typography } from "@/shared/ui/typography";

const socialLabels = {
  MAX: "MAX",
  TG: "Telegram",
  VK: "ВКонтакте",
  YD: "Яндекс Дзен",
} as const;

export function EventSocialLinks() {
  return (
    <section className="mt-8" aria-label="Социальные сети">
      <Typography variant="caption" className="mb-3 text-muted-foreground">
        Мы в социальных сетях:
      </Typography>
      <ul className="flex items-center gap-2.5">
        {seti.map(({ name, link, Icon }) => (
          <li key={name}>
            <Link
              href={link}
              aria-label={socialLabels[name as keyof typeof socialLabels]}
              className={`${effects.link} ${effects.social} bg-[#414141] text-white`}
            >
              <span
                className="flex size-12 items-center justify-center text-mode-hidden text-white"
                aria-hidden="true"
              >
                <Icon />
              </span>
              <span className="text-mode-only">
                {socialLabels[name as keyof typeof socialLabels]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
