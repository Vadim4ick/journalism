"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ChevronDown, Download, LockKeyhole, PencilLine } from "lucide-react";
import { juryServices } from "@/shared/services/jury";
import type { JuryEvaluationStatus, JuryId, JuryMaterial, JuryWorkSummary } from "@/shared/types/model/jury.type";
import { juryData, juryErrorMessage } from "../model/jury-query";
import { ProjectVotingForm } from "./project-voting-form";
import styles from "./project-voting-page.module.css";

const evaluationStatuses: Record<JuryEvaluationStatus, string> = {
  draft: "Черновик",
  submitted: "Оценка отправлена",
  locked: "Оценка заблокирована",
};

interface Props {
  item: JuryWorkSummary;
  number: number;
  expanded: boolean;
  onToggle: () => void;
  contestId: JuryId;
  sessionId: number;
  forceReadOnly: boolean;
  onDirtyChange: (dirty: boolean) => void;
}

export function ProjectWorkCard({ item, number, expanded, onToggle, contestId, sessionId, forceReadOnly, onDirtyChange }: Props) {
  const cardRef = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setVisible(true));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "300px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const workQuery = useQuery({
    queryKey: ["jury", "work", sessionId, item.id],
    queryFn: async ({ signal }) => {
      const work = juryData(await juryServices.getWork(item.id, signal));
      if (!Array.isArray(work.criteria) || !Array.isArray(work.materials) || !work.nomination || !Number.isInteger(work.criteria_version)) {
        throw new Error("Сервер вернул некорректные данные работы.");
      }
      return work;
    },
    enabled: visible || expanded,
    retry: false,
  });
  const work = workQuery.data;
  const triggerId = `voting-project-${item.id}-trigger`;
  const panelId = `voting-project-${item.id}-panel`;
  const organization = work?.organization ?? item.organization;
  const description = work?.description ?? item.description;
  const evaluation = work?.evaluation;
  const outdatedEvaluation = Boolean(evaluation && evaluation.criteria_version !== work?.criteria_version);

  async function download(material: JuryMaterial) {
    if (downloadingId) {
      return;
    }
    setFileError(null);
    setDownloadingId(material.id);
    try {
      const blob = await juryServices.getFile(material.url);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = material.name || "Материал";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (failure) {
      setFileError(juryErrorMessage(failure));
    } finally {
      setDownloadingId(null);
    }
  }

  return <li ref={cardRef} className={styles.choiceItem}>
    <h3 className={styles.choiceHeading}><button id={triggerId} type="button" className={styles.choiceButton} aria-expanded={expanded} aria-controls={panelId} onClick={onToggle}>
      <span className={styles.choiceNumber} aria-hidden="true">{String(number).padStart(2, "0")}</span>
      <span className={styles.choiceTitle}>{item.title}<span className={styles.workStatus}>{item.evaluation_status ? evaluationStatuses[item.evaluation_status] : "Ещё не оценено"}</span></span>
      <ChevronDown className={styles.choiceArrow} aria-hidden="true" size={22} />
    </button></h3>
    <div className={styles.choiceDetails}>
      {organization && <p className={styles.organization}>{organization}</p>}
      {description && <div className={styles.projectSummary}><h4 className={styles.descriptionTitle}>Описание проекта</h4><p className={styles.projectDescription}>{description}</p></div>}
      {work?.materials.length ? <div className={styles.materials}><h4 className={styles.descriptionTitle}>Материалы проекта</h4><ul>{work.materials.map((material) => <li key={material.id}>
        <button type="button" className={styles.pdfLink} disabled={downloadingId !== null} onClick={() => void download(material)}><Download size={19} aria-hidden="true" />{downloadingId === material.id ? "Загружаем…" : material.name || "Скачать материал"}</button>
      </li>)}</ul></div> : null}
      {evaluation && <div className={styles.evaluationSummary} data-status={evaluation.status}>
        <span className={styles.evaluationIcon} aria-hidden="true">
          {evaluation.status === "locked" ? <LockKeyhole size={24} /> : evaluation.status === "submitted" ? <CheckCircle2 size={25} /> : <PencilLine size={24} />}
        </span>
        <div className={styles.evaluationMeta}>
          <p className={styles.evaluationCaption}>Ваша оценка</p>
          <p className={styles.evaluationLabel}>{evaluationStatuses[evaluation.status]}</p>
          {outdatedEvaluation && <p className={styles.evaluationOutdated}>Критерии изменились — работу нужно оценить заново.</p>}
        </div>
        <div className={styles.evaluationScore}>
          <p className={styles.evaluationCaption}>{outdatedEvaluation ? "Прежний итог" : "Итого"}</p>
          <p><strong>{evaluation.total}</strong> <span>баллов</span></p>
        </div>
      </div>}
      {(visible || expanded) && workQuery.isPending && <p className={styles.message} role="status">Загружаем материалы и критерии…</p>}
      {workQuery.isError && <p className={styles.message} role="alert">{juryErrorMessage(workQuery.error)} <button type="button" onClick={() => void workQuery.refetch()}>Повторить</button></p>}
      {fileError && <p className={styles.message} role="alert">{fileError}</p>}
      <div id={panelId} className={styles.choicePanel} aria-labelledby={triggerId} hidden={!expanded}>
        {expanded && work && <ProjectVotingForm work={work} contestId={contestId} sessionId={sessionId} forceReadOnly={forceReadOnly} onDirtyChange={onDirtyChange} />}
      </div>
    </div>
  </li>;
}
