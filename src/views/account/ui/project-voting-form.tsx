"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Pencil } from "lucide-react";
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
  const [showEditButton, setShowEditButton] = useState(false);
  const [scores, setScores] = useState<Record<string, string>>({});
  const firstScoreInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowEditButton(true);
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onChange={() => setShowEditButton(false)}
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
                ref={index === 0 ? firstScoreInputRef : undefined}
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
        <button
          type={showEditButton ? "button" : "submit"}
          className={styles.voteButton}
          onClick={showEditButton ? (event) => {
            event.preventDefault();
            setShowEditButton(false);
            firstScoreInputRef.current?.focus();
          } : undefined}
        >
          {showEditButton ? "Редактировать" : "Проголосовать"}
          <span className={styles.voteArrow} aria-hidden="true">
            {showEditButton ? <Pencil size={19} /> : <ArrowRight size={19} />}
          </span>
        </button>
      </div>
    </form>
  );
}
