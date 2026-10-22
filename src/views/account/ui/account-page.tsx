"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { GlobalPreloader } from "@/shared/ui/global-preloader";
import { SiteImage } from "@/components/site-image";
import { contentImageUrl } from "@/shared/lib/content-image-url";
import { Nominees } from "@/shared/icons/lk/nominees";
import { Voted } from "@/shared/icons/lk/voted";
import { LeftVoted } from "@/shared/icons/lk/left-voted";
import { LeftDay } from "@/shared/icons/lk/left-day";
import { juryServices } from "@/shared/services/jury";
import { useAuthStore } from "@/state/auth.store";
import type { JuryContest, JuryDashboard } from "@/shared/types/model/jury.type";
import styles from "./account-page.module.css";

function formatContestDate(value: string | null, timeZone: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timeZone || "Europe/Moscow",
      timeZoneName: "short",
    }).format(date);
  } catch {
    return value;
  }
}

function contestLogoUrl(logo: unknown): string | undefined {
  const path = typeof logo === "string"
    ? logo
    : logo && typeof logo === "object" && "url" in logo && typeof logo.url === "string"
      ? logo.url
      : null;
  return contentImageUrl(path);
}

function AccountStatistics({ dashboard }: { dashboard: JuryDashboard }) {
  const statistics = [
    { label: "Всего работ", value: dashboard.total_works, icon: Nominees },
    { label: "Вы проголосовали", value: dashboard.evaluated_works, icon: Voted },
    { label: "Осталось проголосовать", value: dashboard.remaining_works, icon: LeftVoted },
    { label: "Осталось дней", value: Math.max(0, Math.ceil(dashboard.seconds_remaining / 86400)), icon: LeftDay },
  ];

  return (
    <dl className={styles.statistics}>
      {statistics.map(({ label, value, icon: Icon }) => (
        <div className={styles.statistic} key={label}>
          <span className={styles.statisticIcon} aria-hidden="true"><Icon /></span>
          <dt className={styles.statisticLabel}>{label}</dt>
          <dd className={styles.statisticValue}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ContestDetails({ contest, dashboard }: { contest: JuryContest; dashboard: JuryDashboard }) {
  const rules = contest.rules_html?.trim() || contest.description?.trim();
  const start = formatContestDate(contest.start_at, contest.timezone);
  const end = formatContestDate(contest.end_at, contest.timezone);
  const logo = contestLogoUrl(contest.logo);

  return (
    <>
      <div className={styles.banner}>
        <div className={styles.sorokaBanner}>
          <div className={styles.bannerContent}>
            {logo && (
              <span className={styles.bannerLogo} data-text-decorative>
                <SiteImage
                  src={logo}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 600px) 92px, 120px"
                  className={styles.bannerLogoImage}
                />
              </span>
            )}
            <p className={styles.bannerCaption}>{contest.title}</p>
          </div>
          <span className={styles.bannerArcBack} aria-hidden="true" data-text-decorative data-a11y-background-image />
          <span className={styles.bannerArcFront} aria-hidden="true" data-text-decorative data-a11y-background-image />
          <p className={styles.bannerYear}>{contest.year} г.</p>
        </div>
      </div>

      <section className={styles.rules} aria-labelledby="voting-rules-title">
        <Link href="/account/voting" className={styles.votingButton}>
          {dashboard.can_edit && !dashboard.finalized ? "Перейти к голосованию" : "Посмотреть оценки"}
          <span className={styles.buttonArrow} aria-hidden="true"><ArrowRight size={19} /></span>
        </Link>
        {(!dashboard.can_edit || dashboard.finalized) && <p className={styles.votingStatus} role="status">
          {dashboard.finalized ? "Голосование завершено" : "Голосование сейчас недоступно"}
        </p>}

        <Typography as="h2" variant="heading-medium" id="voting-rules-title" className={`${styles.rulesHeading} ${styles.selectedRulesHeading}`}>
          Правила голосования
        </Typography>
        {rules ? <p className={styles.rulesText}>{rules}</p> : <p className={styles.rulesText}>Правила пока не опубликованы.</p>}
        {(start || end) && (
          <dl className={styles.dates}>
            {start && <div><dt>Начало голосования</dt><dd><time dateTime={contest.start_at ?? undefined}>{start}</time></dd></div>}
            {end && <div><dt>Окончание голосования</dt><dd><time dateTime={contest.end_at ?? undefined}>{end}</time></dd></div>}
          </dl>
        )}
      </section>
    </>
  );
}

export function AccountPage() {
  const profile = useAuthStore((state) => state.profile);
  const sessionId = useAuthStore((state) => state.sessionId);
  const dashboardQuery = useQuery({
    queryKey: ["jury", "dashboard", sessionId],
    queryFn: async ({ signal }) => {
      const response = await juryServices.getDashboard(signal);
      if (response.status !== "success" || !response.data) {
        throw new Error("Некорректный ответ сервера при загрузке кабинета");
      }
      return response.data;
    },
    enabled: Boolean(profile),
    retry: false,
  });

  if (dashboardQuery.isPending) return <GlobalPreloader />;

  const fullName = profile?.full_name?.trim();
  const dashboard = dashboardQuery.data;
  const accessDenied = axios.isAxiosError(dashboardQuery.error) && dashboardQuery.error.response?.status === 403;

  return (
    <Container className={styles.container}>
      <section aria-labelledby="account-heading" data-text-flow>
        <header>
          <Typography as="h1" variant="heading-medium" id="account-heading" className={styles.heading}>
            {fullName ? `${fullName}, добро пожаловать!` : "Добро пожаловать!"}
          </Typography>
          <Typography as="p" variant="body" className={styles.subtitle}>Личный кабинет члена жюри</Typography>
        </header>

        {dashboardQuery.isError ? (
          <div className={styles.message} role="alert">
            <p>{accessDenied ? "У вас нет доступа к кабинету жюри." : "Не удалось загрузить данные кабинета."}</p>
            {!accessDenied && <Button type="button" onClick={() => void dashboardQuery.refetch()} className={styles.retryButton}>Повторить</Button>}
          </div>
        ) : dashboard ? (
          <>
            <AccountStatistics dashboard={dashboard} />
            {dashboard.contest ? (
              <ContestDetails contest={dashboard.contest} dashboard={dashboard} />
            ) : (
              <p className={styles.message} role="status">Нет текущего конкурса для голосования. <Link href="/account/voting">Посмотреть назначенные конкурсы</Link></p>
            )}
          </>
        ) : null}
      </section>
    </Container>
  );
}
