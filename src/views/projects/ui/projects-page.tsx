import Link from "next/link";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { ProjectsTabs } from "./projects-tabs";
import styles from "./projects-page.module.css";

export function ProjectsPage() {
  return (
    <>
      <section aria-labelledby="projects-heading" className={styles.heroSection}>
        <Container className="w-full max-w-[1840px] px-0">
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
                <Link href="/">Главная</Link>
                <span aria-hidden="true">›</span>
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
          <ProjectsTabs />
        </Container>
      </section>
    </>
  );
}
