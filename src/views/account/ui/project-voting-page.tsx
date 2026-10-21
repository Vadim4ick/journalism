"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Download } from "lucide-react";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { VOTING_PROJECTS } from "../model/voting-projects";
import { ProjectVotingForm } from "./project-voting-form";
import styles from "./project-voting-page.module.css";

const nominations = [
  "Лучшая отраслевая коммуникационная кампания",
  "Лучшая антикризисная кампания",
  "Лучшая социальная кампания",
  "Продвижение собственного бренда",
  "Лучшая кампания по продвижению территорий",
  "Лучшая информационная кампания в государственных и муниципальных структурах",
  "Лучший пиар-проект студенческих медиа",
];

const placeholderDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export function ProjectVotingPage() {
  const [nominationIndex, setNominationIndex] = useState(0);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);

  return (
    <Container className={styles.container}>
      <Link href="/account" className={styles.backLink}>
        ← Личный кабинет
      </Link>
      <Typography as="h1" variant="heading-medium" className={styles.pageTitle}>
        Голосование
      </Typography>
      <p className={styles.pageIntro}>
        Выберите номинацию и проект, затем оцените его по критериям.
      </p>

      <div className={styles.layout} data-text-flow>
        <aside
          className={styles.sidebar}
          aria-labelledby="voting-nominations-title"
        >
          <h2 id="voting-nominations-title" className={styles.sidebarTitle}>
            Номинации
          </h2>
          <ol className={styles.projectList}>
            {nominations.map((nomination, index) => (
              <li key={nomination}>
                <button
                  type="button"
                  className={styles.projectLink}
                  aria-pressed={nominationIndex === index}
                  onClick={() => {
                    setNominationIndex(index);
                    setSelectedProjectSlug(null);
                  }}
                >
                  <span className={styles.projectNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{nomination}</span>
                  <ArrowUpRight
                    className={styles.projectArrow}
                    aria-hidden="true"
                    size={18}
                  />
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <section
          className={styles.content}
          aria-labelledby="voting-content-title"
        >
          <p className={styles.eyebrow} aria-live="polite">
            {nominations[nominationIndex]}
          </p>

          <Typography
            as="h2"
            variant="heading-medium"
            id="voting-content-title"
            className={styles.projectTitle}
          >
            Проекты
          </Typography>
          <ol className={styles.choiceList} aria-label="Проекты номинации">
            {VOTING_PROJECTS.map((item, index) => {
              const expanded = selectedProjectSlug === item.slug;
              const triggerId = `voting-project-${item.slug}-trigger`;
              const panelId = `voting-project-${item.slug}-panel`;

              return (
                <li key={item.slug} className={styles.choiceItem}>
                  <h3 className={styles.choiceHeading}>
                    <button
                      id={triggerId}
                      type="button"
                      className={styles.choiceButton}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() =>
                        setSelectedProjectSlug(expanded ? null : item.slug)
                      }
                    >
                      <span className={styles.choiceNumber} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.choiceTitle}>{item.title}</span>
                      <ChevronDown
                        className={styles.choiceArrow}
                        aria-hidden="true"
                        size={22}
                      />
                    </button>
                  </h3>
                  <div className={styles.choiceDetails}>
                    {item.organization && (
                      <p className={styles.organization}>
                        {item.organization}
                      </p>
                    )}
                    <div className={styles.projectSummary}>
                      <h4 className={styles.descriptionTitle}>
                        Описание проекта
                      </h4>
                      <p className={styles.projectDescription}>
                        {item.description ?? placeholderDescription}
                      </p>
                      <a
                        href={`/files/voting/${item.slug}.pdf`}
                        download={`${item.slug}.pdf`}
                        className={styles.pdfLink}
                      >
                        <Download size={19} aria-hidden="true" />
                        Скачать PDF
                      </a>
                    </div>
                    <div
                      id={panelId}
                      className={styles.choicePanel}
                      aria-labelledby={triggerId}
                      hidden={!expanded}
                    >
                      {expanded && (
                        <ProjectVotingForm
                          key={`${nominationIndex}-${item.slug}`}
                        />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </Container>
  );
}
