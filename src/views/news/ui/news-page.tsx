import Link from "next/link";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { SiteImage } from "@/components/site-image";
import { NEWS } from "../model/news";
import { NewsFeed } from "./news-feed";
import styles from "./news-page.module.css";

export function NewsPage() {
  return (
    <>
      <section aria-labelledby="news-heading" className={styles.heroSection}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
              <Link href="/" className="rounded-sm underline-offset-4 hover:underline focus-visible:underline">Главная</Link>
              <span aria-hidden="true" className={styles.breadcrumbSeparator}>
                <SiteImage src="/images/news/breadcrumb.svg" alt="" width={15} height={15} className="-rotate-90" />
                <span className="text-mode-only">›</span>
              </span>
              <span aria-current="page">Новости</span>
            </nav>
            <Typography as="h1" variant="hero-title" id="news-heading">Новости</Typography>
          </div>
        </div>
      </section>
      <section aria-label="Все новости" className={styles.feedSection}>
        <Container><NewsFeed news={NEWS} /></Container>
      </section>
    </>
  );
}
