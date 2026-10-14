"use client";

import { SiteImage } from "@/components/site-image";
import { useAccessibilityStore } from "@/state/accessibility";
import { Typography } from "@/shared/ui/typography";
import { Container } from "@/shared/ui/container";
import styles from "./home-banner.module.css";

function HomeBanner() {
  const enabled = useAccessibilityStore((state) => state.enabled);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const backgroundImagesVisible = useAccessibilityStore(
    (state) => state.backgroundImagesVisible,
  );
  const accessible = enabled || textMode;
  const showIllustration = !textMode && (!enabled || backgroundImagesVisible);

  return (
    <section
      id="home-about"
      aria-labelledby="home-banner-heading"
      className="px-4 pt-5"
    >
      <Container className="w-full max-w-[1840px] px-0">
        <div className={`${styles.hero} ${accessible ? styles.accessible : ""}`}>
          <div className={styles.content}>
            <Typography
              as="h1"
              variant="hero-title"
              id="home-banner-heading"
              className={styles.title}
            >
              Медиацентр
              <br />«Дом журналистики»
            </Typography>
            <Typography as="p" variant="hero-description" className={styles.description}>
              Пространство для вдохновения, общения
              <br />и повышения мастерства журналистов всех уровней
            </Typography>
          </div>
          {showIllustration && (
            <div
              className={styles.illustration}
              data-a11y-background-image
              aria-hidden="true"
            >
              <SiteImage
                src="/images/hero/building.svg"
                alt=""
                fill
                priority
                sizes="(min-width: 1840px) 915px, (min-width: 1250px) 50vw, 85vw"
                className="object-contain object-right-bottom"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export { HomeBanner };
