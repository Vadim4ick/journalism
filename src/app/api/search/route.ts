import { searchServices } from "@/shared/services/search";
import type { SearchSection } from "@/shared/types/model/search.type";

const sections: SearchSection[] = ["all", "news", "events", "media", "documents", "legal-documents", "newspapers"];

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const q = params.get("q")?.trim();
  const section = params.get("section") ?? "all";
  const page = Number(params.get("page") ?? "1");

  if (!q || !sections.includes(section as SearchSection) || !Number.isSafeInteger(page) || page < 1) {
    return Response.json({ message: "Некорректные параметры поиска" }, { status: 400 });
  }

  try {
    const result = await searchServices.getResults(
      { q, section: section as SearchSection, page, per_page: 12 },
      request.signal,
    );
    return Response.json(result);
  } catch {
    return Response.json({ message: "Не удалось выполнить поиск" }, { status: 502 });
  }
}
