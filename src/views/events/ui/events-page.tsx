import Link from "next/link";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { SiteImage } from "@/components/site-image";
import { HOME_EVENTS } from "@/modules/home/home-events/model/events";
import { EventsCards } from "./events-cards";
import styles from "./events-page.module.css";

export function EventsPage() {
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
          {HOME_EVENTS.length > 0 ? (
            <EventsCards events={HOME_EVENTS} />
          ) : (
            <Typography variant="body" className="text-muted-foreground">
              Пока нет предстоящих событий.
            </Typography>
          )}
        </Container>
      </section>
    </>
  );
}
