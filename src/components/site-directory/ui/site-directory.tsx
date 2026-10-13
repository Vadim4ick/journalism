"use client";

import { Typography } from "@/shared/ui/typography";
import { SiteImage as Image } from "@/components/site-image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { Container } from "@/shared/ui/container";
import { nav } from "@/shared/const/nav.const";
import { useRef, type CSSProperties } from "react";
import styles from "./site-directory.module.css";
import { useAccessibilityStore, useEffectiveReducedMotion } from "@/state/accessibility";

const angles = [0, 15, 0, -15, -15, 0, -15, 15, -15, -15, 13.87, 15, 0];
const crops: Record<number, CSSProperties> = {
  2: { width: "114.33%", height: "171.54%", left: "-10.99%", top: "-12.13%" },
  6: { width: "194.28%", height: "129.49%", left: "-20.88%", top: "-25.67%" },
  7: { width: "217.36%", height: "144.85%", left: "-62.02%", top: "-5.5%" },
  11: { width: "100%", height: "149.81%", left: "0.09%", top: "-6.97%" },
  12: { width: "205.73%", height: "308.72%", left: "-69.11%", top: "-92.44%" },
};

function Photos({ ids }: { ids: number[] }) {
  const reducedMotion = useEffectiveReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.1 });
  return (
    <div
      ref={ref}
      className={styles.photos}
      aria-hidden="true"
      data-a11y-background-image
    >
      {ids.map((id, index) => (
        <motion.div
          key={id}
          className={styles.photo}
          initial={
            reducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 28,
                  rotate: angles[id] - 8,
                  scale: 0.92,
                }
          }
          whileInView={{ opacity: 1, y: 0, rotate: angles[id], scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: reducedMotion ? 0 : 0.6,
            delay: reducedMotion ? 0 : index * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            className={styles.photoInner}
            style={{
              animationDuration: `${6.5 + (id % 5) * 0.8}s`,
              animationDelay: `${-id * 0.73}s`,
              animationDirection: id % 2 ? "reverse" : "normal",
              animationPlayState:
                inView && !reducedMotion ? "running" : "paused",
            }}
          >
            <Image
              src={`/images/directory/photo-${id}.png`}
              alt=""
              width={140}
              height={140}
              sizes="(min-width: 1450px) 140px, (min-width: 768px) 110px, 20vw"
              className={styles.image}
              style={crops[id]}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SectionLink({ name, number }: { name: string; number: string }) {
  const reducedMotion = useEffectiveReducedMotion();
  const section = nav.find((item) => item.name === name);
  if (!section) return null;
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: reducedMotion ? 0 : 0.5 }}
      className={styles.label}
    >
      <Link href={section.link} className={styles.link}>
        <Typography
          as="span"
          variant="directory-number"
          className={styles.number}
        >
          Раздел {number}
        </Typography>
        <Typography as="span" variant="directory-title">
          {name}
        </Typography>
      </Link>
    </motion.div>
  );
}

function SiteDirectory() {
  const textMode = useAccessibilityStore((state) => state.textMode);

  if (textMode) {
    return (
      <section data-site-directory aria-labelledby="text-directory-heading">
        <h2 id="text-directory-heading">Разделы сайта</h2>
        <ul>
          {nav.map((item) => <li key={item.name}><Link href={item.link}>{item.name}</Link></li>)}
        </ul>
      </section>
    );
  }

  return (
    <section
      data-site-directory
      className={styles.section}
      aria-label="Разделы сайта"
    >
      <Container>
        <div className={styles.composition}>
          <div className={styles.row}>
            <SectionLink name="О нас" number="I" />
            <Photos ids={[0, 1, 2, 3]} />
            <SectionLink name="Контакты" number="VII" />
          </div>
          <div className={styles.row}>
            <SectionLink name="Новости" number="II" />
            <Photos ids={[4, 5, 6]} />
            <SectionLink name="Фотогалерея" number="VI" />
          </div>
          <div className={styles.row}>
            <SectionLink name="Документы" number="III" />
            <Photos ids={[11, 12]} />
            <SectionLink name="Газетный киоск" number="V" />
          </div>
          <div className={`${styles.row} ${styles.lastRow}`}>
            <Photos ids={[7, 8]} />
            <SectionLink name="Проекты" number="IV" />
            <Photos ids={[9, 10]} />
          </div>
        </div>
      </Container>
    </section>
  );
}

export { SiteDirectory };
