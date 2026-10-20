import Link from "next/link";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { contentImageUrl } from "@/shared/lib/content-image-url";
import { Typography } from "@/shared/ui/typography";
import type { ContentNewspaperIssue } from "@/shared/types/model/content.type";
import { NewspaperCalendar } from "./newspaper-calendar";
import styles from "./newspaper-detail-page.module.css";

function pageHref(slug: string, page: number, date?: string) {
  const path = `/newspapers/${encodeURIComponent(slug)}`;
  const query = new URLSearchParams();
  if (page > 1) query.set("page", String(page));
  if (date) query.set("date", date);
  return `${path}${query.size ? `?${query}` : ""}#issues-heading`;
}

function IssueCover({ issue }: { issue: ContentNewspaperIssue }) {
  const image = contentImageUrl(issue.image);
  return (
    <div className={styles.coverStack}>
      <SiteImage
        src={image}
        alt={`Обложка выпуска №${issue.issue_number}`}
        textLinkLabel={`Обложка выпуска №${issue.issue_number}`}
        fill
        unoptimized
        sizes="(min-width: 1150px) 230px, (min-width: 768px) 30vw, 45vw"
        className={styles.coverImage}
      />
    </div>
  );
}

export function IssuesFeed({ issues, pagination, slug, date }: { issues: ContentNewspaperIssue[]; pagination: Pagination; slug: string; date?: string }) {
  const initialDate = [...issues].map((issue) => issue.date_iso).sort().at(-1) ?? new Date().toISOString().slice(0, 10);
  return (
    <section aria-labelledby="issues-heading" className={styles.issuesSection}>
      <Typography as="h2" variant="heading-medium" id="issues-heading" className="sr-only">Выпуски</Typography>
      <NewspaperCalendar key={date ?? initialDate} slug={slug} selectedDate={date} initialDate={initialDate} />

      {issues.length === 0 ? (
        <div className={styles.emptyIssues}>
          <span aria-hidden="true" data-text-decorative className={styles.emptyIssuesIcon}>
            <Newspaper size={32} strokeWidth={1.5} />
          </span>
          <Typography variant="heading-medium" className={styles.emptyIssuesText}>
            {date ? "За выбранную дату выпусков нет" : pagination.total > 0 ? "На этой странице выпусков нет" : "Выпуски этой редакции пока не загружены"}
          </Typography>
        </div>
      ) : (
        <ul data-a11y-content-grid data-text-flow className={styles.issuesGrid}>
          {issues.map((issue) => {
            const file = issue.file?.url ? issue.file : null;
            const extension = (
              file?.extension?.trim().replace(/^\./, "") ||
              file?.name.match(/\.([^.]+)$/)?.[1] ||
              ""
            ).toLowerCase();
            const isPdf = extension === "pdf";
            const fileHref = file
              ? `/api/newspapers/file?${new URLSearchParams({
                  path: file.url,
                  name: file.name || `issue-${issue.id}`,
                  extension,
                })}`
              : null;
            return (
              <li key={issue.id}>
                <article className={styles.issueCard}>
                  <IssueCover issue={issue} />
                  <Typography as="h3" variant="small" className={styles.issueTitle}>{issue.title}</Typography>
                  <Typography as="span" variant="caption" className={styles.issueNumber}>№ {issue.issue_number}</Typography>
                  <Typography as="time" variant="caption" dateTime={issue.date_iso} className={styles.issueDate}>
                    Дата выхода: {issue.date}
                  </Typography>
                  {issue.description && <Typography variant="body" className={styles.issueDescription}>{issue.description}</Typography>}
                  {fileHref && (
                    <a
                      href={fileHref}
                      className={styles.issueFile}
                      target={isPdf ? "_blank" : undefined}
                      rel={isPdf ? "noopener noreferrer" : undefined}
                      download={isPdf ? undefined : file?.name || `issue-${issue.id}`}
                      aria-label={isPdf
                        ? `Открыть PDF выпуска «${issue.title}» в новой вкладке`
                        : `Скачать файл выпуска «${issue.title}»`}
                    >
                      {isPdf ? "Открыть файл выпуска" : "Скачать файл выпуска"}
                    </a>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {pagination.last_page > 1 && <nav aria-label="Страницы выпусков" className={styles.pagination}>
        {pagination.current_page > 1 && <Link href={pageHref(slug, pagination.current_page - 1, date)} aria-label="Предыдущая страница" className={styles.pageArrow}><ChevronLeft aria-hidden="true" size={18} /></Link>}
        {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map((page) => (
          <Link key={page} href={pageHref(slug, page, date)} aria-label={`Страница ${page}`} aria-current={page === pagination.current_page ? "page" : undefined} className={styles.pageNumber}>{page}</Link>
        ))}
        {pagination.current_page < pagination.last_page && <Link href={pageHref(slug, pagination.current_page + 1, date)} aria-label="Следующая страница" className={styles.pageArrow}><ChevronRight aria-hidden="true" size={18} /></Link>}
      </nav>}
    </section>
  );
}
