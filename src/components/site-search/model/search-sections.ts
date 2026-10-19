import type { SearchSection } from "@/shared/types/model/search.type";

export const searchSections: { value: SearchSection; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "news", label: "Новости" },
  { value: "events", label: "Предстоящие события" },
  { value: "media", label: "Фотогалерея" },
  { value: "documents", label: "Документы" },
  { value: "legal-documents", label: "Правовые документы" },
  { value: "newspapers", label: "Газетный киоск" },
];
