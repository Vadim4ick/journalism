import type { Profile } from "@/shared/types/model/auth.type";
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  profile: Profile | null;
  hasSession: boolean;
  initialized: boolean;
  sessionId: number;
  initialize: (token: string | null, hasSession: boolean) => void;
  startSession: (token: string) => void;
  setAccessToken: (token: string | null) => void;
  setProfile: (profile: Profile | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  profile: null,
  hasSession: false,
  initialized: false,
  sessionId: 0,

  initialize: (token, hasSession) => set((state) => state.initialized ? state : {
    accessToken: token, hasSession, initialized: true,
  }),
  startSession: (token) => set((state) => ({
    accessToken: token, profile: null, hasSession: true,
    initialized: true, sessionId: state.sessionId + 1,
  })),
  setAccessToken: (token) => set({ accessToken: token }),
  setProfile: (profile) => set({ profile }),
  clearAuth: () => set((state) => ({
    accessToken: null, profile: null, hasSession: false,
    initialized: true, sessionId: state.sessionId + 1,
  })),
}));
