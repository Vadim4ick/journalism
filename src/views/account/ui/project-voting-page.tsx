import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectCardData } from "@/components/project-card";
import { CURRENT_PROJECTS } from "@/views/projects/model/projects";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { ProjectVotingForm } from "./project-voting-form";
import styles from "./project-voting-page.module.css";

export function ProjectVotingPage({ project }: { project: ProjectCardData }) {
  return (
    <Container className={styles.container}>
      <Link href="/account" className={styles.backLink}>← Личный кабинет</Link>
      <Typography as="h1" variant="heading-medium" className={styles.pageTitle}>
        Голосование
      </Typography>
      <p className={styles.pageIntro}>Выберите проект, ознакомьтесь с ним и оцените по критериям.</p>

      <div className={styles.layout} data-text-flow>
        <aside className={styles.sidebar} aria-labelledby="voting-projects-title">
          <h2 id="voting-projects-title" className={styles.sidebarTitle}>Проекты</h2>
          <nav aria-label="Проекты для голосования">
            <ul className={styles.projectList}>
              {CURRENT_PROJECTS.map((item, index) => (
                <li key={item.slug}>
                  <Link
                    href={`/account/voting/${item.slug}`}
                    className={styles.projectLink}
                    aria-current={item.slug === project.slug ? "page" : undefined}
                  >
                    <span className={styles.projectNumber} aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.title}</span>
                    <ArrowUpRight className={styles.projectArrow} aria-hidden="true" size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className={styles.content} aria-labelledby="voting-project-title">
          <header className={styles.projectHeader}>
            <p className={styles.eyebrow}>Проект медиацентра</p>
            <Typography as="h2" variant="heading-medium" id="voting-project-title" className={styles.projectTitle}>
              {project.title}
            </Typography>
            <p className={styles.projectDescription}>{project.description}</p>
            <Link href={`/projects/${project.slug}`} className={styles.detailsLink}>
              Подробнее о проекте <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
          </header>

          <ProjectVotingForm key={project.slug} />
        </article>
      </div>
    </Container>
  );
}
