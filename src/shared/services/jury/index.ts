import axios from "axios";
import { $apiAuth } from "@/shared/api/axios";
import type {
  JuryContestResponse,
  JuryContestsResponse,
  JuryDashboardResponse,
  JuryEvaluationHistoryResponse,
  JuryEvaluationResponse,
  JuryFinalizePayload,
  JuryFinalizeResponse,
  JuryId,
  JuryNominationsResponse,
  JurySaveEvaluationPayload,
  JurySaveEvaluationResponse,
  JuryWorkResponse,
  JuryWorksParams,
  JuryWorksResponse,
} from "@/shared/types/model/jury.type";

const contestPath = (contestId: JuryId) => `/jury/contests/${encodeURIComponent(String(contestId))}`;
const workPath = (workId: JuryId) => `/jury/works/${encodeURIComponent(String(workId))}`;

export const juryServices = {
  async getDashboard(signal?: AbortSignal): Promise<JuryDashboardResponse> {
    const { data } = await $apiAuth.get<JuryDashboardResponse>("/jury/dashboard", { signal });
    return data;
  },
  async getContests(signal?: AbortSignal): Promise<JuryContestsResponse> {
    const { data } = await $apiAuth.get<JuryContestsResponse>("/jury/contests", { signal });
    return data;
  },
  async getContest(contestId: JuryId, signal?: AbortSignal): Promise<JuryContestResponse> {
    const { data } = await $apiAuth.get<JuryContestResponse>(contestPath(contestId), { signal });
    return data;
  },
  async getNominations(contestId: JuryId, signal?: AbortSignal): Promise<JuryNominationsResponse> {
    const { data } = await $apiAuth.get<JuryNominationsResponse>(`${contestPath(contestId)}/nominations`, { signal });
    return data;
  },
  async getWorks(
    contestId: JuryId,
    nominationId: JuryId,
    params?: JuryWorksParams,
    signal?: AbortSignal,
  ): Promise<JuryWorksResponse> {
    const path = `${contestPath(contestId)}/nominations/${encodeURIComponent(String(nominationId))}/works`;
    const { data } = await $apiAuth.get<JuryWorksResponse>(path, { params, signal });
    return data;
  },
  async getWork(workId: JuryId, signal?: AbortSignal): Promise<JuryWorkResponse> {
    const { data } = await $apiAuth.get<JuryWorkResponse>(workPath(workId), { signal });
    return data;
  },
  async getEvaluation(workId: JuryId, signal?: AbortSignal): Promise<JuryEvaluationResponse> {
    const { data } = await $apiAuth.get<JuryEvaluationResponse>(`${workPath(workId)}/evaluation`, { signal });
    return data;
  },
  async saveEvaluation(
    workId: JuryId,
    payload: JurySaveEvaluationPayload,
    signal?: AbortSignal,
  ): Promise<JurySaveEvaluationResponse> {
    const { data } = await $apiAuth.put<JurySaveEvaluationResponse>(`${workPath(workId)}/evaluation`, payload, { signal });
    return data;
  },
  async getEvaluationHistory(workId: JuryId, signal?: AbortSignal): Promise<JuryEvaluationHistoryResponse> {
    const { data } = await $apiAuth.get<JuryEvaluationHistoryResponse>(`${workPath(workId)}/evaluation/history`, { signal });
    return data;
  },
  async finalize(
    contestId: JuryId,
    payload: JuryFinalizePayload,
    signal?: AbortSignal,
  ): Promise<JuryFinalizeResponse> {
    const { data } = await $apiAuth.post<JuryFinalizeResponse>(`${contestPath(contestId)}/finalize`, payload, { signal });
    return data;
  },
  async getFile(materialUrl: string, signal?: AbortSignal): Promise<Blob> {
    const baseURL = $apiAuth.defaults.baseURL;
    if (!baseURL) throw new Error("Не задан адрес API.");

    const apiBase = new URL(`${baseURL.replace(/\/$/, "")}/`);
    const fileUrl = new URL(materialUrl, apiBase);
    const apiPath = fileUrl.pathname.slice(apiBase.pathname.length);
    if (
      fileUrl.origin !== apiBase.origin ||
      !fileUrl.pathname.startsWith(apiBase.pathname) ||
      !/^jury\/works\/\d+\/files\/[a-f\d]{32}$/i.test(apiPath)
    ) {
      throw new Error("Сервер вернул некорректный адрес файла.");
    }

    try {
      const { data } = await $apiAuth.get<Blob>(`/${apiPath}${fileUrl.search}`, {
        responseType: "blob",
        headers: { Accept: "application/octet-stream" },
        signal,
      });
      return data;
    } catch (error) {
      // Binary responses also turn API errors into Blob; restore their message.
      if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
        try {
          error.response.data = JSON.parse(await error.response.data.text());
        } catch {
          // Keep the HTTP status when the server did not return JSON.
        }
      }
      throw error;
    }
  },
};
