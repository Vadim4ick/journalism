import Link from "next/link";
import { Info } from "lucide-react";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import { Vk } from "@/shared/icons/seti/vk";
import { Ok } from "@/shared/icons/seti/ok";
import type { Newspaper } from "../model/newspapers";
import { NewspaperLogo } from "./newspaper-logo";
import { IssuesFeed } from "./issues-feed";
import styles from "./newspaper-detail-page.module.css";

export function NewspaperDetailPage({ newspaper }: { newspaper: Newspaper }) {
  return (
    <Container>
      <article className={styles.article}>
        <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
          <Link href="/" className="hover:underline focus-visible:underline">Главная</Link>
          <span aria-hidden="true">›</span>
          <Link href="/newspapers" className="hover:underline focus-visible:underline">Газетный киоск</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{newspaper.name}</span>
        </nav>

        <ScrollReveal>
          <header className={styles.publisherCard}>
            <div data-text-decorative className={styles.logoPanel}>
              <NewspaperLogo newspaper={newspaper} />
            </div>
            <div className={styles.publisherContent}>
              <Typography as="h1" variant="heading-medium" className={styles.title}>{newspaper.name}</Typography>
              {newspaper.website || newspaper.municipality || newspaper.socials ? (
                <dl className={styles.publisherMeta}>
                  {newspaper.website && (
                    <div>
                      <dt>Сайт:</dt>
                      <dd><a href={`https://${newspaper.website}`} className={styles.website}>{newspaper.website}</a></dd>
                    </div>
                  )}
                  {newspaper.municipality && (
                    <div>
                      <dt>Муниципальный округ:</dt>
                      <dd>{newspaper.municipality}</dd>
                    </div>
                  )}
                  {newspaper.socials && (
                    <div>
                      <dt>Соц. сети:</dt>
                      <dd className={styles.socials}>
                        <span className={styles.socialNames}>{newspaper.socials.join(", ")}</span>
                        {newspaper.socials.map((social) => (
                          <span key={social} aria-hidden="true" className={styles.socialBadge}>
                            {social === "ВКонтакте" ? <Vk /> : <Ok />}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <div className={styles.missingDetails}>
                  <span aria-hidden="true" data-text-decorative className={styles.missingDetailsIcon}>
                    <Info size={22} strokeWidth={1.75} />
                  </span>
                  <Typography variant="heading-small">Информация о редакции пока не добавлена</Typography>
                </div>
              )}
            </div>
          </header>
        </ScrollReveal>

        <ScrollReveal><IssuesFeed issues={newspaper.issues} /></ScrollReveal>
      </article>
    </Container>
  );
}
