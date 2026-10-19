import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import { contentImageUrl } from "@/shared/lib/content-image-url";
import type { ContentNewspaper } from "@/shared/types/model/content.type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./newspapers-page.module.css";

function pageHref(page: number) {
  return page === 1 ? "/newspapers" : `/newspapers?page=${page}`;
}

function NewspaperCard({ newspaper }: { newspaper: ContentNewspaper }) {
  const logo = contentImageUrl(newspaper.logo);
  return (
    <Link href={`/newspapers/${encodeURIComponent(newspaper.slug)}`} className={styles.card} aria-label={newspaper.name}>
      <span aria-hidden="true" data-text-decorative className={styles.logoPanel}>
        <SiteImage src={logo} alt="" fill unoptimized sizes="(min-width: 1250px) 280px, (min-width: 768px) 33vw, 50vw" className={styles.logoImage} />
      </span>
      <Typography as="h2" variant="small" className={styles.cardTitle}>
        <span className={styles.shortName}>{newspaper.short_name || newspaper.name}</span>
        <span className={styles.fullName}>{newspaper.name}</span>
      </Typography>
    </Link>
  );
}

export function NewspapersPage({ newspapers, pagination, error = false }: { newspapers: ContentNewspaper[]; pagination?: Pagination; error?: boolean }) {
  return (
    <>
      <section aria-labelledby="newspapers-heading" className={styles.heroSection}>
        <Container className="w-full max-w-[1840px] px-0">
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
                <Link href="/" className="hover:underline focus-visible:underline">Главная</Link>
                <span aria-hidden="true" className={styles.breadcrumbSeparator}>
                  <SiteImage src="/images/news/breadcrumb.svg" alt="" width={15} height={15} className="-rotate-90" />
                  <span className="text-mode-only">›</span>
                </span>
                <span aria-current="page">Газетный киоск</span>
              </nav>
              <Typography as="h1" variant="hero-title" id="newspapers-heading">Газетный киоск</Typography>
              <Typography as="p" variant="hero-description">Пресса Краснодарского края</Typography>
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Редакции газет" className={styles.catalogSection}>
        <Container>
          {error ? <Typography variant="body" role="alert">Не удалось загрузить газеты. Попробуйте обновить страницу.</Typography> : (
            <>
              {newspapers.length > 0 ? (
                <ul data-a11y-content-grid data-text-flow className={styles.grid}>
                  {newspapers.map((newspaper) => (
                    <li key={newspaper.id}><ScrollReveal><NewspaperCard newspaper={newspaper} /></ScrollReveal></li>
                  ))}
                </ul>
              ) : <Typography variant="body">Газеты пока не добавлены.</Typography>}
              {pagination && pagination.last_page > 1 && <nav aria-label="Страницы газет" className={styles.pagination}>
                {pagination.current_page > 1 && <Link href={pageHref(pagination.current_page - 1)} aria-label="Предыдущая страница" className={styles.pageArrow}><ChevronLeft aria-hidden="true" size={18} /></Link>}
                {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map((page) => (
                  <Link key={page} href={pageHref(page)} aria-label={`Страница ${page}`} aria-current={page === pagination.current_page ? "page" : undefined} className={styles.pageNumber}>{page}</Link>
                ))}
                {pagination.current_page < pagination.last_page && <Link href={pageHref(pagination.current_page + 1)} aria-label="Следующая страница" className={styles.pageArrow}><ChevronRight aria-hidden="true" size={18} /></Link>}
              </nav>}
            </>
          )}
        </Container>
      </section>
    </>
  );
}
