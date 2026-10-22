"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { juryServices } from "@/shared/services/jury";
import type {
  JuryId,
  JurySaveEvaluationPayload,
  JuryWork,
} from "@/shared/types/model/jury.type";
import { juryData, juryErrorMessage } from "../model/jury-query";
import styles from "./project-voting-page.module.css";

function initialScores(work: JuryWork): Record<number, string> {
  if (
    !work.evaluation ||
    work.evaluation.criteria_version !== work.criteria_version
  )
    return {};
  return Object.fromEntries(
    work.evaluation.scores.map((item) => [
      item.criterion_id,
      String(item.value),
    ]),
  );
}

interface Props {
  work: JuryWork;
  contestId: JuryId;
  sessionId: number;
  forceReadOnly: boolean;
  onDirtyChange: (dirty: boolean) => void;
}

export function ProjectVotingForm({
  work,
  contestId,
  sessionId,
  forceReadOnly,
  onDirtyChange,
}: Props) {
  const queryClient = useQueryClient();
  const [scores, setScores] = useState<Record<number, string>>(() =>
    initialScores(work),
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const pendingPayload = useRef<JurySaveEvaluationPayload | null>(null);
  const submittingRef = useRef(false);
  const mismatch = Boolean(
    work.evaluation &&
    work.evaluation.criteria_version !== work.criteria_version,
  );
  const canEdit =
    !forceReadOnly &&
    work.can_edit === true &&
    work.evaluation?.status !== "locked";
  const originalScores = initialScores(work);
  const hasUnsavedEdits = work.criteria.some(
    (criterion) =>
      (scores[criterion.id] ?? "") !== (originalScores[criterion.id] ?? ""),
  );
  const savedScores = new Map(
    work.evaluation?.scores.map((item) => [item.criterion_id, item.value]) ??
      [],
  );
  const allScoresValid =
    work.criteria.length > 0 &&
    work.criteria.length <= 500 &&
    work.criteria.every((criterion) => {
      const raw = scores[criterion.id];
      if (raw == null || raw.trim() === "") return false;
      const value = Number(raw);
      return (
        Number.isInteger(value) &&
        value >= criterion.min_score &&
        value <= criterion.max_score
      );
    });
  const hasScoreChanges =
    mismatch ||
    work.criteria.some(
      (criterion) =>
        Number(scores[criterion.id]) !== savedScores.get(criterion.id),
    );

  useEffect(() => {
    onDirtyChange(hasUnsavedEdits);
    return () => onDirtyChange(false);
  }, [hasUnsavedEdits, onDirtyChange]);
  useEffect(() => {
    if (!hasUnsavedEdits) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedEdits]);

  const saveMutation = useMutation({
    mutationFn: async (payload: JurySaveEvaluationPayload) =>
      juryData(await juryServices.saveEvaluation(work.id, payload)),
    onSuccess: async (evaluation) => {
      queryClient.setQueryData<JuryWork>(
        ["jury", "work", sessionId, work.id],
        (current) => (current ? { ...current, evaluation } : current),
      );
      setScores(
        Object.fromEntries(
          evaluation.scores.map((item) => [
            item.criterion_id,
            String(item.value),
          ]),
        ),
      );
      setConflict(false);
      setError(null);
      setSuccess("Оценка сохранена.");
      pendingPayload.current = null;
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["jury", "dashboard", sessionId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["jury", "works", sessionId, contestId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["jury", "work", sessionId, work.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["jury", "history", sessionId, work.id],
        }),
      ]);
    },
    onError: async (failure) => {
      setError(juryErrorMessage(failure));
      if (axios.isAxiosError(failure) && failure.response?.status === 409) {
        setConflict(true);
        pendingPayload.current = null;
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["jury", "work", sessionId, work.id],
          }),
          queryClient.invalidateQueries({
            queryKey: ["jury", "dashboard", sessionId],
          }),
          queryClient.invalidateQueries({
            queryKey: ["jury", "works", sessionId, contestId],
          }),
        ]);
      }
    },
    onSettled: () => {
      submittingRef.current = false;
    },
  });
  const historyQuery = useQuery({
    queryKey: ["jury", "history", sessionId, work.id],
    queryFn: async ({ signal }) => {
      const data = juryData(
        await juryServices.getEvaluationHistory(work.id, signal),
      );
      if (!Array.isArray(data.items))
        throw new Error("Сервер вернул некорректную историю.");
      return data.items;
    },
    enabled: historyOpen,
    retry: false,
  });
  const canSubmit =
    canEdit &&
    allScoresValid &&
    (work.evaluation?.status !== "submitted" || hasScoreChanges) &&
    !saveMutation.isPending &&
    !conflict;
  const submitHint = !allScoresValid
    ? "Заполните все критерии допустимыми баллами."
    : work.evaluation?.status === "submitted" && !hasScoreChanges
      ? "Измените хотя бы один балл, чтобы обновить оценку."
      : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      submittingRef.current ||
      saveMutation.isPending ||
      !canEdit ||
      conflict ||
      (work.evaluation?.status === "submitted" && !hasScoreChanges)
    )
      return;
    setError(null);
    if (
      !Array.isArray(work.criteria) ||
      work.criteria.length < 1 ||
      work.criteria.length > 500
    ) {
      setError("Для этой работы нет доступных критериев оценки.");
      return;
    }
    const values = work.criteria.map((criterion) => ({
      criterion_id: criterion.id,
      value: Number(scores[criterion.id]),
    }));
    const invalidIndex = work.criteria.findIndex(
      (criterion, index) =>
        scores[criterion.id] == null ||
        scores[criterion.id].trim() === "" ||
        !Number.isInteger(values[index].value) ||
        values[index].value < criterion.min_score ||
        values[index].value > criterion.max_score,
    );
    if (invalidIndex >= 0) {
      setError("Заполните все критерии целыми баллами в указанных пределах.");
      document
        .getElementById(`score-${work.id}-${work.criteria[invalidIndex].id}`)
        ?.focus();
      return;
    }
    const nextPayload: JurySaveEvaluationPayload = {
      contest_id: contestId,
      nomination_id: work.nomination.id,
      version: work.evaluation?.version ?? 0,
      criteria_version: work.criteria_version,
      status: "submitted",
      request_id: crypto.randomUUID(),
      scores: values,
    };
    const previous = pendingPayload.current;
    const sameAction =
      previous &&
      previous.contest_id === nextPayload.contest_id &&
      previous.nomination_id === nextPayload.nomination_id &&
      previous.version === nextPayload.version &&
      previous.criteria_version === nextPayload.criteria_version &&
      JSON.stringify(previous.scores) === JSON.stringify(nextPayload.scores);
    const payload = sameAction ? previous : nextPayload;
    pendingPayload.current = payload;
    submittingRef.current = true;
    saveMutation.mutate(payload);
  }

  return (
    <div>
      {mismatch && (
        <p className={styles.message} role="status">
          Критерии изменились. Прежние баллы не перенесены: оцените работу
          заново.
        </p>
      )}
      {!canEdit && (
        <p className={styles.message} role="status">
          Редактирование оценки сейчас недоступно.
        </p>
      )}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <fieldset disabled={!canEdit || saveMutation.isPending}>
          <legend className={styles.formTitle}>Критерии оценки</legend>
          <p className={styles.formHint}>
            Укажите целый балл для каждого критерия в его диапазоне.
          </p>
          <div className={styles.criteriaList}>
            {work.criteria?.map((criterion, index) => (
              <div className={styles.criterion} key={criterion.id}>
                <span className={styles.criterionNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.criterionText}>
                  <label
                    htmlFor={`score-${work.id}-${criterion.id}`}
                    className={styles.criterionTitle}
                  >
                    {criterion.title}
                  </label>
                  {criterion.description && (
                    <p className={styles.criterionDescription}>
                      {criterion.description}
                    </p>
                  )}
                  <p
                    id={`score-${work.id}-${criterion.id}-range`}
                    className={styles.criterionDescription}
                  >
                    От {criterion.min_score} до {criterion.max_score} баллов
                  </p>
                </div>
                <input
                  ref={index === 0 ? firstInputRef : undefined}
                  id={`score-${work.id}-${criterion.id}`}
                  className={styles.scoreInput}
                  type="number"
                  inputMode="numeric"
                  min={criterion.min_score}
                  max={criterion.max_score}
                  step="1"
                  aria-describedby={`score-${work.id}-${criterion.id}-range`}
                  aria-invalid={
                    scores[criterion.id] !== undefined &&
                    scores[criterion.id] !== "" &&
                    (Number(scores[criterion.id]) < criterion.min_score ||
                      Number(scores[criterion.id]) > criterion.max_score)
                  }
                  value={scores[criterion.id] ?? ""}
                  onChange={(event) => {
                    const raw = event.currentTarget.value;
                    if (raw !== "" && !/^\d+$/.test(raw)) return;
                    const value =
                      raw !== "" && Number(raw) > criterion.max_score
                        ? String(criterion.max_score)
                        : raw;
                    setScores((current) => ({
                      ...current,
                      [criterion.id]: value,
                    }));
                    setSuccess(null);
                    setError(null);
                    pendingPayload.current = null;
                  }}
                  onBlur={(event) => {
                    const raw = event.currentTarget.value;
                    if (raw !== "") {
                      const bounded = Math.max(
                        criterion.min_score,
                        Math.min(criterion.max_score, Number(raw)),
                      );
                      setScores((current) => ({
                        ...current,
                        [criterion.id]: String(bounded),
                      }));
                    }
                  }}
                  required
                />
              </div>
            ))}
          </div>
        </fieldset>
        {error && (
          <p className={styles.message} role="alert">
            {error}
          </p>
        )}
        {conflict && (
          <div className={styles.message} role="alert">
            Проверьте актуальные критерии и введённые баллы. После проверки
            можно продолжить.{" "}
            <button
              type="button"
              onClick={() => {
                setConflict(false);
                setError(null);
                firstInputRef.current?.focus();
              }}
            >
              Проверил оценки
            </button>
          </div>
        )}
        {success && (
          <p className={styles.message} role="status">
            {success}
          </p>
        )}
        {canEdit && (
          <div className={styles.formFooter}>
            <p className={styles.demoNotice}>{submitHint}</p>
            <button
              type="submit"
              className={styles.voteButton}
              disabled={!canSubmit}
            >
              {saveMutation.isPending
                ? "Сохраняем…"
                : work.evaluation?.status === "submitted"
                  ? "Обновить оценку"
                  : "Проголосовать"}
              <span className={styles.voteArrow} aria-hidden="true">
                <ArrowRight size={19} />
              </span>
            </button>
          </div>
        )}
      </form>
      <button
        type="button"
        className={styles.historyButton}
        aria-expanded={historyOpen}
        onClick={() => setHistoryOpen((value) => !value)}
      >
        История оценки
      </button>
      {historyOpen &&
        (historyQuery.isPending ? (
          <p role="status">Загружаем историю…</p>
        ) : historyQuery.isError ? (
          <p role="alert">
            {juryErrorMessage(historyQuery.error)}{" "}
            <button type="button" onClick={() => void historyQuery.refetch()}>
              Повторить
            </button>
          </p>
        ) : historyQuery.data?.length ? (
          <ol className={styles.historyList}>
            {historyQuery.data.map((event) => (
              <li key={event.id}>
                <time dateTime={event.created_at}>{event.created_at}</time> —{" "}
                {historyLabel(event.action)} (версия {event.version})
              </li>
            ))}
          </ol>
        ) : (
          <p role="status">История оценки пуста.</p>
        ))}
    </div>
  );
}

function historyLabel(action: string) {
  switch (action) {
    case "evaluation.created":
      return "оценка создана";
    case "evaluation.updated":
      return "оценка изменена";
    case "evaluation.submitted":
      return "оценка отправлена";
    case "evaluation.locked":
      return "оценка заблокирована";
    default:
      return action;
  }
}
