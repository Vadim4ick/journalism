import { $serverApi } from "@/shared/api/server-axios";
import type { SiteSettingsResponse } from "@/shared/types/model/settings.type";

export const settingsServices = {
  async getSettings(signal?: AbortSignal): Promise<SiteSettingsResponse> {
    const { data } = await $serverApi.get<SiteSettingsResponse>("/settings", { signal });
    return data;
  },
};
