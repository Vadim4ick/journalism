"use client";

import { SocialLinks } from "@/components/social-links";
import { Logo } from "@/shared/icons/logo";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import effects from "@/shared/assets/style/link-effects.module.css";
import Link from "next/link";
import { FooterNavigation } from "./footer-navigation";
import { FooterMap } from "./footer-map";
import { FooterPolicyLink } from "./footer-policy-link";
import { useSiteSettingsStore } from "@/state/site-settings.store";

const Footer = () => {
  const settings = useSiteSettingsStore((state) => state.settings);
  const status = useSiteSettingsStore((state) => state.status);
  const contactStatus = status === "error" ? "Контакты временно недоступны" : "Загрузка контактов…";
  const hours = settings?.contacts.work_hours.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) ?? [];
  return (
    <footer
      data-site-footer
      data-text-flow
      className="bg-[linear-gradient(252deg,#01211e_3.44%,#02534a_93.72%)] pt-15 pb-5 text-footer-foreground"
    >
      <Container className="flex flex-col gap-10 mobile:gap-12">
        <div className="flex flex-col items-center justify-between gap-8 desktop1250:flex-row">
          <Link
            href="/"
            aria-label="Дом журналистики — главная"
            className={`${effects.link} ${effects.footerLogo} shrink-0`}
          >
            <span className="text-mode-hidden"><Logo /></span>
            <span className="text-mode-only">Медиацентр «Дом журналистики»</span>
          </Link>
          <FooterNavigation />
        </div>

        <div className="grid gap-10 tablet:grid-cols-2 desktop1250:grid-cols-[1.3fr_1fr_2.5fr] desktop1250:gap-12">
          <div className="flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-5">
              <Typography variant="footer-label" className="text-footer-foreground/60">
                Режим работы учреждения:
              </Typography>
              <ul className="flex flex-col gap-4">
                {hours.map((line) => (
                  <Typography as="li" variant="footer-body" key={line}>{line}</Typography>
                ))}
                {!settings && <Typography as="li" variant="footer-body">{contactStatus}</Typography>}
              </ul>
            </div>
            <Link href="/contacts#requisites" className={`${effects.link} ${effects.text} w-fit text-base font-semibold underline underline-offset-2 mobile:text-lg`}>
              Реквизиты учреждения
            </Link>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                <Typography variant="footer-label" className="text-footer-foreground/60">Адрес:</Typography>
                <Typography variant="footer-body">{settings?.contacts.address ?? contactStatus}</Typography>
              </div>
              <div className="flex flex-col gap-5">
                <Typography variant="footer-label" className="text-footer-foreground/60">Социальные сети:</Typography>
                <SocialLinks />
              </div>
            </div>
            <FooterPolicyLink />
          </div>

          <div className="flex flex-col gap-5 tablet:col-span-2 desktop1250:col-span-1">
            <Typography variant="footer-label" className="text-footer-foreground/60">Мы на карте:</Typography>
            <div className="relative aspect-[716/267] overflow-hidden rounded-[20px]">
              <FooterMap />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-5 opacity-80 desktop1250:flex-row desktop1250:items-center desktop1250:justify-between">
          <Typography as="span" variant="footer-caption">© {new Date().getFullYear()} Все права защищены.</Typography>
          <Typography as="span" variant="footer-caption">{settings?.organization.short_name}</Typography>
          <Typography as="span" variant="footer-caption">Разработали в [ДИЗАЙН / КОД]</Typography>
        </div>
      </Container>
    </footer>
  );
};

export { Footer };
