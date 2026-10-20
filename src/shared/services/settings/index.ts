import { $api } from "@/shared/api/axios";
import type { SiteSettingsResponse } from "@/shared/types/model/settings.type";

export const settingsServices = {
  async getSettings(signal?: AbortSignal): Promise<SiteSettingsResponse> {
    const { data } = await $api.get<SiteSettingsResponse>("/settings", { signal });
    return data;
  },
};
