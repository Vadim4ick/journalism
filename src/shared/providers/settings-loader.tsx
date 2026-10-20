"use client";

import { useEffect } from "react";
import { settingsServices } from "@/shared/services/settings";
import { useSiteSettingsStore } from "@/state/site-settings.store";

export function SettingsLoader() {
  useEffect(() => {
    const controller = new AbortController();
    useSiteSettingsStore.getState().setLoading();

    settingsServices.getSettings(controller.signal)
      .then((response) => {
        if (response.status !== "success" || !response.data) {
          throw new Error("Не удалось загрузить настройки сайта");
        }
        if (!controller.signal.aborted) {
          useSiteSettingsStore.getState().setSettings(response.data);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          useSiteSettingsStore.getState().setError();
        }
      });

    return () => controller.abort();
  }, []);

  return null;
}
