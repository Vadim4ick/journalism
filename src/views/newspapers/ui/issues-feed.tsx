"use client";

import { useState } from "react";
import { Newspaper } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { Typography } from "@/shared/ui/typography";
import type { NewspaperIssue } from "../model/newspapers";
import styles from "./newspaper-detail-page.module.css";

function IssueCover() {
  return (
    <div aria-hidden="true" data-text-decorative className={styles.coverStack}>
      <SiteImage
        src="/images/gazeti/shablon.png"
        alt=""
        fill
        sizes="(min-width: 1150px) 230px, (min-width: 768px) 30vw, 45vw"
        className={styles.coverImage}
      />
    </div>
  );
}

export function IssuesFeed({ issues }: { issues: readonly NewspaperIssue[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const visibleIssues = selectedDate ? issues.filter((issue) => issue.dateTime === selectedDate) : issues;

  return (
    <section aria-labelledby="issues-heading" className={styles.issuesSection}>
      <Typography as="h2" variant="heading-medium" id="issues-heading" className="sr-only">Выпуски</Typography>
      {issues.length === 0 ? (
        <div className={styles.emptyIssues}>
          <span aria-hidden="true" data-text-decorative className={styles.emptyIssuesIcon}>
            <Newspaper size={32} strokeWidth={1.5} />
          </span>
          <Typography variant="heading-medium" className={styles.emptyIssuesText}>
            Выпуски этой редакции пока не загружены
          </Typography>
        </div>
      ) : (
        <>
          <div role="group" aria-label="Фильтр выпусков по дате" className={styles.dateFilters}>
            <button type="button" aria-pressed={selectedDate === null} onClick={() => setSelectedDate(null)} className={styles.dateFilter}>Все</button>
            {issues.map((issue) => (
              <button
                type="button"
                key={issue.id}
                aria-pressed={selectedDate === issue.dateTime}
                onClick={() => setSelectedDate(issue.dateTime)}
                className={styles.dateFilter}
              >
                {issue.date}
              </button>
            ))}
          </div>
          <p role="status" className="sr-only">Показано выпусков: {visibleIssues.length}</p>
          <ul data-a11y-content-grid data-text-flow className={styles.issuesGrid}>
            {visibleIssues.map((issue) => (
              <li key={issue.id}>
                <article className={styles.issueCard}>
                  <IssueCover />
                  <Typography as="h3" variant="small" className={styles.issueTitle}>{issue.title}</Typography>
                  <Typography as="time" variant="caption" dateTime={issue.dateTime} className={styles.issueDate}>
                    Дата выхода: {issue.date}
                  </Typography>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
