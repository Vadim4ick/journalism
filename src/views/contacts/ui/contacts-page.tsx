import Link from "next/link";
import { FooterMap } from "@/components/footer";
import { SocialLinks } from "@/components/social-links";
import { CONTACTS } from "@/shared/const/contacts.const";
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

const generalDetails: Detail[] = [
  {
    label: "Полное наименование",
    value: "Государственное казенное учреждение Краснодарского края «Медиацентр „Дом журналистики“»",
  },
  { label: "Сокращенное наименование", value: "ГКУ КК «Дом журналистики»" },
  {
    label: "Почтовый адрес",
    value: "350014, Российская Федерация, Краснодарский край, город Краснодар, ул. Красная, д. 35",
  },
  {
    label: "Фактический адрес",
    value: "г. Краснодар, ул. им. Гоголя, 70 / ул. Красноармейская, 60",
  },
  { label: "Email", value: CONTACTS.email, href: `mailto:${CONTACTS.email}` },
  { label: "Телефон", value: "8 (861) 997-62-61", href: "tel:+78619976261" },
];

const registrationDetails: Detail[] = [
  { label: "ИНН", value: "2308296019" },
  { label: "ОГРН", value: "1242300010501" },
  { label: "КПП", value: "230801001" },
  { label: "ОКПО", value: "75629431" },
];

const managementDetails: Detail[] = [
  { label: "Директор", value: "Косарева Анна Владимировна" },
  { label: "Заместитель директора", value: "Лукинская Ирина Владимировна" },
];

const founderDetails: Detail[] = [
  {
    label: "Наименование",
    value: "Департамент информационной политики Краснодарского края",
  },
  { label: "Email", value: "dsmi@krasnodar.ru", href: "mailto:dsmi@krasnodar.ru" },
  { label: "Телефон", value: "8 (861) 214-58-34", href: "tel:+78612145834" },
  { label: "Руководитель департамента", value: "Навазова Галина Александровна" },
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
  return (
    <Container className={styles.container}>
      <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
        <Link href="/">Главная</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Контакты</span>
      </nav>

      <section aria-labelledby="contacts-heading">
        <Typography as="h1" variant="section-title" id="contacts-heading" className={styles.heading}>
          Контакты
        </Typography>
        <div className={styles.contactsGrid} data-a11y-content-grid>
          <ScrollReveal className={styles.contactInfo}>
            <div>
              <Typography variant="small" className={styles.label}>Режим работы учреждения:</Typography>
              <ul className={styles.hours}>
                {CONTACTS.hours.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
            <div className={styles.quickContacts}>
              <div>
                <Typography variant="small" className={styles.label}>Телефон:</Typography>
                <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>
              </div>
              <div>
                <Typography variant="small" className={styles.label}>Почта:</Typography>
                <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
              </div>
            </div>
            <div>
              <Typography variant="small" className={styles.label}>Адрес:</Typography>
              <p>{CONTACTS.address}</p>
            </div>
            <div>
              <Typography variant="small" className={styles.label}>Мы в соцсетях:</Typography>
              <SocialLinks size="small" whiteIcons className={styles.socials} />
            </div>
          </ScrollReveal>

          <ScrollReveal className={styles.map}>
            <FooterMap />
          </ScrollReveal>
        </div>
      </section>

      <section aria-labelledby="requisites-heading" id="requisites" className={styles.requisitesSection}>
        <Typography as="h2" variant="section-title" id="requisites-heading" className={styles.heading}>
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
