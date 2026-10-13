"use client";

import { useState } from "react";
import { Newspaper } from "lucide-react";
import { NewsCard, type NewsCardData } from "@/components/news-card";
import { Button } from "@/shared/ui/button";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import { NewsCalendar } from "./news-calendar";
import {
  formatDateRange,
  isDateInRange,
  type NewsDateRange,
} from "../model/date-range";
import styles from "./news-page.module.css";
import { ArrowUpRight } from "@/shared/icons/arrow-up-right";

const PAGE_SIZE = 8;

export function NewsFeed({ news }: { news: readonly NewsCardData[] }) {
  const [selectedRange, setSelectedRange] = useState<NewsDateRange>();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const filtered = selectedRange
    ? news.filter((item) => isDateInRange(item.date, selectedRange))
    : news;
  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;
  const multipleDays =
    selectedRange?.to && selectedRange.to !== selectedRange.from;

  function selectDate(range?: NewsDateRange) {
    setSelectedRange(range);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      <div data-a11y-content-grid className={styles.feed}>
        <aside
          aria-label="Фильтр новостей по периоду"
          className={styles.calendarSlot}
        >
          <ScrollReveal>
          <NewsCalendar
            dates={news.map((item) => item.date)}
            selected={selectedRange}
            onSelect={selectDate}
          />
          {selectedRange && (
            <Button
              variant="outline"
              className={styles.reset}
              onClick={() => selectDate()}
            >
              Все даты · сбросить фильтр
            </Button>
          )}
          </ScrollReveal>
        </aside>
        {visible.map((item) => (
          <div key={item.id} className={styles.card}>
            <ScrollReveal><NewsCard news={item} headingLevel="h2" /></ScrollReveal>
          </div>
        ))}
        {visible.length === 0 && (
          <div className={styles.empty}>
            <span
              className={styles.emptyIcon}
              data-text-decorative
              aria-hidden="true"
            >
              <Newspaper size={32} strokeWidth={1.5} />
            </span>
            <Typography
              as="h2"
              variant="heading-medium"
              className={styles.emptyTitle}
            >
              {selectedRange
                ? multipleDays
                  ? "За этот период новостей нет"
                  : "В этот день новостей нет"
                : "Новости пока не опубликованы"}
            </Typography>
            <Typography className={styles.emptyDescription}>
              {selectedRange
                ? "Попробуйте выбрать другие даты или посмотрите все новости медиацентра."
                : "Здесь появятся события и истории из жизни медиацентра. Загляните к нам позже."}
            </Typography>
            {selectedRange && (
              <Button
                variant="outline"
                className={styles.emptyAction}
                onClick={() => selectDate()}
              >
                Показать все новости
              </Button>
            )}
          </div>
        )}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {selectedRange ? `Новости за ${formatDateRange(selectedRange)} ` : ""}
        Показано {visible.length} из {filtered.length}.
      </p>
      {visible.length > 0 && (
        <div className={styles.loadMore}>
          <Button
            variant="pill"
            disabled={!hasMore}
            title={hasMore ? undefined : "Все доступные новости загружены"}
            className="disabled:opacity-100"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            addonRight={
              <span
                data-text-decorative
                className="flex size-10 shrink-0 items-center rotate-[-225deg] justify-center rounded-full bg-muted text-foreground mobile:size-11 desktop1250:size-[50px]"
              >
                <ArrowUpRight aria-hidden="true" className="size-[22px]" />
              </span>
            }
          >
            Загрузить ещё
          </Button>
        </div>
      )}
    </>
  );
}
