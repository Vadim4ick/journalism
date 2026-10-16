import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { VOTING_PROJECTS, type VotingProject } from "../model/voting-projects";
import { ProjectVotingForm } from "./project-voting-form";
import styles from "./project-voting-page.module.css";

const placeholderDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export function ProjectVotingPage({ project }: { project: VotingProject }) {
  return (
    <Container className={styles.container}>
      <Link href="/account" className={styles.backLink}>← Личный кабинет</Link>
      <Typography as="h1" variant="heading-medium" className={styles.pageTitle}>
        Голосование
      </Typography>
      <p className={styles.pageIntro}>Выберите проект и оцените его по критериям.</p>

      <div className={styles.layout} data-text-flow>
        <aside className={styles.sidebar} aria-labelledby="voting-projects-title">
          <h2 id="voting-projects-title" className={styles.sidebarTitle}>Проекты</h2>
          <nav aria-label="Проекты для голосования">
            <ul className={styles.projectList}>
              {VOTING_PROJECTS.map((item, index) => (
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
            {project.organization && <p className={styles.eyebrow}>{project.organization}</p>}
            <Typography as="h2" variant="heading-medium" id="voting-project-title" className={styles.projectTitle}>
              {project.title}
            </Typography>
            <p className={styles.projectDescription}>{placeholderDescription}</p>
          </header>

          <ProjectVotingForm key={project.slug} />
        </article>
      </div>
    </Container>
  );
}
