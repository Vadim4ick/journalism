import type { ContentNews } from "@/shared/types/model/content.type";

function isValidDate(date: string) {
  const parsed = new Date(`${date}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

export function newsDate(news: Pick<ContentNews, "published_at" | "published_at_iso">): string | undefined {
  const isoDate = news.published_at_iso?.slice(0, 10);
  if (isoDate && /^\d{4}-\d{2}-\d{2}$/.test(isoDate) && isValidDate(isoDate)) return isoDate;

  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(news.published_at);
  if (!match) return undefined;

  const [, day, month, year] = match;
  const date = `${year}-${month}-${day}`;
  return isValidDate(date) ? date : undefined;
}
