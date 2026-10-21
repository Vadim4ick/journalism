"use client";

import Link from "next/link";
import { FooterMap } from "@/components/footer";
import { SocialLinks } from "@/components/social-links";
import { useSiteSettingsStore } from "@/state/site-settings.store";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import { Requisite } from "./requisite";
import styles from "./contacts-page.module.css";

type Detail = {
  label: string;
  value: string;
  href?: string;
};

function DetailList({ items }: { items: Detail[] }) {
  return (
    <dl className={styles.detailList}>
      {items.map(({ label, value, href }) => (
        <div className={styles.detailRow} key={label}>
          <dt>{label}</dt>
          <dd>{href ? <a href={href}>{value}</a> : value}</dd>
        </div>
      ))}
    </dl>
  );
}
export function ContactsPage() {
  const settings = useSiteSettingsStore((state) => state.settings);
  const status = useSiteSettingsStore((state) => state.status);
  const organization = status === "success" ? settings?.organization : undefined;
  const contacts = settings?.contacts;
  const hours = contacts?.work_hours.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) ?? [];
  const generalDetails: Detail[] = organization ? [
    { label: "Полное наименование", value: organization.full_name },
    { label: "Сокращенное наименование", value: organization.short_name },
    { label: "Фактический адрес", value: contacts?.address ?? "" },
    { label: "Email", value: contacts?.email ?? "", href: contacts?.email ? `mailto:${contacts.email}` : undefined },
    ...(contacts?.phones.map(({ value }, index) => ({
      label: contacts.phones.length === 1 ? "Телефон" : `Телефон ${index + 1}`,
      value,
      href: `tel:${value.replace(/[^+\d]/g, "")}`,
    })) ?? []),
  ] : [];
  const managementDetails: Detail[] = organization ? [
    { label: "Директор", value: organization.management.director },
    { label: "Заместитель директора", value: organization.management.deputy_director },
  ] : [];
  const bankDetails: Detail[] = organization ? [
    { label: "Банк", value: organization.bank.name },
    { label: "БИК", value: organization.bank.bik },
    { label: "Расчётный счёт", value: organization.bank.account },
    { label: "Корреспондентский счёт", value: organization.bank.correspondent_account },
  ].filter((item): item is Detail => Boolean(item.value)) : [];
  const registrationDetails: Detail[] = organization ? [
    { label: "ИНН", value: organization.registration.inn },
    { label: "ОГРН", value: organization.registration.ogrn },
    { label: "КПП", value: organization.registration.kpp },
    { label: "ОКПО", value: organization.registration.okpo },
    ...bankDetails,
  ] : [];
  const founderDetails: Detail[] = organization ? [
    { label: "Наименование", value: organization.founder.name },
    { label: "Email", value: organization.founder.email, href: `mailto:${organization.founder.email}` },
    { label: "Телефон", value: organization.founder.phone, href: `tel:${organization.founder.phone.replace(/[^+\d]/g, "")}` },
    { label: "Руководитель департамента", value: organization.founder.director },
  ] : [];

  return (
    <Container className={styles.container}>
      <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
        <Link href="/">Главная</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Контакты</span>
      </nav>

      <section aria-labelledby="contacts-heading">
        <Typography
          as="h1"
          variant="section-title"
          id="contacts-heading"
          className={styles.heading}
        >
          Контакты
        </Typography>
        <div className={styles.contactsGrid} data-a11y-content-grid>
          <ScrollReveal className={styles.contactInfo}>
            {!contacts && (
              <p role="status">
                {status === "error" ? "Не удалось загрузить контакты." : "Загрузка контактов…"}
              </p>
            )}
            {contacts && <>
            <div>
              <Typography variant="small" className={styles.label}>
                Режим работы учреждения:
              </Typography>
              <ul className={styles.hours}>
                {hours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className={styles.quickContacts}>
              <div>
                <Typography variant="small" className={styles.label}>
                  Телефон:
                </Typography>
                <ul>
                  {contacts.phones.map(({ value }, index) => (
                    <li key={`${value}-${index}`}>
                      <a href={`tel:${value.replace(/[^+\d]/g, "")}`}>{value}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Typography variant="small" className={styles.label}>
                  Почта:
                </Typography>
                <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
              </div>
            </div>
            <div>
              <Typography variant="small" className={styles.label}>
                Адрес:
              </Typography>
              <p>{contacts.address}</p>
            </div>
            <div>
              <Typography variant="small" className={styles.label}>
                Мы в соцсетях:
              </Typography>
              <SocialLinks size="small" className={styles.socials} />
            </div>
            </>}
          </ScrollReveal>

          <ScrollReveal className={styles.map}>
            <FooterMap />
          </ScrollReveal>
        </div>
      </section>

      <section
        aria-labelledby="requisites-heading"
        id="requisites"
        className={styles.requisitesSection}
      >
        <Typography
          as="h2"
          variant="section-title"
          id="requisites-heading"
          className={styles.heading}
        >
          Реквизиты учреждения
        </Typography>
        <ScrollReveal className={styles.requisitesPanel}>
          {organization ? <>
            <Requisite title="Общая информация">
              <DetailList items={generalDetails} />
            </Requisite>
            <Requisite title="Руководство">
              <DetailList items={managementDetails} />
            </Requisite>
            <Requisite title="Банковские и регистрационные данные">
              <DetailList items={registrationDetails} />
            </Requisite>
            <Requisite title="Учредитель">
              <DetailList items={founderDetails} />
            </Requisite>
          </> : (
            <p role="status">
              {status === "error" || status === "success"
                ? "Не удалось загрузить реквизиты учреждения."
                : "Загрузка реквизитов учреждения…"}
            </p>
          )}
        </ScrollReveal>
      </section>
    </Container>
  );
}
