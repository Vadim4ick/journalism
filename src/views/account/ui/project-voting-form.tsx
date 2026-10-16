"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import styles from "./project-voting-page.module.css";

const criteria = [
  {
    id: "context",
    title: "Исходная ситуация и коммуникационные потребности",
    description: "Глубина и системность описания и анализа",
  },
  {
    id: "audience",
    title: "Целевые аудитории",
    description: "Их описание, анализ и инсайты",
  },
  {
    id: "goals",
    title: "Цель и задачи проекта",
    description: "Их сложность, масштабность и значимость",
  },
  {
    id: "strategy",
    title: "Коммуникационная стратегия",
    description: "Её соответствие ситуации и целям проекта",
  },
  {
    id: "concept",
    title: "Креативная концепция",
    description:
      "Её оригинальность и соответствие целевым аудиториям и задачам проекта",
  },
  {
    id: "tools",
    title: "Тактики и инструменты",
    description: "Их комплексность, разнообразие и качество исполнения",
  },
  {
    id: "results",
    title: "Измерение и оценка результативности проекта",
    description: "Достижение целей и выполнение поставленных задач",
  },
] as const;

export function ProjectVotingForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, string>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Отправка голосов пока не подключена. Оценки не сохранены.");
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onChange={() => setStatus(null)}
    >
      <fieldset>
        <legend className={styles.formTitle}>Критерии оценки</legend>
        <p className={styles.formHint} id="score-hint">
          Оцените каждый пункт по шкале от 1 до 7.
        </p>
        <div className={styles.criteriaList}>
          {criteria.map((criterion, index) => (
            <div className={styles.criterion} key={criterion.id}>
              <span className={styles.criterionNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.criterionText}>
                <label
                  htmlFor={`score-${criterion.id}`}
                  className={styles.criterionTitle}
                >
                  {criterion.title}
                </label>
                <p className={styles.criterionDescription}>
                  {criterion.description}
                </p>
              </div>
              <input
                id={`score-${criterion.id}`}
                name={criterion.id}
                className={styles.scoreInput}
                type="text"
                inputMode="numeric"
                pattern="[1-7]"
                maxLength={1}
                placeholder="1–7"
                aria-describedby="score-hint"
                value={scores[criterion.id] ?? ""}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  if (value === "" || /^[1-7]$/.test(value)) {
                    setScores((current) => ({ ...current, [criterion.id]: value }));
                  }
                }}
                required
              />
            </div>
          ))}
        </div>
      </fieldset>

      <div className={styles.formFooter}>
        <p className={styles.demoNotice}></p>
        <button type="submit" className={styles.voteButton}>
          Проголосовать
          <span className={styles.voteArrow} aria-hidden="true">
            <ArrowRight size={19} />
          </span>
        </button>
      </div>
      {status && (
        <p className={styles.status} role="status">
          {status}
        </p>
      )}
    </form>
  );
}
