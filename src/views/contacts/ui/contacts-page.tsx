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

const fixedGeneralDetails: Detail[] = [
  {
    label: "Юридический адрес",
    value:
      "350014, Российская Федерация, Краснодарский край, город Краснодар, ул. Красная, д. 35",
  },
];

const registrationDetails: Detail[] = [
  { label: "ИНН", value: "2308296019" },
  { label: "ОГРН", value: "1242300010501" },
  { label: "КПП", value: "230801001" },
  { label: "ОКПО", value: "75629431" },
];

const managementDetails: Detail[] = [
  { label: "Директор", value: "Косарева Анна Владимировна" },
  { label: "Заместитель директора", value: "Чебыкина Екатерина Владимировна" },
];

const founderDetails: Detail[] = [
  {
    label: "Наименование",
    value: "Департамент информационной политики Краснодарского края",
  },
  {
    label: "Email",
    value: "dsmi@krasnodar.ru",
    href: "mailto:dsmi@krasnodar.ru",
  },
  { label: "Телефон", value: "8 (861) 214-58-34", href: "tel:+78612145834" },
  {
    label: "Руководитель департамента",
    value: "Навазова Галина Александровна",
  },
];

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
  const contacts = settings?.contacts;
  const hours = contacts?.work_hours.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) ?? [];
  const generalDetails: Detail[] = settings ? [
    { label: "Полное наименование", value: settings.organization.full_name },
    { label: "Сокращенное наименование", value: settings.organization.short_name },
    ...fixedGeneralDetails,
    { label: "Фактический адрес", value: contacts?.address ?? "" },
    { label: "Email", value: contacts?.email ?? "", href: contacts?.email ? `mailto:${contacts.email}` : undefined },
    ...(contacts?.phones.map(({ value }, index) => ({
      label: contacts.phones.length === 1 ? "Телефон" : `Телефон ${index + 1}`,
      value,
      href: `tel:${value.replace(/[^+\d]/g, "")}`,
    })) ?? []),
  ] : fixedGeneralDetails;

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
        </ScrollReveal>
      </section>
    </Container>
  );
}
