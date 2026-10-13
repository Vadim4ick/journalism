export type NewsDateRange = { from: string; to?: string };

/** ISO calendar dates compare lexically, without time-zone conversions. */
export function selectRangeDate(range: NewsDateRange | undefined, date: string): NewsDateRange {
  if (!range || range.to) return { from: date };
  return date < range.from ? { from: date, to: range.from } : { from: range.from, to: date };
}

export function isDateInRange(date: string, range: NewsDateRange) {
  return date >= range.from && date <= (range.to ?? range.from);
}

const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

export function formatDateRange(range: NewsDateRange) {
  const from = new Date(`${range.from}T12:00:00`);
  return !range.to || range.to === range.from
    ? dateFormat.format(from)
    : dateFormat.formatRange(from, new Date(`${range.to}T12:00:00`));
}
