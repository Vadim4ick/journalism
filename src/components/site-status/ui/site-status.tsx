import type { ReactNode } from "react";
import Link from "next/link";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { TextModeToggle } from "@/components/text-mode";
import { Logo } from "@/shared/icons/logo";
import { Typography } from "@/shared/ui/typography";
import styles from "./site-status.module.css";

type StatusKind = "maintenance" | "not-found" | "loading" | "error";

const content: Record<StatusKind, {
  eyebrow: string;
  title: string;
  description: string;
  symbol: string;
  visualCaption: string;
}> = {
  maintenance: {
    eyebrow: "Сайт на обновлении",
    title: "Небольшая пауза перед новой историей",
    description: "Мы приводим страницы в порядок. Скоро Дом журналистики снова будет открыт для новостей, встреч и ваших идей.",
    symbol: "✳",
    visualCaption: "Технические работы",
  },
  "not-found": {
    eyebrow: "Страница не найдена",
    title: "Эта история пока не здесь",
    description: "Кажется, адрес изменился. Начните с главной — там собраны актуальные новости, события и проекты.",
    symbol: "404",
    visualCaption: "Ошибка 404",
  },
  loading: {
    eyebrow: "Дом журналистики",
    title: "Готовим страницу",
    description: "Проверяем доступность сайта. Это займёт немного времени.",
    symbol: "…",
    visualCaption: "Загрузка",
  },
  error: {
    eyebrow: "Ошибка соединения",
    title: "Связь прервалась",
    description: "Не удалось узнать, открыт ли сайт. Попробуйте обновить страницу через минуту.",
    symbol: "!",
    visualCaption: "Повторите попытку",
  },
};

export function SiteStatus({
  kind,
  action,
}: {
  kind: StatusKind;
  action?: ReactNode;
}) {
  const page = content[kind];
  const logo = (
    <>
      <span className="text-mode-hidden" aria-hidden="true">
        <Logo className={styles.logo} />
      </span>
      <span className="text-mode-only" aria-hidden="true">Медиацентр «Дом журналистики»</span>
      <span className="sr-only">Дом журналистики</span>
    </>
  );

  return (
    <section className={styles.page} aria-labelledby="site-status-heading" data-text-flow>
      <div className={styles.topBand}>
        <header className={styles.header}>
          {kind === "not-found" ? (
            <Link href="/" aria-label="Дом журналистики — главная" className={styles.brand}>
              {logo}
            </Link>
          ) : (
            <div className={styles.brand}>{logo}</div>
          )}
          <div className={styles.tools}>
            <TextModeToggle />
            <AccessibilityPanel triggerClassName="size-11 rounded-full desktop1250:size-13" />
          </div>
        </header>
      </div>

      <div className={styles.card}>
        <div className={styles.copy}>
          <Typography variant="small" className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            {page.eyebrow}
          </Typography>
          <Typography as="h1" variant="section-title" id="site-status-heading" className={styles.title}>
            {page.title}
          </Typography>
          <Typography variant="body" className={styles.description}>
            {page.description}
          </Typography>
          {action && <div className={styles.action}>{action}</div>}
        </div>
        <div className={styles.visual} data-a11y-background-image data-text-decorative aria-hidden="true">
          <span className={styles.ringOuter} />
          <span className={styles.ringInner} />
          <span className={styles.visualSymbol}>{page.symbol}</span>
          <span className={styles.visualCaption}>{page.visualCaption}</span>
        </div>
      </div>
      <p className={styles.footnote}>Медиацентр «Дом журналистики»</p>
    </section>
  );
}
