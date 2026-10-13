import Link from "next/link";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import { NEWSPAPERS } from "../model/newspapers";
import { NewspaperLogo } from "./newspaper-logo";
import styles from "./newspapers-page.module.css";

export function NewspapersPage() {
  return (
    <>
      <section aria-labelledby="newspapers-heading" className={styles.heroSection}>
        <Container className="w-full max-w-[1840px] px-0">
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
                <Link href="/" className="hover:underline focus-visible:underline">Главная</Link>
                <span aria-hidden="true">›</span>
                <span aria-current="page">Газетный киоск</span>
              </nav>
              <Typography as="h1" variant="hero-title" id="newspapers-heading">Газетный киоск</Typography>
              <Typography as="p" variant="hero-description">Пресса Краснодарского края</Typography>
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Редакции газет" className={styles.catalogSection}>
        <Container>
          <ul data-a11y-content-grid data-text-flow className={styles.grid}>
            {NEWSPAPERS.map((newspaper) => (
              <li key={newspaper.slug}>
                <ScrollReveal>
                  <Link href={`/newspapers/${newspaper.slug}`} className={styles.card}>
                    <span data-text-decorative className={styles.logoPanel}>
                      <NewspaperLogo newspaper={newspaper} />
                    </span>
                    <Typography as="h2" variant="small" className={styles.cardTitle}>{newspaper.name}</Typography>
                  </Link>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
