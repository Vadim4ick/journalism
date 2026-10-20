"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";
import { SiteImage } from "@/components/site-image";
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

type Stage = "projects" | "criteria";
const placeholderDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export function ProjectVotingPage() {
  const [nominationIndex, setNominationIndex] = useState(0);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("projects");
  const selectedProject = VOTING_PROJECTS.find(
    (item) => item.slug === selectedProjectSlug,
  );
  const selectedProjectButtonRef = useRef<HTMLButtonElement>(null);
  const projectHeadingRef = useRef<HTMLHeadingElement>(null);
  const restoreProjectFocus = useRef(false);
  const focusProjectHeading = useRef(false);

  useEffect(() => {
    if (stage === "projects" && restoreProjectFocus.current) {
      selectedProjectButtonRef.current?.focus();
      restoreProjectFocus.current = false;
    }
    if (stage === "criteria" && focusProjectHeading.current) {
      projectHeadingRef.current?.focus();
      focusProjectHeading.current = false;
    }
  }, [stage]);

  function showProjects() {
    restoreProjectFocus.current = true;
    setStage("projects");
  }

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
                    setStage("projects");
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

          {stage === "projects" ? (
            <>
              <Typography
                as="h2"
                variant="heading-medium"
                id="voting-content-title"
                className={styles.projectTitle}
              >
                Проекты
              </Typography>
              <ol className={styles.choiceList} aria-label="Проекты номинации">
                {VOTING_PROJECTS.map((item) => (
                  <li key={item.slug}>
                    <button
                      ref={
                        item.slug === selectedProjectSlug
                          ? selectedProjectButtonRef
                          : undefined
                      }
                      type="button"
                      className={styles.choiceButton}
                      aria-labelledby={`voting-project-${item.slug}-title`}
                      aria-describedby={`voting-project-${item.slug}-description`}
                      onClick={() => {
                        setSelectedProjectSlug(item.slug);
                        focusProjectHeading.current = true;
                        setStage("criteria");
                      }}
                    >
                      <span className={styles.choiceImage} data-text-decorative>
                        <SiteImage
                          src={item.image ?? "/images/no-image.png"}
                          alt=""
                          fill
                          sizes="(min-width: 1350px) 380px, (min-width: 900px) 300px, (min-width: 600px) 45vw, calc(100vw - 96px)"
                          className={styles.choiceImageContent}
                        />
                      </span>
                      <span className={styles.choiceArrow} aria-hidden="true" data-text-decorative><ArrowUpRight size={21} /></span>
                      <span className={styles.choiceTitle} id={`voting-project-${item.slug}-title`}>{item.title}</span>
                      <span className={styles.choiceDescription} id={`voting-project-${item.slug}-description`}>
                        {item.description ?? placeholderDescription}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </>
          ) : selectedProject ? (
            <>
              <button
                type="button"
                className={styles.returnButton}
                onClick={showProjects}
              >
                <ArrowLeft aria-hidden="true" size={18} />
                Вернуться к проектам
              </button>
              {selectedProject.organization && (
                <p className={styles.organization}>
                  {selectedProject.organization}
                </p>
              )}
              <Typography
                as="h2"
                variant="heading-medium"
                id="voting-content-title"
                className={styles.projectTitle}
                ref={projectHeadingRef}
                tabIndex={-1}
              >
                {selectedProject.title}
              </Typography>
              <div className={styles.projectSummary}>
                <h3 className={styles.descriptionTitle}>Описание проекта</h3>
                <p className={styles.projectDescription}>
                  {selectedProject.description ?? placeholderDescription}
                </p>
                <a
                  href={`/files/voting/${selectedProject.slug}.pdf`}
                  download={`${selectedProject.slug}.pdf`}
                  className={styles.pdfLink}
                >
                  <Download size={19} aria-hidden="true" />
                  Скачать PDF
                </a>
              </div>
              <ProjectVotingForm
                key={`${nominationIndex}-${selectedProject.slug}`}
              />
            </>
          ) : null}
        </section>
      </div>
    </Container>
  );
}
