import Link from "next/link";
import { NewsCard, newsCardData } from "@/components/news-card";
import { SiteImage } from "@/components/site-image";
import { SocialLinks } from "@/components/social-links";
import { ArrowUpRight } from "@/shared/icons/arrow-up-right";
import { contentImageUrl } from "@/shared/lib/content-image-url";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import type { ContentNews, ContentNewsDetail } from "@/shared/types/model/content.type";
import { NewsGallery } from "./news-gallery";
import styles from "./news-detail-page.module.css";

export function NewsDetailPage({ article, related }: { article: ContentNewsDetail; related: ContentNews[] }) {
  const gallery = (article.images ?? [])
    .map((image) => ({ src: contentImageUrl(image.url), alt: image.description || `Фото новости «${article.title}»` }))
    .filter((image): image is { src: string; alt: string } => Boolean(image.src));
  const cover = contentImageUrl(article.image);
  if (gallery.length === 0 && cover) gallery.push({ src: cover, alt: `Фото новости «${article.title}»` });

  return (
    <>
      <Container>
        <article data-text-flow className={styles.article}>
          <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
            <Link href="/">Главная</Link>
            <span aria-hidden="true" className={styles.breadcrumbSeparator}>
              <SiteImage src="/images/news/breadcrumb.svg" alt="" width={15} height={15} />
              <span className="text-mode-only">›</span>
            </span>
            <Link href="/news">Новости</Link>
            <span aria-hidden="true" className={styles.breadcrumbSeparator}>
              <SiteImage src="/images/news/breadcrumb.svg" alt="" width={15} height={15} />
              <span className="text-mode-only">›</span>
            </span>
            <span aria-current="page" className={styles.currentCrumb}>{article.title}</span>
          </nav>

          <header className={styles.articleHeader}>
            <div className={styles.dateLine}>
              <time dateTime={article.published_at_iso}>
                {article.published_at} <span className={styles.time}>{article.published_at_iso.slice(11, 16)}</span>
              </time>
            </div>
            <Typography as="h1" variant="heading-medium" className={styles.title}>{article.title}</Typography>
          </header>

          {gallery.length > 0 && <ScrollReveal><NewsGallery images={gallery} /></ScrollReveal>}

          <ScrollReveal>
            <div className={styles.body}>
              {article.description && <Typography variant="body" className={styles.lead}>{article.description}</Typography>}
              {article.detail_text && <div className={styles.paragraph} dangerouslySetInnerHTML={{ __html: article.detail_text }} />}
            </div>
          </ScrollReveal>

          {article.tags?.length > 0 && <ScrollReveal>
            <ul aria-label="Темы новости" className={styles.tags}>
              {article.tags.map((tag) => <li key={tag.id}>{tag.label}</li>)}
            </ul>
          </ScrollReveal>}

          <ScrollReveal>
            <section aria-label="Социальные сети" className={styles.socialSection}>
              <Typography variant="caption" className={styles.socialLabel}>Мы в социальных сетях:</Typography>
              <SocialLinks size="small" />
            </section>
          </ScrollReveal>
        </article>
      </Container>

      {related.length > 0 && <section aria-labelledby="latest-news-heading" className={styles.latestSection} data-text-flow>
        <Container>
          <ScrollReveal>
            <div className={styles.latestHeading}>
              <Typography as="h2" variant="section-title" id="latest-news-heading">Читайте также</Typography>
              <Button variant="pill" nativeButton={false} render={<Link href="/news" />}
                addonRight={<span data-text-decorative className={styles.allNewsIcon}><ArrowUpRight aria-hidden="true" className="size-[22px]" /></span>}>
                Все новости
              </Button>
            </div>
          </ScrollReveal>
          <ul data-a11y-content-grid className={styles.latestGrid}>
            {related.map((news) => (
              <li key={news.id}><ScrollReveal><NewsCard news={newsCardData(news)} headingLevel="h3" /></ScrollReveal></li>
            ))}
          </ul>
        </Container>
      </section>}
    </>
  );
}
