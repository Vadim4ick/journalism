import Link from "next/link";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import type { ContentLegalDocumentDetail } from "@/shared/types/model/content.type";
import styles from "./legal-document-page.module.css";

export function LegalDocumentPage({ document }: { document: ContentLegalDocumentDetail }) {
  return (
    <Container>
      <article data-text-flow className={styles.article}>
        <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
          <Link href="/">Главная</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{document.title}</span>
        </nav>

        <Typography as="h1" variant="heading-medium" className={styles.title}>
          {document.title}
        </Typography>

        {document.description && <p className={styles.description}>{document.description}</p>}
        {document.detail_text ? (
          <div className={styles.body} dangerouslySetInnerHTML={{ __html: document.detail_text }} />
        ) : (
          <p>Текст документа пока не опубликован.</p>
        )}
      </article>
    </Container>
  );
}
