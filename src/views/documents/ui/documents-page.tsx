import Link from "next/link";
import { FileText } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import { DownloadButton } from "./download-button";
import styles from "./documents-page.module.css";

type DocumentItem = {
  title: string;
  date: string;
  dateTime: string;
  size: string;
  format: "PDF" | "DOCX";
};

type DocumentGroup = {
  title: string;
  documents: DocumentItem[];
};

const DOCUMENT_GROUPS: DocumentGroup[] = [
  {
    title: "Защита персональных данных",
    documents: [
      {
        title: "Политика защиты и обработки персональных данных ГКУ КК «Медиацентр „Дом журналистики“»",
        date: "19 марта 2026",
        dateTime: "2026-03-19",
        size: "10,13 МБ",
        format: "PDF",
      },
    ],
  },
  {
    title: "Нормативные правовые акты, определяющие полномочия, задачи и функции учреждения",
    documents: [
      {
        title: "Перечень нормативных правовых актов, определяющих полномочия, задачи и функции гос...",
        date: "19 марта 2026",
        dateTime: "2026-03-19",
        size: "15 КБ",
        format: "DOCX",
      },
      {
        title: "Устав государственного казенного учреждения Краснодарского края «Медиацентр „Дом...",
        date: "19 февраля 2024",
        dateTime: "2024-02-19",
        size: "5,17 МБ",
        format: "PDF",
      },
      {
        title: "Изменение в Устав государственного казенного учреждения Краснодарского края «Медиа...",
        date: "20 июня 2024",
        dateTime: "2024-06-20",
        size: "190 КБ",
        format: "PDF",
      },
      {
        title: "Изменение в Устав государственного казенного учреждения Краснодарского края «Медиа...",
        date: "16 августа 2024",
        dateTime: "2024-08-16",
        size: "198 КБ",
        format: "PDF",
      },
      {
        title: "Изменение в Устав государственного казенного учреждения Краснодарского края «Медиа...",
        date: "28 октября 2024",
        dateTime: "2024-10-28",
        size: "1,76 МБ",
        format: "PDF",
      },
      {
        title: "Изменение в Устав государственного казенного учреждения Краснодарского края «Медиа...",
        date: "19 февраля 2025",
        dateTime: "2025-02-19",
        size: "3,96 МБ",
        format: "PDF",
      },
      {
        title: "Изменение в Устав государственного казенного учреждения Краснодарского края «Медиа...",
        date: "28 октября 2025",
        dateTime: "2025-10-28",
        size: "215 КБ",
        format: "PDF",
      },
    ],
  },
  {
    title: "Противодействие коррупции",
    documents: [
      {
        title: "Кодекс этики и служебного поведения государственного казенного учреждения Краснодарского края...",
        date: "26 марта 2024",
        dateTime: "2024-03-26",
        size: "4,37 МБ",
        format: "PDF",
      },
      {
        title: "Положение о комиссии по противодействию коррупции в государственном казенном учре...",
        date: "26 марта 2024",
        dateTime: "2024-03-26",
        size: "3,39 МБ",
        format: "PDF",
      },
      {
        title: "Положение об антикоррупционной политике государственного казенного учреждения К...",
        date: "26 марта 2024",
        dateTime: "2024-03-26",
        size: "12,37 МБ",
        format: "PDF",
      },
    ],
  },
];

function DocumentRow({ document }: { document: DocumentItem }) {
  return (
    <li className={styles.documentRow}>
      <span aria-hidden="true" className={styles.fileIcon}>
        <FileText size={18} strokeWidth={1.7} />
      </span>
      <div className={styles.documentInfo}>
        <Typography as="p" variant="body" className={styles.documentTitle} title={document.title}>
          {document.title}
        </Typography>
        <div className={styles.documentMetadata}>
          <time dateTime={document.dateTime}>{`от ${document.date}`}</time>
          <span aria-hidden="true">·</span>
          <span>{document.size}</span>
          <span aria-hidden="true">·</span>
          <span>{document.format}</span>
        </div>
      </div>
      <div className={styles.downloadAction}>
        <span className={styles.downloadLabel}>Скачать</span>
        <DownloadButton title={document.title} />
      </div>
    </li>
  );
}

const DocumentsPage = () => (
  <>
    <section aria-labelledby="documents-heading" className={styles.heroSection}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
            <Link
              href="/"
              className="rounded-sm underline-offset-4 hover:underline focus-visible:underline"
            >
              Главная
            </Link>
            <span aria-hidden="true" className={styles.breadcrumbSeparator}>
              <SiteImage
                src="/images/news/breadcrumb.svg"
                alt=""
                width={15}
                height={15}
                className="-rotate-90"
              />
              <span className="text-mode-only">›</span>
            </span>
            <span aria-current="page">Документы</span>
          </nav>
          <Typography as="h1" variant="hero-title" id="documents-heading">
            Документы
          </Typography>
        </div>
      </div>
    </section>

    <section aria-label="Документы учреждения" className={styles.documentsSection}>
      <Container className={styles.container}>
        <div className={styles.documentsPanel}>
          {DOCUMENT_GROUPS.map((group, groupIndex) => (
            <ScrollReveal key={group.title}>
            <section
              aria-labelledby={`document-group-${groupIndex}`}
              className={styles.documentGroup}
            >
              {groupIndex > 0 && <div aria-hidden="true" className={styles.divider} />}
              <Typography
                as="h2"
                variant="heading-small"
                id={`document-group-${groupIndex}`}
                className={styles.groupTitle}
              >
                {group.title}
              </Typography>
              <ul className={styles.documentList}>
                {group.documents.map((document, documentIndex) => (
                  <DocumentRow key={`${document.dateTime}-${documentIndex}`} document={document} />
                ))}
              </ul>
            </section>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  </>
);

export { DocumentsPage };
