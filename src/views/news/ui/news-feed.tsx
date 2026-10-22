"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { NewsCard, newsCardData } from "@/components/news-card";
import { ContentEmptyState } from "@/components/content-empty-state";
import { Button } from "@/shared/ui/button";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import { newsDate } from "@/shared/lib/news-date";
import type { ContentNews } from "@/shared/types/model/content.type";
import { NewsCalendar } from "./news-calendar";
import { formatDateRange, type NewsDateRange } from "../model/date-range";
import styles from "./news-page.module.css";

function pageHref(page: number, selected?: NewsDateRange) {
  const query = new URLSearchParams();
  if (selected?.from) query.set("date_from", selected.from);
  if (selected?.to) query.set("date_to", selected.to);
  if (page > 1) query.set("page", String(page));
  const search = query.toString();
  return search ? `/news?${search}` : "/news";
}

export function NewsFeed({ news, pagination, selected, error = false, calendarDate }: {
  news: ContentNews[];
  pagination?: Pagination;
  selected?: NewsDateRange;
  error?: boolean;
  calendarDate: string;
}) {
  const router = useRouter();
  const multipleDays = selected?.to && selected.to !== selected.from;

  return (
    <>
      <div data-a11y-content-grid className={styles.feed}>
        <aside aria-label="Фильтр новостей по периоду" className={styles.calendarSlot}>
          <ScrollReveal>
            <NewsCalendar
              dates={news.map(newsDate).filter((date): date is string => Boolean(date))}
              initialDate={calendarDate}
              selected={selected}
              onSelect={(range) => router.push(pageHref(1, range))}
              onMonthChange={() => {
                if (pagination && pagination.current_page > 1) {
                  router.replace(pageHref(1, selected), { scroll: false });
                }
              }}
            />
            {selected && (
              <Button variant="outline" nativeButton={false} render={<Link href="/news" />} className={styles.reset}>
                Все даты · сбросить фильтр
              </Button>
            )}
          </ScrollReveal>
        </aside>
        {!error && news.map((item) => (
          <div key={item.id} className={styles.card}>
            <ScrollReveal><NewsCard news={newsCardData(item)} headingLevel="h2" /></ScrollReveal>
          </div>
        ))}
        {error && (
          <div className={styles.empty} role="alert">
            <span className={styles.emptyIcon} data-text-decorative aria-hidden="true"><Newspaper size={32} strokeWidth={1.5} /></span>
            <Typography as="h2" variant="heading-medium" className={styles.emptyTitle}>
              Не удалось загрузить новости
            </Typography>
            <Typography className={styles.emptyDescription}>
              Попробуйте обновить страницу.
            </Typography>
          </div>
        )}
        {!error && news.length === 0 && (
          <ContentEmptyState
            kind="news"
            className={styles.emptyState}
            title={selected ? multipleDays ? "За этот период новостей нет" : selected.to ? "В этот день новостей нет" : "Начиная с этой даты новостей нет" : undefined}
            description={selected ? "Попробуйте выбрать другие даты или посмотрите все новости медиацентра." : undefined}
          >
            {selected && (
              <Button variant="outline" nativeButton={false} render={<Link href="/news" />} className={styles.emptyAction}>
                Показать все новости
              </Button>
            )}
          </ContentEmptyState>
        )}
      </div>
      {!error && <p role="status" className="sr-only">
        {selected ? `${selected.to ? "Новости за" : "Новости с"} ${formatDateRange(selected)} ` : ""}
        Показано {news.length} из {pagination?.total ?? news.length}.
      </p>}
      {!error && pagination && pagination.last_page > 1 && (
        <nav aria-label="Страницы новостей" className={styles.pagination}>
          {pagination.current_page > 1 && (
            <Link href={pageHref(pagination.current_page - 1, selected)} aria-label="Предыдущая страница" className={styles.pageArrow}>
              <ChevronLeft aria-hidden="true" size={18} />
            </Link>
          )}
          {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map((page) => (
            <Link key={page} href={pageHref(page, selected)} aria-label={`Страница ${page}`} aria-current={page === pagination.current_page ? "page" : undefined} className={styles.pageNumber}>
              {page}
            </Link>
          ))}
          {pagination.current_page < pagination.last_page && (
            <Link href={pageHref(pagination.current_page + 1, selected)} aria-label="Следующая страница" className={styles.pageArrow}>
              <ChevronRight aria-hidden="true" size={18} />
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
