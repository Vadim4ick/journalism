"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { Popover } from "@base-ui/react/popover";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./newspaper-calendar.module.css";

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const fullWeekdays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
const monthFormat = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });
const dayFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dateFromKey(value: string) {
  return new Date(`${value}T12:00:00`);
}

export function NewspaperCalendar({ slug, selectedDate, initialDate }: { slug: string; selectedDate?: string; initialDate: string }) {
  const basePath = `/newspapers/${encodeURIComponent(slug)}`;
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(() => dateFromKey(selectedDate ?? initialDate));
  const [month, setMonth] = useState(() => new Date(focused.getFullYear(), focused.getMonth(), 1));
  const tableRef = useRef<HTMLTableElement>(null);
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const offset = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const rowCount = Math.ceil((offset + daysInMonth) / 7);

  function changeMonth(delta: number) {
    const next = new Date(year, monthIndex + delta, 1);
    setMonth(next);
    setFocused(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLAnchorElement>, date: Date) {
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
    setFocused(next);
    if (next.getMonth() !== monthIndex || next.getFullYear() !== year) {
      setMonth(new Date(next.getFullYear(), next.getMonth(), 1));
    }
    requestAnimationFrame(() => tableRef.current?.querySelector<HTMLAnchorElement>(`[data-date="${dateKey(next)}"]`)?.focus());
  }

  return (
    <div className={styles.filterBar}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger className={styles.trigger}>
          <CalendarDays aria-hidden="true" size={18} />
          <span>{selectedDate ? selectedDate.split("-").reverse().join(".") : "Выбрать дату"}</span>
          <ChevronDown aria-hidden="true" size={16} className={styles.triggerChevron} />
        </Popover.Trigger>
        {selectedDate && <Link href={`${basePath}#issues-heading`} className={styles.clear}>Сбросить</Link>}
        <Popover.Portal>
          <Popover.Positioner side="bottom" align="end" sideOffset={8} className={styles.positioner}>
            <Popover.Popup className={styles.calendar}>
              <Popover.Title className={styles.title}>Выберите дату выпуска</Popover.Title>
              <div className={styles.monthHeader}>
                <button type="button" onClick={() => changeMonth(-1)} className={styles.navigation} aria-label="Предыдущий месяц"><ChevronLeft aria-hidden="true" size={18} /></button>
                <span aria-live="polite" className={styles.month}>{monthFormat.format(month).replace(/ г\.$/, "")}</span>
                <button type="button" onClick={() => changeMonth(1)} className={styles.navigation} aria-label="Следующий месяц"><ChevronRight aria-hidden="true" size={18} /></button>
              </div>
              <table ref={tableRef} className={styles.grid}>
                <caption className="sr-only">Календарь фильтра выпусков по дате</caption>
                <thead><tr>{weekdays.map((day, index) => <th scope="col" key={day} aria-label={fullWeekdays[index]}>{day}</th>)}</tr></thead>
                <tbody>{Array.from({ length: rowCount }, (_, week) => (
                  <tr key={week}>{weekdays.map((_, day) => {
                    const number = week * 7 + day - offset + 1;
                    if (number < 1 || number > daysInMonth) return <td key={day} />;
                    const date = new Date(year, monthIndex, number);
                    const key = dateKey(date);
                    return <td key={day}>
                      <Link
                        href={`${basePath}?date=${key}#issues-heading`}
                        data-date={key}
                        aria-label={`Показать выпуски за ${dayFormat.format(date)}`}
                        aria-current={selectedDate === key ? "date" : undefined}
                        tabIndex={dateKey(focused) === key ? 0 : -1}
                        onClick={() => setOpen(false)}
                        onFocus={() => setFocused(date)}
                        onKeyDown={(event) => handleKeyDown(event, date)}
                        className={styles.day}
                      >{number}</Link>
                    </td>;
                  })}</tr>
                ))}</tbody>
              </table>
              <p className="sr-only">Стрелки перемещают по дням, Page Up и Page Down меняют месяц. Enter открывает выпуски выбранного дня.</p>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
