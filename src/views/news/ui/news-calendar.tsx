"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/shared/ui/button";
import { SiteImage } from "@/components/site-image";
import { formatDateRange, isDateInRange, selectRangeDate, type NewsDateRange } from "../model/date-range";
import styles from "./news-calendar.module.css";

const WEEKDAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const FULL_WEEKDAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
const monthFormat = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });
const dayFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function NewsCalendar({ dates, selected, initialDate, onSelect }: {
  dates: readonly string[];
  selected?: NewsDateRange;
  initialDate: string;
  onSelect: (range?: NewsDateRange) => void;
}) {
  // Open on the latest publication so the marked dates correspond to actual data.
  const latestDate = [...dates].sort().at(-1);
  const [focused, setFocused] = useState(() => new Date(`${selected?.from ?? latestDate ?? initialDate}T12:00:00`));
  const [month, setMonth] = useState(() => new Date(focused.getFullYear(), focused.getMonth(), 1));
  const calendarRef = useRef<HTMLTableElement>(null);
  const titleId = useId();
  const hintId = useId();
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const offset = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const rowCount = Math.ceil((offset + daysInMonth) / 7);
  const availableDates = new Set(dates);

  function changeMonth(delta: number) {
    const next = new Date(year, monthIndex + delta, 1);
    setMonth(next);
    setFocused(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, date: Date) {
    const next = new Date(date);
    const weekday = (date.getDay() + 6) % 7;
    switch (event.key) {
      case "ArrowLeft": next.setDate(date.getDate() - 1); break;
      case "ArrowRight": next.setDate(date.getDate() + 1); break;
      case "ArrowUp": next.setDate(date.getDate() - 7); break;
      case "ArrowDown": next.setDate(date.getDate() + 7); break;
      case "Home": next.setDate(date.getDate() - weekday); break;
      case "End": next.setDate(date.getDate() + 6 - weekday); break;
      case "PageUp":
      case "PageDown": {
        const delta = (event.key === "PageUp" ? -1 : 1) * (event.shiftKey ? 12 : 1);
        next.setDate(1);
        next.setMonth(date.getMonth() + delta);
        next.setDate(Math.min(date.getDate(), new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
        break;
      }
      default: return;
    }
    event.preventDefault();
    setMonth(new Date(next.getFullYear(), next.getMonth(), 1));
    setFocused(next);
    requestAnimationFrame(() => calendarRef.current?.querySelector<HTMLButtonElement>(`[data-date="${dateKey(next)}"]`)?.focus());
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <Button variant="ghost" size="icon" aria-label="Предыдущий месяц" onClick={() => changeMonth(-1)} className={styles.navigation}>
          <SiteImage src="/images/news/calendar-prev.svg" alt="" width={30} height={30} />
          <span className="text-mode-only" aria-hidden="true">‹</span>
        </Button>
        <span id={titleId} aria-live="polite" className={styles.month}>{monthFormat.format(month).replace(/ г\.$/, "")}</span>
        <Button variant="ghost" size="icon" aria-label="Следующий месяц" onClick={() => changeMonth(1)} className={styles.navigation}>
          <SiteImage src="/images/news/calendar-next.svg" alt="" width={30} height={30} />
          <span className="text-mode-only" aria-hidden="true">›</span>
        </Button>
      </div>
      <div className={styles.calendarViewport}>
      <table ref={calendarRef} role="grid" aria-multiselectable="true" aria-labelledby={titleId} aria-describedby={hintId} className={styles.grid}>
        <thead><tr>{WEEKDAYS.map((day, index) => <th scope="col" key={day} aria-label={FULL_WEEKDAYS[index]}>{day}</th>)}</tr></thead>
        <tbody>{Array.from({ length: rowCount }, (_, week) => (
          <tr key={week}>{WEEKDAYS.map((_, day) => {
            const number = week * 7 + day - offset + 1;
            if (number < 1 || number > daysInMonth) return <td key={day} />;
            const date = new Date(year, monthIndex, number);
            const key = dateKey(date);
            const hasNews = availableDates.has(key);
            const inRange = selected ? isDateInRange(key, selected) : false;
            const start = selected?.from === key;
            const end = selected?.to === key;
            const connected = inRange && Boolean(selected?.to && selected.to !== selected.from);
            return (
              <td key={day} aria-selected={inRange} data-in-range={connected || undefined}
                data-range-start={start || undefined} data-range-end={end || undefined}>
                <Button variant="ghost" className={styles.day}
                  data-date={key} data-has-news={hasNews || undefined}
                  data-boundary={start || end || undefined}
                  aria-label={`${dayFormat.format(date)}${hasNews ? ", есть новости" : ""}${start ? ", начало диапазона" : ""}${end ? ", конец диапазона" : ""}`}
                  aria-pressed={inRange}
                  tabIndex={dateKey(focused) === key ? 0 : -1}
                  onFocus={() => setFocused(date)}
                  onKeyDown={(event) => handleKeyDown(event, date)}
                  onClick={() => onSelect(selectRangeDate(selected, key))}
                >{number}</Button>
              </td>
            );
          })}</tr>
        ))}</tbody>
      </table>
      </div>
      <div className={styles.selection}>
        {selected && <p className={styles.rangeLabel}>{formatDateRange(selected)}</p>}
        <p id={hintId} aria-live="polite" className={styles.hint}>
          {!selected ? "Выберите начало и конец периода" : !selected.to ? "Теперь выберите конечную дату" : "Выберите дату, чтобы начать новый период"}
        </p>
      </div>
      <span className="sr-only">Подчеркнуты даты новостей на текущей странице. Стрелки перемещают фокус, Page Up и Page Down меняют месяц. Для одного дня выберите одну дату дважды.</span>
    </div>
  );
}
