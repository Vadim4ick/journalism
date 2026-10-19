export type ContentSlug = string | number;

export interface ContentPaginationParams {
  page?: number;
  per_page?: number;
}

export interface ContentNewsParams extends ContentPaginationParams {
  date_from?: string;
  date_to?: string;
}

export interface ContentNews {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  published_at: string;
  published_at_iso: string;
  tags: { id: string; label: string }[];
}

export interface ContentNewsDetail extends ContentNews {
  images: { url: string; description: string }[];
  detail_text: string | null;
}

export type ContentNewsResponse = ApiSuccessResponse<{
  items: ContentNews[];
  pagination: Pagination;
}>;

export type ContentNewsDetailResponse = ApiSuccessResponse<{
  element: ContentNewsDetail;
  seo: SEO;
  related: ContentNews[];
}>;

export interface ContentProjectsParams extends ContentPaginationParams {
  result?: "Y" | "N";
}

export interface ContentDocumentFile {
  url: string;
  name: string;
  size_bytes: number | null;
  extension: string | null;
}

export interface ContentDocument {
  id: number;
  slug: string | null;
  title: string;
  description: string;
  image: unknown;
  published_at: string;
  file: ContentDocumentFile | null;
  section_id: number | null;
  section_name: string | null;
}

export interface ContentDocumentSection {
  id: number | null;
  slug: string | null;
  title: string;
  parent_id: number | null;
  depth: number;
  items: ContentDocument[];
}

export interface ContentDocumentsData {
  sections: ContentDocumentSection[];
  items: ContentDocument[];
  pagination: Pagination;
}

export type ContentDocumentsResponse = ApiSuccessResponse<ContentDocumentsData>;

export interface ContentEvent {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  published_at: string;
  event_start_at: string | null;
  event_end_at: string | null;
  date: string;
  place: string;
  source: string;
  format: string;
}

export interface ContentEventDetail extends ContentEvent {
  images: { url: string; description: string }[];
  detail_text: string | null;
}

export type ContentEventsResponse = ApiSuccessResponse<{
  items: ContentEvent[];
  pagination: Pagination;
}>;

export type ContentEventResponse = ApiSuccessResponse<{
  element: ContentEventDetail;
  seo: SEO;
  related: ContentEvent[];
}>;
