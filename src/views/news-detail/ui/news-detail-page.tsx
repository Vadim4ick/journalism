import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import { SiteImage } from "@/components/site-image";
import { SocialLinks } from "@/components/social-links";
import { HOME_NEWS } from "@/modules/home/home-news/model/news";
import { ArrowUpRight } from "@/shared/icons/arrow-up-right";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import type { NewsArticle } from "../model/article";
import { NewsGallery } from "./news-gallery";
import styles from "./news-detail-page.module.css";

export function NewsDetailPage({ article }: { article: NewsArticle }) {
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
              <time dateTime={article.publishedAt}>{article.dateLabel} <span className={styles.time}>{article.timeLabel}</span></time>
            </div>
            <Typography as="h1" variant="heading-medium" className={styles.title}>{article.title}</Typography>
          </header>

          <NewsGallery images={article.gallery} />

          <div className={styles.body}>
            <Typography variant="body" className={styles.lead}>{article.lead}</Typography>
            {article.paragraphs.map((paragraph) => (
              <Typography key={paragraph} variant="body" className={styles.paragraph}>{paragraph}</Typography>
            ))}
          </div>

          <ul aria-label="Темы новости" className={styles.tags}>
            {article.tags.map((tag) => (
              <li key={tag.label} className={styles[tag.tone]}>{tag.label}</li>
            ))}
          </ul>

          <section aria-label="Социальные сети" className={styles.socialSection}>
            <Typography variant="caption" className={styles.socialLabel}>Мы в социальных сетях:</Typography>
            <SocialLinks size="small" whiteIcons />
          </section>
        </article>
      </Container>

      <section aria-labelledby="latest-news-heading" className={styles.latestSection} data-text-flow>
        <Container>
          <div className={styles.latestHeading}>
            <Typography as="h2" variant="section-title" id="latest-news-heading">Последние новости</Typography>
            <Button
              variant="pill"
              nativeButton={false}
              render={<Link href="/news" />}
              addonRight={
                <span data-text-decorative className={styles.allNewsIcon}>
                  <ArrowUpRight aria-hidden="true" className="size-[22px]" />
                </span>
              }
            >
              Все новости
            </Button>
          </div>
          <ul data-a11y-content-grid className={styles.latestGrid}>
            {HOME_NEWS.map((news) => (
              <li key={news.id}><NewsCard news={news} headingLevel="h3" /></li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
