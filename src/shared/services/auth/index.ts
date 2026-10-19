import { $api, $apiAuth, refreshSession } from "../../api/axios";
import type { LoginParams, LoginResponse, LogoutResponse, MeResponse, Profile } from "@/shared/types/model/auth.type";

export const authServices = {
  async login(payload: LoginParams): Promise<LoginResponse> {
    const { data } = await $api.post<LoginResponse>("/auth/login", payload);
    return data;
  },
  async getMe(signal?: AbortSignal): Promise<Profile> {
    const { data } = await $apiAuth.get<MeResponse>("/auth/me", { signal });
    const profile = data?.data;
    if (!profile || typeof profile.full_name !== "string") {
      throw new Error("Некорректный ответ сервера при загрузке профиля");
    }
    return profile;
  },
  refresh: refreshSession,
  async logout(): Promise<LogoutResponse> {
    const { data } = await $apiAuth.post<LogoutResponse>("/auth/logout");
    return data;
  },
};
