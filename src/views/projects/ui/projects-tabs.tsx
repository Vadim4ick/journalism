"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { SiteImage } from "@/components/site-image";
import type { ProjectCardData } from "@/components/project-card";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import { COMPLETED_PROJECTS, CURRENT_PROJECTS } from "../model/projects";
import styles from "./projects-page.module.css";

const tabs = [
  { id: "current", label: "Текущие проекты", projects: CURRENT_PROJECTS },
  {
    id: "completed",
    label: "Завершённые проекты",
    projects: COMPLETED_PROJECTS,
  },
] as const;

function ProjectItem({ project }: { project: ProjectCardData }) {
  const titleId = `projects-page-${project.id}-title`;
  const descriptionId = `projects-page-${project.id}-description`;
  const isLogo = project.id === "neighbors" || project.id === "rural-blogger";

  return (
    <article
      className={`${styles.card} ${styles.projectCard}`}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className={styles.imageFrame}>
        <SiteImage
          src={project.image}
          alt={project.imageAlt}
          textLinkLabel={`Изображение проекта: ${project.title}`}
          textModeLink={false}
          fill
          sizes="(min-width: 1250px) calc((min(100vw, 1792px) - 134px) / 2), (min-width: 768px) calc((100vw - 124px) / 2), calc(100vw - 72px)"
          className={isLogo ? styles.logoImage : styles.photoImage}
        />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardHeading}>
          <Typography as="h2" variant="heading-medium" id={titleId} className={styles.cardTitle}>
            <span className={styles.projectLink}>{project.title}</span>
          </Typography>
          <Link
            href="/contacts"
            className={styles.partnerLink}
            aria-label={`Стать партнёром проекта ${project.title} — контакты`}
          >
            <span>Стать партнёром</span>
            <span aria-hidden="true" className={styles.partnerIcon}>
              +
            </span>
          </Link>
        </div>
        <Typography
          as="p"
          variant="body"
          id={descriptionId}
          className={styles.cardDescription}
        >
          {project.description}
        </Typography>
      </div>
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`О проекте ${project.title}`}
        className={styles.cardLink}
      />
    </article>
  );
}

export function ProjectsTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;

    event.preventDefault();
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <ScrollReveal>
        <div
          role="tablist"
          aria-label="Состояние проектов"
          className={styles.tabs}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`projects-tab-${tab.id}`}
              aria-controls={`projects-panel-${tab.id}`}
              aria-selected={activeTab === index}
              tabIndex={activeTab === index ? 0 : -1}
              onClick={() => setActiveTab(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={styles.tab}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </ScrollReveal>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          id={`projects-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`projects-tab-${tab.id}`}
          tabIndex={0}
          hidden={activeTab !== index}
          className={styles.panel}
        >
          {tab.projects.length > 0 ? (
            <ul data-a11y-content-grid className={styles.grid}>
              {tab.projects.map((project) => (
                <li key={project.id}>
                  <ScrollReveal className="h-full"><ProjectItem project={project} /></ScrollReveal>
                </li>
              ))}
            </ul>
          ) : (
            <ScrollReveal>
              <Typography variant="body" className={styles.emptyState}>
                Информация о завершённых проектах пока не добавлена.
              </Typography>
            </ScrollReveal>
          )}
        </div>
      ))}
    </div>
  );
}
