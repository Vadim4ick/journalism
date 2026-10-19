import type { ContentPaginationParams } from "./content.type";

export type SearchResultSection =
  | "news"
  | "events"
  | "media"
  | "documents"
  | "legal-documents"
  | "newspapers";

export type SearchSection = "all" | SearchResultSection;

export interface SearchParams extends ContentPaginationParams {
  q: string;
  section?: SearchSection;
}

export interface SearchResult {
  id: number;
  slug?: string | null;
  section: SearchResultSection;
  section_title: string;
  title: string;
  description: string;
  image: string | null;
  url: string;
  published_at: string | null;
}

export type SearchResponse = ApiSuccessResponse<{
  query: string;
  section: SearchSection;
  items: SearchResult[];
  pagination: Pagination;
}>;
