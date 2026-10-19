import Link from "next/link";
import { FileText } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import type {
  ContentDocument,
  ContentDocumentSection,
} from "@/shared/types/model/content.type";
import { DownloadButton } from "./download-button";
import styles from "./documents-page.module.css";

function documentDate(value: string) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : undefined;
}

function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`;
  const unit = bytes < 1024 ** 2 ? "КБ" : bytes < 1024 ** 3 ? "МБ" : "ГБ";
  const value = bytes / (unit === "КБ" ? 1024 : unit === "МБ" ? 1024 ** 2 : 1024 ** 3);
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(value)} ${unit}`;
}

function DocumentRow({ document }: { document: ContentDocument }) {
  const size = document.file?.size_bytes == null ? null : fileSize(document.file.size_bytes);
  const extension = document.file?.extension?.replace(/^\./, "").toUpperCase() || null;

  return (
    <li className={styles.documentRow}>
      <span aria-hidden="true" className={styles.fileIcon}>
        <FileText size={18} strokeWidth={1.7} />
      </span>
      <div className={styles.documentInfo}>
        <Typography as="p" variant="body" className={styles.documentTitle} title={document.title}>
          {document.title}
        </Typography>
        {(document.published_at || size || extension) && (
          <div className={styles.documentMetadata}>
            {document.published_at && (
              <time dateTime={documentDate(document.published_at)}>{`от ${document.published_at}`}</time>
            )}
            {document.published_at && (size || extension) && <span aria-hidden="true">·</span>}
            {size && <span>{size}</span>}
            {size && extension && <span aria-hidden="true">·</span>}
            {extension && <span>{extension}</span>}
          </div>
        )}
      </div>
      <DownloadButton title={document.title} file={document.file} />
    </li>
  );
}

type DocumentsPageProps = {
  sections: ContentDocumentSection[];
  error?: boolean;
};

function DocumentsPage({ sections, error = false }: DocumentsPageProps) {
  const populatedSections = sections.filter((section) => section.items.length > 0);

  return (
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
            {error ? (
              <p role="alert">Не удалось загрузить документы. Попробуйте обновить страницу.</p>
            ) : populatedSections.length === 0 ? (
              <p>Документы пока не опубликованы.</p>
            ) : (
              populatedSections.map((section, index) => (
                <ScrollReveal key={section.id ?? section.slug ?? `section-${index}`}>
                  <section
                    aria-labelledby={`document-group-${index}`}
                    className={styles.documentGroup}
                  >
                    {index > 0 && <div aria-hidden="true" className={styles.divider} />}
                    <Typography
                      as="h2"
                      variant="heading-small"
                      id={`document-group-${index}`}
                      className={styles.groupTitle}
                    >
                      {section.title}
                    </Typography>
                    <ul className={styles.documentList}>
                      {section.items.map((document) => (
                        <DocumentRow key={document.id} document={document} />
                      ))}
                    </ul>
                  </section>
                </ScrollReveal>
              ))
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

export { DocumentsPage };
