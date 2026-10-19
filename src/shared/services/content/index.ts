import { $serverApi } from "@/shared/api/server-axios";
import type {
  ContentNewsParams,
  ContentPaginationParams,
  ContentProjectsParams,
  ContentSlug,
  ContentDocumentsResponse,
  ContentDocumentDetailResponse,
  ContentLegalDocumentsResponse,
  ContentLegalDocumentResponse,
  ContentEventsResponse,
  ContentEventResponse,
  ContentNewsResponse,
  ContentNewsDetailResponse,
  ContentMediaResponse,
  ContentMediaDetailResponse,
  ContentProjectsResponse,
  ContentNewspaperIssuesParams,
  ContentNewspapersResponse,
  ContentNewspaperResponse,
} from "@/shared/types/model/content.type";

async function getList<T = unknown>(path: string, params?: ContentPaginationParams, signal?: AbortSignal) {
  const { data } = await $serverApi.get<T>(path, { params, signal });
  return data;
}

async function getItem<T = unknown>(path: string, slug: ContentSlug, signal?: AbortSignal, params?: ContentNewspaperIssuesParams) {
  const { data } = await $serverApi.get<T>(`${path}/${encodeURIComponent(String(slug))}`, {
    signal,
    params,
  });
  return data;
}

export const contentServices = {
  getDocuments: (params?: ContentPaginationParams, signal?: AbortSignal) =>
    getList<ContentDocumentsResponse>("/content/documents", params, signal),
  getDocument: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem<ContentDocumentDetailResponse>("/content/documents", slug, signal),
  getFile: (id: number, signal?: AbortSignal) => {
    const base = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");
    if (!base) throw new Error("Не задан NEXT_PUBLIC_SERVER_URL");
    return fetch(`${base}/api/v1/content/files/${encodeURIComponent(String(id))}`, {
      signal,
      cache: "no-store",
      headers: { Accept: "*/*" },
      redirect: "error",
    });
  },

  getEvents: (params?: ContentPaginationParams, signal?: AbortSignal) =>
    getList<ContentEventsResponse>("/content/events", params, signal),
  getEvent: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem<ContentEventResponse>("/content/events", slug, signal),

  getLegalDocuments: (params?: ContentPaginationParams, signal?: AbortSignal) =>
    getList<ContentLegalDocumentsResponse>("/content/legal-documents", params, signal),
  getLegalDocument: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem<ContentLegalDocumentResponse>("/content/legal-documents", slug, signal),

  getMedia: (params?: ContentPaginationParams, signal?: AbortSignal) =>
    getList<ContentMediaResponse>("/content/media", params, signal),
  getMediaItem: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem<ContentMediaDetailResponse>("/content/media", slug, signal),

  getNews: (params?: ContentNewsParams, signal?: AbortSignal) =>
    getList<ContentNewsResponse>("/content/news", params, signal),
  getNewsItem: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem<ContentNewsDetailResponse>("/content/news", slug, signal),

  getProjects: (params?: ContentProjectsParams, signal?: AbortSignal) =>
    getList<ContentProjectsResponse>("/content/projects", params, signal),
  getProject: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem("/content/projects", slug, signal),

  getNewspapers: (params?: ContentPaginationParams, signal?: AbortSignal) =>
    getList<ContentNewspapersResponse>("/content/newspapers", params, signal),
  getNewspaper: (slug: ContentSlug, params?: ContentNewspaperIssuesParams, signal?: AbortSignal) =>
    getItem<ContentNewspaperResponse>("/content/newspapers", slug, signal, params),
};
