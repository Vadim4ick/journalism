import Link from "next/link";
import type { ProjectCardData } from "@/components/project-card";
import { SiteImage } from "@/components/site-image";
import { PartnerInquiry } from "@/components/partner-inquiry";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import { NEIGHBORS_CONTENT } from "../model/neighbors";
import { ProjectGallery } from "./project-gallery";
import styles from "./project-detail-page.module.css";

function PartnerLink({ project }: { project: ProjectCardData }) {
  return <PartnerInquiry project={project.title} className={styles.partnerButton} />;
}

export function ProjectDetailPage({ project }: { project: ProjectCardData }) {
  const neighbors = project.slug === "sosedi";
  const title = neighbors ? NEIGHBORS_CONTENT.title : `Проект ${project.title}`;

  return (
    <>
      <Container className="w-full">
        <article className={styles.article} data-text-flow>
          <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
            <Link href="/">Главная</Link>
            <span aria-hidden="true">›</span>
            <Link href="/projects">Проекты</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Проект {project.title}</span>
          </nav>
          <Typography as="h1" variant="body" className={styles.title}>
            {title}
          </Typography>
          <div className={styles.partnerPlacement}>
            <PartnerLink project={project} />
          </div>
          <ScrollReveal>
            <figure className={styles.heroFigure}>
              <div className={neighbors ? styles.logoFrame : styles.photoFrame}>
                <SiteImage
                  src={project.image}
                  alt={project.imageAlt}
                  textLinkLabel={`Изображение проекта ${project.title}`}
                  fill
                  sizes="(min-width: 832px) 800px, calc(100vw - 32px)"
                  className={
                    neighbors || project.slug === "rural-blogger"
                      ? "object-contain"
                      : "object-cover"
                  }
                  priority
                />
              </div>
              <figcaption className={styles.source}>
                Источник: Медиацентр «Дом журналистики»
              </figcaption>
            </figure>
          </ScrollReveal>
          <ScrollReveal>
            <div className={styles.story}>
              <Typography as="p" variant="body" className={styles.lead}>
                {neighbors ? NEIGHBORS_CONTENT.lead : project.description}
              </Typography>
              {neighbors &&
                NEIGHBORS_CONTENT.paragraphs.map((paragraph) => (
                  <Typography
                    as="p"
                    variant="body"
                    key={paragraph}
                    className={styles.paragraph}
                  >
                    {paragraph}
                  </Typography>
                ))}
            </div>
          </ScrollReveal>
        </article>
      </Container>

      {neighbors && (
        <>
          <ScrollReveal>
            <Container className="w-full">
              <ProjectGallery images={NEIGHBORS_CONTENT.gallery} />
            </Container>
          </ScrollReveal>

          <ScrollReveal>
            <Container className="w-full">
              <section
                aria-labelledby="organizers-heading"
                className={styles.organizers}
                data-text-flow
              >
                <div className={styles.organizersInner}>
                  <Typography
                    as="h2"
                    variant="body"
                    id="organizers-heading"
                    className={styles.sectionTitle}
                  >
                    Организатор проекта:
                  </Typography>
                  <p className={styles.organizerIntro}>
                    Медиацентр «Дом журналистики» — пространство для вдохновения,
                    общения и повышения мастерства журналистов всех уровней
                  </p>
                  <Typography
                    as="h3"
                    variant="body"
                    className={styles.partnersTitle}
                  >
                    Партнёры проекта
                  </Typography>
                  <ul className={styles.partnersList}>
                    {NEIGHBORS_CONTENT.partners.map((partner) => (
                      <li key={partner}>{partner}</li>
                    ))}
                  </ul>
                </div>
              </section>
            </Container>
          </ScrollReveal>

          <ScrollReveal>
            <Container className="w-full">
              <section
                aria-labelledby="cultures-heading"
                className={styles.culturesSection}
                data-text-flow
              >
                <div className={styles.narrow}>
                  <Typography
                    as="h2"
                    variant="body"
                    id="cultures-heading"
                    className={styles.sectionTitle}
                  >
                    Что ждёт вас в рамках проекта «Соседи»
                  </Typography>
                  <Typography
                    as="p"
                    variant="body"
                    className={styles.sectionLead}
                  >
                    До конца года мы познакомим вас с культурой шести
                    национальностей
                  </Typography>
                </div>
                <ul className={styles.cultureGrid} data-a11y-content-grid>
                  {NEIGHBORS_CONTENT.cultures.map((culture) => (
                    <li key={culture.name} className={styles.cultureCard}>
                      <div
                        className={`${styles.cultureBanner} ${styles[culture.tone]}`}
                      >
                        <span aria-hidden="true" className={styles.cultureMark}>
                          С
                        </span>
                        <Typography as="h3" variant="body">
                          {culture.name}
                        </Typography>
                      </div>
                      <Typography as="p" variant="body">
                        {culture.text}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </section>
            </Container>
          </ScrollReveal>

          <Container className="w-full">
            <ScrollReveal>
              <section
                aria-labelledby="tales-heading"
                className={styles.talesSection}
                data-text-flow
              >
                <Typography
                  as="h2"
                  variant="body"
                  id="tales-heading"
                  className={styles.sectionTitle}
                >
                  Национальные сказки
                </Typography>
                <Typography as="p" variant="body" className={styles.sectionLead}>
                  {NEIGHBORS_CONTENT.tales[0]}
                </Typography>
                {NEIGHBORS_CONTENT.tales.slice(1).map((paragraph) => (
                  <Typography
                    as="p"
                    variant="body"
                    key={paragraph}
                    className={styles.paragraph}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <figure className={styles.quote} data-text-flow>
                <span aria-hidden="true" className={styles.quoteMark}>
                  «
                </span>
                <blockquote>«{NEIGHBORS_CONTENT.quote}»</blockquote>
                <figcaption>{NEIGHBORS_CONTENT.quoteAuthor}</figcaption>
              </figure>
            </ScrollReveal>

            <ScrollReveal>
              <section
                aria-labelledby="experts-heading"
                className={styles.expertsSection}
                data-text-flow
              >
                <Typography
                  as="h2"
                  variant="body"
                  id="experts-heading"
                  className={styles.sectionTitle}
                >
                  Наши эксперты
                </Typography>
                <Typography as="p" variant="body" className={styles.expertsEmpty}>
                  Информация об экспертах появится позже
                </Typography>
              </section>
            </ScrollReveal>
          </Container>
        </>
      )}
    </>
  );
}
