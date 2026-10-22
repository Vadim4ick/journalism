"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, FolderOpen, Files } from "lucide-react";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/dialog";
import { GlobalPreloader } from "@/shared/ui/global-preloader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { juryServices } from "@/shared/services/jury";
import { useAuthStore } from "@/state/auth.store";
import type { JuryContestStatus, JuryId } from "@/shared/types/model/jury.type";
import { juryData, juryErrorMessage } from "../model/jury-query";
import { ProjectWorkCard } from "./project-work-card";
import styles from "./project-voting-page.module.css";

const contestStatuses: Record<JuryContestStatus, string> = {
  draft: "Голосование ещё не началось",
  voting: "Голосование идёт",
  closed: "Голосование закрыто",
  archived: "Конкурс в архиве",
};
export function ProjectVotingPage() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((state) => state.sessionId);
  const [chosenContestId, setChosenContestId] = useState<JuryId | null>(null);
  const [chosenNominationId, setChosenNominationId] = useState<JuryId | null>(null);
  const [selectedWorkId, setSelectedWorkId] = useState<JuryId | null>(null);
  const [page, setPage] = useState(1);
  const [dirty, setDirty] = useState(false);
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const [finalizedContestId, setFinalizedContestId] = useState<JuryId | null>(null);
  const finalizeRequestId = useRef<string | null>(null);

  const dashboardQuery = useQuery({
    queryKey: ["jury", "dashboard", sessionId],
    queryFn: async ({ signal }) => juryData(await juryServices.getDashboard(signal)),
    retry: false,
  });
  const contestsQuery = useQuery({
    queryKey: ["jury", "contests", sessionId],
    queryFn: async ({ signal }) => {
      const data = juryData(await juryServices.getContests(signal));
      if (!Array.isArray(data.items)) throw new Error("Сервер вернул некорректный список конкурсов.");
      return data.items;
    },
    retry: false,
  });
  const contests = contestsQuery.data ?? [];
  const contestId = chosenContestId ?? dashboardQuery.data?.contest?.id ?? contests[0]?.id ?? null;
  const contestQuery = useQuery({
    queryKey: ["jury", "contest", sessionId, contestId],
    queryFn: async ({ signal }) => juryData(await juryServices.getContest(contestId!, signal)),
    enabled: contestId !== null,
    retry: false,
  });
  const nominationsQuery = useQuery({
    queryKey: ["jury", "nominations", sessionId, contestId],
    queryFn: async ({ signal }) => {
      const data = juryData(await juryServices.getNominations(contestId!, signal));
      if (!Array.isArray(data.items)) throw new Error("Сервер вернул некорректный список номинаций.");
      return [...data.items].sort((a, b) => a.sort - b.sort);
    },
    enabled: contestId !== null,
    retry: false,
  });
  const nominations = nominationsQuery.data ?? [];
  const nominationId = chosenNominationId !== null && nominations.some((item) => item.id === chosenNominationId)
    ? chosenNominationId
    : nominations[0]?.id ?? null;
  const worksQuery = useQuery({
    queryKey: ["jury", "works", sessionId, contestId, nominationId, page],
    queryFn: async ({ signal }) => {
      const data = juryData(await juryServices.getWorks(contestId!, nominationId!, { page, per_page: 12 }, signal));
      if (!Array.isArray(data.items) || !data.pagination) throw new Error("Сервер вернул некорректный список работ.");
      return data;
    },
    enabled: contestId !== null && nominationId !== null,
    retry: false,
  });
  const works = worksQuery.data?.items ?? [];
  const activeWorkId = works.some((item) => item.id === selectedWorkId) ? selectedWorkId : null;
  const contest = contestQuery.data;
  const dashboard = dashboardQuery.data;
  const isDashboardContest = dashboard?.contest?.id === contestId;
  const canFinalize = Boolean(isDashboardContest && dashboard && dashboard.total_works > 0 && dashboard.remaining_works === 0 && dashboard.can_edit && !dashboard.finalized && finalizedContestId !== contestId && !dirty);
  const finalizeMutation = useMutation({
    mutationFn: async (requestId: string) => juryData(await juryServices.finalize(contestId!, { request_id: requestId })),
    onSuccess: async () => {
      finalizeRequestId.current = null;
      setFinalizedContestId(contestId);
      setChosenContestId(contestId);
      setFinalizeOpen(false);
      setFinalizeError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["jury", "dashboard", sessionId] }),
        queryClient.invalidateQueries({ queryKey: ["jury", "works", sessionId, contestId] }),
        queryClient.invalidateQueries({ queryKey: ["jury", "work", sessionId] }),
      ]);
    },
    onError: async (error) => {
      setFinalizeError(juryErrorMessage(error));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["jury", "dashboard", sessionId] }),
        queryClient.invalidateQueries({ queryKey: ["jury", "works", sessionId, contestId] }),
      ]);
    },
  });

  function mayLeaveForm() {
    return !dirty || window.confirm("Несохранённые оценки будут потеряны. Продолжить?");
  }
  function chooseContest(id: JuryId) {
    if (!mayLeaveForm()) return;
    finalizeRequestId.current = null;
    setChosenContestId(id);
    setChosenNominationId(null);
    setSelectedWorkId(null);
    setPage(1);
    setDirty(false);
  }
  function chooseNomination(id: JuryId) {
    if (!mayLeaveForm()) return;
    setChosenNominationId(id);
    setSelectedWorkId(null);
    setPage(1);
    setDirty(false);
  }
  function choosePage(nextPage: number) {
    if (!mayLeaveForm()) return;
    setPage(nextPage);
    setSelectedWorkId(null);
    setDirty(false);
  }
  function chooseWork(id: JuryId) {
    if (!mayLeaveForm()) return;
    setSelectedWorkId((current) => current === id ? null : id);
    setDirty(false);
  }

  if (dashboardQuery.isPending || contestsQuery.isPending) return <GlobalPreloader />;

  return (
    <Container className={styles.container}>
      <Link href="/account" className={styles.backLink} onClick={(event) => { if (!mayLeaveForm()) event.preventDefault(); }}>
        ← Личный кабинет
      </Link>
      <Typography as="h1" variant="heading-medium" className={styles.pageTitle}>Голосование</Typography>
      <p className={styles.pageIntro}>Выберите номинацию и проект, затем оцените его по критериям.</p>

      {dashboardQuery.isError && <p className={styles.message} role="alert">{juryErrorMessage(dashboardQuery.error)} <button type="button" onClick={() => void dashboardQuery.refetch()}>Повторить</button></p>}
      {contestsQuery.isError && <p className={styles.message} role="alert">{juryErrorMessage(contestsQuery.error)} <button type="button" onClick={() => void contestsQuery.refetch()}>Повторить</button></p>}
      {!contestsQuery.isError && contests.length === 0 && <p className={styles.message} role="status">Вам пока не назначены конкурсы.</p>}
      {contests.length > 1 && <div className={styles.contestPicker}>
        <label htmlFor="jury-contest">Конкурс</label>
        <Select items={contests.map((item) => ({ value: item.id, label: item.title }))} value={contestId} onValueChange={(value) => { if (typeof value === "number") chooseContest(value); }}>
          <SelectTrigger id="jury-contest" className={styles.contestTrigger}>
            <SelectValue placeholder="Выберите конкурс" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} sideOffset={8} className={styles.contestContent}>
            {contests.map((item) => <SelectItem key={item.id} value={item.id} className={styles.contestOption}>{item.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>}
      {contestId !== null && <>
        {contestQuery.isPending ? <p className={styles.message} role="status">Загружаем конкурс…</p> : contestQuery.isError ? <p className={styles.message} role="alert">{juryErrorMessage(contestQuery.error)} <button type="button" onClick={() => void contestQuery.refetch()}>Повторить</button></p> : contest && <div className={styles.contestInfo}>
          <h2>{contest.title}</h2>
          <p>{contestStatuses[contest.status]}</p>
          {contest.rules_html && <p>{contest.rules_html}</p>}
          {contest.start_at && <p>Начало: <time dateTime={contest.start_at}>{formatDate(contest.start_at, contest.timezone)}</time></p>}
          {contest.end_at && <p>Окончание: <time dateTime={contest.end_at}>{formatDate(contest.end_at, contest.timezone)}</time></p>}
          {isDashboardContest && dashboard && <p>Оценено {dashboard.evaluated_works} из {dashboard.total_works} работ. Осталось {dashboard.remaining_works}.</p>}
          {((dashboard?.finalized && isDashboardContest) || finalizedContestId === contestId) && <p role="status">Вы завершили голосование по этому конкурсу.</p>}
          {canFinalize && <button type="button" className={styles.voteButton} onClick={() => { setFinalizeError(null); setFinalizeOpen(true); }}>Завершить голосование</button>}
          {isDashboardContest && dashboard && dashboard.total_works > 0 && dashboard.remaining_works === 0 && dirty && <p role="status">Сохраните или отмените изменения в работе перед завершением голосования.</p>}
        </div>}
        <div className={styles.layout} data-text-flow>
          <aside className={styles.sidebar} aria-labelledby="voting-nominations-title">
            <h2 id="voting-nominations-title" className={styles.sidebarTitle}>Номинации</h2>
            {nominationsQuery.isPending ? <p className={styles.message} role="status">Загружаем номинации…</p> : nominationsQuery.isError ? <p className={styles.message} role="alert">{juryErrorMessage(nominationsQuery.error)} <button type="button" onClick={() => void nominationsQuery.refetch()}>Повторить</button></p> : nominations.length === 0 ? <div className={`${styles.emptyState} ${styles.emptyStateSidebar}`} role="status">
              <span className={styles.emptyIcon} aria-hidden="true"><FolderOpen size={25} /></span>
              <p className={styles.emptyTitle}>Номинаций пока нет</p>
              <p className={styles.emptyDescription}>Они появятся, когда организатор добавит их в конкурс.</p>
            </div> : <ol className={styles.projectList}>
              {nominations.map((nomination, index) => <li key={nomination.id}><button type="button" className={styles.projectLink} aria-pressed={nominationId === nomination.id} onClick={() => chooseNomination(nomination.id)}>
                <span className={styles.projectNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span>{nomination.title}</span><ArrowUpRight className={styles.projectArrow} aria-hidden="true" size={18} />
              </button></li>)}
            </ol>}
          </aside>
          <section className={styles.content} aria-labelledby="voting-content-title">
            <p className={styles.eyebrow} aria-live="polite">{nominations.find((item) => item.id === nominationId)?.title}</p>
            <Typography as="h2" variant="heading-medium" id="voting-content-title" className={styles.projectTitle}>Проекты</Typography>
            {nominationsQuery.isSuccess && nominations.length === 0 ? <div className={styles.emptyState} role="status">
              <span className={styles.emptyIcon} aria-hidden="true"><Files size={30} /></span>
              <h3 className={styles.emptyTitle}>Проекты пока недоступны</h3>
              <p className={styles.emptyDescription}>Работы появятся здесь после добавления номинаций.</p>
            </div> : nominationId !== null && (worksQuery.isPending ? <p className={styles.message} role="status">Загружаем работы…</p> : worksQuery.isError ? <p className={styles.message} role="alert">{juryErrorMessage(worksQuery.error)} <button type="button" onClick={() => void worksQuery.refetch()}>Повторить</button></p> : works.length === 0 ? <div className={styles.emptyState} role="status">
              <span className={styles.emptyIcon} aria-hidden="true"><Files size={30} /></span>
              <h3 className={styles.emptyTitle}>В этой номинации пока нет проектов</h3>
              <p className={styles.emptyDescription}>Выберите другую номинацию или вернитесь позже.</p>
            </div> : <>
              <ol className={styles.choiceList} aria-label="Проекты номинации">{works.map((item, index) => <ProjectWorkCard
                key={item.id}
                item={item}
                number={(page - 1) * 12 + index + 1}
                expanded={activeWorkId === item.id}
                onToggle={() => chooseWork(item.id)}
                contestId={contestId}
                sessionId={sessionId}
                forceReadOnly={Boolean((isDashboardContest && dashboard?.finalized) || finalizedContestId === contestId)}
                onDirtyChange={setDirty}
              />)}</ol>
              {worksQuery.data && worksQuery.data.pagination.last_page > 1 && <nav className={styles.pagination} aria-label="Страницы работ">
                <button type="button" disabled={page <= 1} onClick={() => choosePage(page - 1)}>Назад</button>
                <span>Страница {worksQuery.data.pagination.current_page} из {worksQuery.data.pagination.last_page}</span>
                <button type="button" disabled={page >= worksQuery.data.pagination.last_page} onClick={() => choosePage(page + 1)}>Вперёд</button>
              </nav>}
            </>)}
          </section>
        </div>
      </>}
      <Dialog open={finalizeOpen} onOpenChange={setFinalizeOpen}>
        <DialogContent className={styles.confirmDialog}>
          <DialogTitle className={styles.formTitle}>Завершить голосование?</DialogTitle>
          <DialogDescription className={styles.formHint}>После завершения изменить оценки будет нельзя. Действие необратимо.</DialogDescription>
          {finalizeError && <p className={styles.message} role="alert">{finalizeError}</p>}
          <div className={styles.formFooter}>
            <DialogClose disabled={finalizeMutation.isPending} className={styles.secondaryButton}>Отмена</DialogClose>
            <button type="button" className={styles.voteButton} disabled={finalizeMutation.isPending || !canFinalize} onClick={() => { if (!finalizeMutation.isPending && canFinalize) { finalizeRequestId.current ??= crypto.randomUUID(); finalizeMutation.mutate(finalizeRequestId.current); } }}>
              {finalizeMutation.isPending ? "Завершаем…" : "Завершить голосование"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

function formatDate(value: string, timeZone: string | null) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  try {
    return new Intl.DateTimeFormat("ru-RU", { dateStyle: "long", timeStyle: "short", timeZone: timeZone || "Europe/Moscow" }).format(date);
  } catch {
    return value;
  }
}
