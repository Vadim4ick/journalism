import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { SiteImage } from "@/components/site-image";
import type { ContentEvent } from "@/shared/types/model/content.type";
import { eventCardData } from "@/components/event-card";
import { EventsCards } from "./events-cards";
import styles from "./events-page.module.css";

function pageHref(page: number) {
  return page === 1 ? "/events" : `/events?page=${page}`;
}

export function EventsPage({ events, pagination, error = false }: { events: ContentEvent[]; pagination?: Pagination; error?: boolean }) {
  return (
    <>
      <section aria-labelledby="events-heading" className={styles.heroSection}>
        <Container className="w-full max-w-[1840px] px-0">
          <div className={styles.hero}>
            <div className={styles.content}>
              <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
                <Link href="/" className="underline-offset-4 hover:underline focus-visible:underline">
                  Главная
                </Link>
                <span aria-hidden="true" className={styles.breadcrumbSeparator}>
                  <SiteImage src="/images/news/breadcrumb.svg" alt="" width={15} height={15} className="-rotate-90" />
                  <span className="text-mode-only">›</span>
                </span>
                <span aria-current="page">Предстоящие события</span>
              </nav>
              <Typography as="h1" variant="hero-title" id="events-heading" className={styles.title}>
                Предстоящие события
              </Typography>
              <Typography as="p" variant="hero-description" className={styles.description}>
                Анонсы встреч, мастер-классов, лекций и мероприятий Дома журналистики. Следите за афишей, чтобы ничего не пропустить.
              </Typography>
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Список предстоящих событий" className="py-10 mobile:py-12 desktop:py-16">
        <Container>
          {error ? (
            <Typography variant="body" role="alert">Не удалось загрузить события. Попробуйте обновить страницу.</Typography>
          ) : events.length > 0 ? (
            <EventsCards events={events.map(eventCardData)} />
          ) : (
            <Typography variant="body" className="text-muted-foreground">
              Пока нет предстоящих событий.
            </Typography>
          )}
          {!error && pagination && pagination.last_page > 1 && (
            <nav aria-label="Страницы событий" className={styles.pagination}>
              {pagination.current_page > 1 && (
                <Link href={pageHref(pagination.current_page - 1)} aria-label="Предыдущая страница" className={styles.pageArrow}>
                  <ChevronLeft aria-hidden="true" size={18} />
                </Link>
              )}
              {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map((page) => (
                <Link key={page} href={pageHref(page)} aria-label={`Страница ${page}`} aria-current={page === pagination.current_page ? "page" : undefined} className={styles.pageNumber}>
                  {page}
                </Link>
              ))}
              {pagination.current_page < pagination.last_page && (
                <Link href={pageHref(pagination.current_page + 1)} aria-label="Следующая страница" className={styles.pageArrow}>
                  <ChevronRight aria-hidden="true" size={18} />
                </Link>
              )}
            </nav>
          )}
        </Container>
      </section>
    </>
  );
}
