"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { NewsCard, newsCardData } from "@/components/news-card";
import { Button } from "@/shared/ui/button";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
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
              dates={news.map((item) => item.published_at_iso.slice(0, 10))}
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
        {(error || news.length === 0) && (
          <div className={styles.empty} role={error ? "alert" : undefined}>
            <span className={styles.emptyIcon} data-text-decorative aria-hidden="true"><Newspaper size={32} strokeWidth={1.5} /></span>
            <Typography as="h2" variant="heading-medium" className={styles.emptyTitle}>
              {error ? "Не удалось загрузить новости" : selected ? multipleDays ? "За этот период новостей нет" : selected.to ? "В этот день новостей нет" : "Начиная с этой даты новостей нет" : "Новости пока не опубликованы"}
            </Typography>
            <Typography className={styles.emptyDescription}>
              {error ? "Попробуйте обновить страницу." : selected ? "Попробуйте выбрать другие даты или посмотрите все новости медиацентра." : "Здесь появятся события и истории из жизни медиацентра. Загляните к нам позже."}
            </Typography>
            {selected && !error && (
              <Button variant="outline" nativeButton={false} render={<Link href="/news" />} className={styles.emptyAction}>
                Показать все новости
              </Button>
            )}
          </div>
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
