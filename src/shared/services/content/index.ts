import { $api } from "@/shared/api/axios";
import type {
  ContentNewsParams,
  ContentPaginationParams,
  ContentProjectsParams,
  ContentSlug,
  ContentDocumentsResponse,
} from "@/shared/types/model/content.type";

async function getList<T = unknown>(path: string, params?: ContentPaginationParams, signal?: AbortSignal) {
  const { data } = await $api.get<T>(path, { params, signal });
  return data;
}

async function getItem(path: string, slug: ContentSlug, signal?: AbortSignal) {
  const { data } = await $api.get<unknown>(`${path}/${encodeURIComponent(String(slug))}`, {
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
    getList("/content/events", params, signal),
  getEvent: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem("/content/events", slug, signal),

  getLegalDocuments: (params?: ContentPaginationParams, signal?: AbortSignal) =>
    getList("/content/legal-documents", params, signal),
  getLegalDocument: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem("/content/legal-documents", slug, signal),

  getMedia: (params?: ContentPaginationParams, signal?: AbortSignal) =>
    getList("/content/media", params, signal),
  getMediaItem: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem("/content/media", slug, signal),

  getNews: (params?: ContentNewsParams, signal?: AbortSignal) =>
    getList("/content/news", params, signal),
  getNewsItem: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem("/content/news", slug, signal),

  getProjects: (params?: ContentProjectsParams, signal?: AbortSignal) =>
    getList("/content/projects", params, signal),
  getProject: (slug: ContentSlug, signal?: AbortSignal) =>
    getItem("/content/projects", slug, signal),
};
