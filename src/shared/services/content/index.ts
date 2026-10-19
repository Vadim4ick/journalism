import { $serverApi } from "@/shared/api/server-axios";
import type {
  ContentNewsParams,
  ContentPaginationParams,
  ContentProjectsParams,
  ContentSlug,
  ContentDocumentsResponse,
  ContentEventsResponse,
  ContentEventResponse,
  ContentNewsResponse,
  ContentNewsDetailResponse,
} from "@/shared/types/model/content.type";

async function getList<T = unknown>(path: string, params?: ContentPaginationParams, signal?: AbortSignal) {
  const { data } = await $serverApi.get<T>(path, { params, signal });
  return data;
}

async function getItem<T = unknown>(path: string, slug: ContentSlug, signal?: AbortSignal) {
  const { data } = await $serverApi.get<T>(`${path}/${encodeURIComponent(String(slug))}`, {
    signal,
  });
  return data;
}

export const contentServices = {
  getDocuments: (params?: ContentPaginationParams, signal?: AbortSignal) =>
    getList<ContentDocumentsResponse>("/content/documents", params, signal),
  getDocument: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem("/content/documents", slug, signal),

  getEvents: (params?: ContentPaginationParams, signal?: AbortSignal) =>
    getList<ContentEventsResponse>("/content/events", params, signal),
  getEvent: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem<ContentEventResponse>("/content/events", slug, signal),

  getLegalDocuments: (params?: ContentPaginationParams, signal?: AbortSignal) =>
    getList("/content/legal-documents", params, signal),
  getLegalDocument: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem("/content/legal-documents", slug, signal),

  getMedia: (params?: ContentPaginationParams, signal?: AbortSignal) =>
    getList("/content/media", params, signal),
  getMediaItem: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem("/content/media", slug, signal),

  getNews: (params?: ContentNewsParams, signal?: AbortSignal) =>
    getList<ContentNewsResponse>("/content/news", params, signal),
  getNewsItem: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem<ContentNewsDetailResponse>("/content/news", slug, signal),

  getProjects: (params?: ContentProjectsParams, signal?: AbortSignal) =>
    getList("/content/projects", params, signal),
  getProject: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem("/content/projects", slug, signal),
};
