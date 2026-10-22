import type { CSSProperties } from "react";
import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { contentImageUrl } from "@/shared/lib/content-image-url";
import type { ContentProjectBlock, ContentProjectBlockItem, ContentProjectDetail } from "@/shared/types/model/content.type";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { ProjectGallery } from "./project-gallery";
import { ExpertsCarousel } from "./experts-carousel";
import styles from "./project-detail-page.module.css";

function orderedItems(items: ContentProjectBlockItem[]) {
  return [...items].sort((a, b) => a.sort - b.sort);
}

function BlockHeading({ block, id }: { block: ContentProjectBlock; id: string }) {
  return block.title ? <Typography as="h2" variant="body" id={id} className={styles.sectionTitle}>{block.title}</Typography> : null;
}

function BlockDescription({ html, className }: { html: string; className?: string }) {
  return html ? <div className={`${styles.htmlContent} ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} /> : null;
}

function ItemImage({ item }: { item: ContentProjectBlockItem }) {
  const src = contentImageUrl(item.image?.url);
  return src ? <div className={styles.itemImage}>
    <SiteImage src={src} unoptimized alt={item.image?.alt || item.title} textLinkLabel={item.image?.alt || item.title} fill sizes="(min-width: 768px) 360px, calc(100vw - 48px)" className="object-cover" />
  </div> : null;
}

function itemHref(url: string | null) {
  if (!url) return null;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function ProjectPeopleSection({ organizers, partners }: { organizers: ContentProjectBlock[]; partners: ContentProjectBlock[] }) {
  const organizerBlock = organizers[0];
  const partnerBlock = partners[0];
  const headingId = `project-block-${(organizerBlock || partnerBlock).id}`;
  const organizerItems = organizers.flatMap((block) => orderedItems(block.items));
  const partnerItems = partners.flatMap((block) => orderedItems(block.items));

  return (
    <section aria-labelledby={headingId} className={styles.peopleSection} data-text-flow>
      <div className={styles.peopleInner}>
        {organizerBlock && <Typography as="h2" variant="body" id={headingId} className={styles.sectionTitle}>
          {(organizerBlock.title || "Организатор проекта").replace(/:?$/, ":")}
        </Typography>}
        {organizers.map((block) => <div key={block.id}>
          <BlockDescription html={block.description_html} />
          {block.text && <p>{block.text}</p>}
        </div>)}
        {organizerItems.length > 0 && <ul className={styles.organizersList}>
          {organizerItems.map((item) => <li key={item.id}>
            <ItemImage item={item} />
            {itemHref(item.url) ? <a href={itemHref(item.url)!}>{item.title}</a> : <span>{item.title}</span>}
            {item.description_html && <>
              <span> — </span>
              <BlockDescription html={item.description_html} />
            </>}
            {item.text && <p>{item.text}</p>}
          </li>)}
        </ul>}

        {partnerBlock && <Typography as={organizerBlock ? "h3" : "h2"} variant="body" id={organizerBlock ? undefined : headingId} className={styles.partnersTitle}>
          {partnerBlock.title || "Партнёры проекта"}
        </Typography>}
        {partners.map((block) => <div key={block.id}>
          <BlockDescription html={block.description_html} />
          {block.text && <p>{block.text}</p>}
        </div>)}
        {partnerItems.length > 0 && <ul className={styles.partnersList}>
          {partnerItems.map((item) => <li key={item.id}>
            <ItemImage item={item} />
            {itemHref(item.url) ? <a href={itemHref(item.url)!}>{item.title}</a> : item.title}
            <BlockDescription html={item.description_html.trim() === `<p>${item.title}</p>` ? "" : item.description_html} />
            {item.text && <p>{item.text}</p>}
          </li>)}
        </ul>}
      </div>
    </section>
  );
}

function ProjectBlock({ block, projectTitle }: { block: ContentProjectBlock; projectTitle: string }) {
  const headingId = `project-block-${block.id}`;
  const items = orderedItems(block.items);
  const title = block.title || "Фотографии проекта";

  switch (block.type) {
    case "rich_text":
      return (
        <section aria-labelledby={block.title ? headingId : undefined} className={styles.textSection} data-text-flow>
          <BlockHeading block={block} id={headingId} />
          <BlockDescription html={block.description_html} />
          {block.text && <p>{block.text}</p>}
        </section>
      );

    case "gallery": {
      const images = items.flatMap((item) => {
        const src = contentImageUrl(item.image?.url);
        return src ? [{ id: item.id, src, alt: item.image?.alt || item.title }] : [];
      });
      return <ProjectGallery images={images} title={title} headingId={headingId} />;
    }

    case "cards":
      return (
        <section aria-labelledby={block.title ? headingId : undefined} className={styles.cardsSection} data-text-flow>
          <BlockHeading block={block} id={headingId} />
          <BlockDescription html={block.description_html} className={styles.sectionIntro} />
          {block.text && <p>{block.text}</p>}
          {items.length > 0 && <ul className={styles.cultureGrid} data-a11y-content-grid>
            {items.map((item) => (
              <li key={item.id} className={styles.cultureCard} style={{ "--card-accent": item.color } as CSSProperties}>
                <div className={styles.cultureBanner}>
                  <span aria-hidden="true" data-text-decorative className={styles.cultureMark}>
                    {projectTitle.trim().charAt(0).toLocaleUpperCase("ru") || "П"}
                  </span>
                  <Typography as="h3" variant="body">{item.title}</Typography>
                </div>
                <ItemImage item={item} />
                <BlockDescription html={item.description_html} />
                {item.text && <p>{item.text}</p>}
                {itemHref(item.url) && <a href={itemHref(item.url)!}>Подробнее</a>}
              </li>
            ))}
          </ul>}
        </section>
      );

    case "stories":
      return (
        <section aria-labelledby={block.title ? headingId : undefined} className={styles.storiesSection} data-text-flow>
          <BlockHeading block={block} id={headingId} />
          <BlockDescription html={block.description_html} />
          {block.text && <p>{block.text}</p>}
          {items.map((item) => (
            <div key={item.id} className={styles.storyItem}>
              <ItemImage item={item} />
              {item.title && item.title !== block.title && <Typography as="h3" variant="heading-medium">{item.title}</Typography>}
              <BlockDescription html={item.description_html} />
              {item.text && <p>{item.text}</p>}
            </div>
          ))}
        </section>
      );

    case "quote": {
      const person = items[0];
      const imageSrc = contentImageUrl(person?.image?.url);
      return (
        <figure className={styles.quote} data-text-flow>
          {imageSrc && <div className={styles.quoteImage}>
            <SiteImage src={imageSrc} unoptimized alt={person.image?.alt || person.title} textLinkLabel={person.image?.alt || person.title} fill sizes="(min-width: 768px) 360px, calc(100vw - 48px)" className="object-cover" />
          </div>}
          <figcaption className={styles.quoteText}>
            <BlockDescription html={block.description_html || person?.description_html || ""} />
            {!block.description_html && !person?.description_html && block.title && <blockquote>{block.title}</blockquote>}
            {(block.text || person?.title) && <span className={styles.quoteAuthor}>{block.text || person.title}</span>}
          </figcaption>
        </figure>
      );
    }

    case "experts":
      return <ExpertsCarousel items={items} title={title} headingId={headingId} />;

    default:
      return null;
  }
}

export function ProjectDetailPage({ project }: { project: ContentProjectDetail }) {
  const imageSrc = contentImageUrl(project.image);
  const blocks = [...project.blocks].sort((a, b) => a.sort - b.sort);
  const organizers = blocks.filter((block) => block.type === "organizers");
  const partners = blocks.filter((block) => block.type === "partners");
  const peopleIndex = blocks.findIndex((block) => block.type === "organizers" || block.type === "partners");

  return (
    <Container className="w-full">
      <article className={styles.projectPage} data-text-flow>
        <header className={styles.article}>
          <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
            <Link href="/">Главная</Link>
            <span aria-hidden="true">›</span>
            <Link href="/projects">Проекты</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{project.title}</span>
          </nav>
          <Typography as="h1" variant="body" className={styles.title}>{project.title}</Typography>
          {project.description && <Typography as="p" variant="body" className={styles.lead}>{project.description}</Typography>}
          {imageSrc && <div className={styles.heroFigure}>
            <div className={styles.photoFrame}>
              <SiteImage src={imageSrc} unoptimized alt={`Изображение проекта «${project.title}»`} textLinkLabel={`Изображение проекта «${project.title}»`} fill priority sizes="(min-width: 832px) 800px, calc(100vw - 48px)" className="object-cover" />
            </div>
          </div>}
        </header>
        {blocks.length > 0
          ? blocks.map((block, index) =>
              block.type === "organizers" || block.type === "partners"
                ? index === peopleIndex && <ProjectPeopleSection key="project-people" organizers={organizers} partners={partners} />
                : <ProjectBlock key={block.id} block={block} projectTitle={project.title} />)
          : project.detail_text
            ? <div className={styles.textSection}><BlockDescription html={project.detail_text} /></div>
            : <p className={styles.emptyContent}>Подробная информация о проекте пока не опубликована.</p>}
      </article>
    </Container>
  );
}
