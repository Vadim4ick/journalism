import { $serverApi } from "@/shared/api/server-axios";
import type { SearchParams, SearchResponse } from "@/shared/types/model/search.type";

export const searchServices = {
  async getResults(params: SearchParams, signal?: AbortSignal): Promise<SearchResponse> {
    const { data } = await $serverApi.get<SearchResponse>("/search", { params, signal });
    return data;
  },
};
