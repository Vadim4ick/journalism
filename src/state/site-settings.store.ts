import { create } from "zustand";
import type { SiteSettings } from "@/shared/types/model/settings.type";

type SettingsStatus = "idle" | "loading" | "success" | "error";

interface SiteSettingsState {
  settings: SiteSettings | null;
  status: SettingsStatus;
  setLoading: () => void;
  setSettings: (settings: SiteSettings) => void;
  setError: () => void;
}

export const useSiteSettingsStore = create<SiteSettingsState>()((set) => ({
  settings: null,
  status: "idle",
  setLoading: () => set({ status: "loading" }),
  setSettings: (settings) => set({ settings, status: "success" }),
  setError: () => set({ status: "error" }),
}));
