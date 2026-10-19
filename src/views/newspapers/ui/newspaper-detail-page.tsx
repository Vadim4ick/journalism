import Link from "next/link";
import { Info } from "lucide-react";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import type { ContentNewspaper, ContentNewspaperIssue } from "@/shared/types/model/content.type";
import { NewspaperLogo } from "./newspaper-logo";
import { IssuesFeed } from "./issues-feed";
import styles from "./newspaper-detail-page.module.css";

function websiteUrl(value: string) {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function NewspaperDetailPage({ newspaper, issues, pagination, date }: { newspaper: ContentNewspaper; issues: ContentNewspaperIssue[]; pagination: Pagination; date?: string }) {
  const website = newspaper.website ? websiteUrl(newspaper.website) : undefined;
  return (
    <Container>
      <article className={styles.article}>
        <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
          <Link href="/" className="hover:underline focus-visible:underline">Главная</Link>
          <span aria-hidden="true">›</span>
          <Link href="/newspapers" className="hover:underline focus-visible:underline">Газетный киоск</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{newspaper.name}</span>
        </nav>

        <ScrollReveal>
          <header className={styles.publisherCard}>
            <div data-text-decorative className={styles.logoPanel}>
              <NewspaperLogo newspaper={newspaper} />
            </div>
            <div className={styles.publisherContent}>
              <Typography as="h1" variant="heading-medium" className={styles.title}>{newspaper.name}</Typography>
              {newspaper.description && <Typography variant="body" className={styles.description}>{newspaper.description}</Typography>}
              {website || newspaper.municipality || newspaper.socials.length > 0 ? (
                <dl className={styles.publisherMeta}>
                  {website && (
                    <div>
                      <dt>Сайт:</dt>
                      <dd><a href={website} className={styles.website}>{newspaper.website}</a></dd>
                    </div>
                  )}
                  {newspaper.municipality && (
                    <div>
                      <dt>Муниципальный округ:</dt>
                      <dd>{newspaper.municipality}</dd>
                    </div>
                  )}
                  {newspaper.socials.length > 0 && (
                    <div>
                      <dt>Соц. сети:</dt>
                      <dd>{newspaper.socials.join(", ")}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <div className={styles.missingDetails}>
                  <span aria-hidden="true" data-text-decorative className={styles.missingDetailsIcon}>
                    <Info size={22} strokeWidth={1.75} />
                  </span>
                  <Typography variant="heading-small">Информация о редакции пока не добавлена</Typography>
                </div>
              )}
            </div>
          </header>
        </ScrollReveal>

        <ScrollReveal><IssuesFeed issues={issues} pagination={pagination} slug={newspaper.slug} date={date} /></ScrollReveal>
      </article>
    </Container>
  );
}
