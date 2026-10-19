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

export interface ContentMedia {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  published_at: string;
  photo_count: number;
  images: { url: string; description: string }[];
}

export interface ContentMediaDetail extends ContentMedia {
  detail_text: string | null;
}

export type ContentMediaResponse = ApiSuccessResponse<{
  items: ContentMedia[];
  pagination: Pagination;
}>;

export type ContentMediaDetailResponse = ApiSuccessResponse<{
  element: ContentMediaDetail;
  seo: SEO;
}>;

export interface ContentProjectsParams extends ContentPaginationParams {
  result?: "Y" | "N";
}

export interface ContentProject {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  published_at: string;
  is_completed: boolean;
}

export type ContentProjectsResponse = ApiSuccessResponse<{
  items: ContentProject[];
  pagination: Pagination;
}>;

export interface ContentNewspaper {
  id: number;
  slug: string;
  name: string;
  short_name: string;
  logo: string | null;
  website: string | null;
  municipality: string | null;
  socials: string[];
  description: string;
  sort: number;
  issues_count: number;
}

export interface ContentNewspaperIssue {
  id: number;
  slug: string;
  title: string;
  description: string;
  issue_number: string;
  date: string;
  date_iso: string;
  image: string | null;
  file: ContentDocumentFile | null;
}

export interface ContentNewspaperIssuesParams extends ContentPaginationParams {
  date?: string;
}

export type ContentNewspapersResponse = ApiSuccessResponse<{
  items: ContentNewspaper[];
  pagination: Pagination;
}>;

export type ContentNewspaperResponse = ApiSuccessResponse<{
  section: ContentNewspaper;
  items: ContentNewspaperIssue[];
  pagination: Pagination;
  seo: SEO;
}>;

export interface ContentDocumentFile {
  id?: number | null;
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

export type ContentDocumentDetailResponse = ApiSuccessResponse<{
  element: ContentDocument;
  seo: SEO;
}>;

export interface ContentLegalDocument extends Omit<ContentDocument, "slug" | "image"> {
  slug: string;
  image: string | null;
}

export interface ContentLegalDocumentDetail extends ContentLegalDocument {
  images: { url: string; description: string }[];
  detail_text: string | null;
}

export type ContentLegalDocumentsResponse = ApiSuccessResponse<{
  items: ContentLegalDocument[];
  pagination: Pagination;
}>;

export type ContentLegalDocumentResponse = ApiSuccessResponse<{
  element: ContentLegalDocumentDetail;
  seo: SEO;
}>;

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
