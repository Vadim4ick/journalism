import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { ProjectsTabs } from "./projects-tabs";
import type { ContentProject } from "@/shared/types/model/content.type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./projects-page.module.css";

function pageHref(page: number) {
  return page === 1 ? "/projects" : `/projects?page=${page}`;
}

export function ProjectsPage({ projects, pagination, error = false }: { projects: ContentProject[]; pagination?: Pagination; error?: boolean }) {
  return (
    <>
      <section aria-labelledby="projects-heading" className={styles.heroSection}>
        <Container className="w-full max-w-[1840px] px-0">
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
                <Link href="/">Главная</Link>
                <span aria-hidden="true" className={styles.breadcrumbSeparator}>
                  <SiteImage src="/images/news/breadcrumb.svg" alt="" width={15} height={15} className="-rotate-90" />
                  <span className="text-mode-only">›</span>
                </span>
                <span aria-current="page">Проекты</span>
              </nav>
              <Typography as="h1" variant="hero-title" id="projects-heading" className={styles.title}>
                Проекты медиацентра
              </Typography>
              <Typography as="p" variant="hero-description" className={styles.description}>
                Пространство для тех, кто создаёт контент. Здесь рождаются идеи, проекты и коллаборации.
              </Typography>
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Проекты медиацентра" className={styles.projectsSection}>
        <Container>
          {error ? <Typography variant="body" role="alert">Не удалось загрузить проекты. Попробуйте обновить страницу.</Typography> : (
            <>
              <ProjectsTabs projects={projects} />
              {pagination && pagination.last_page > 1 && <nav aria-label="Страницы проектов" className={styles.pagination}>
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
