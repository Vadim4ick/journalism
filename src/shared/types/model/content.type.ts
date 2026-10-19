export type ContentSlug = string | number;

export interface ContentPaginationParams {
  page?: number;
  per_page?: number;
}

export interface ContentNewsParams extends ContentPaginationParams {
  date_from?: string;
  date_to?: string;
}

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
