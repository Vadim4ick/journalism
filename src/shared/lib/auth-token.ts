import Cookies from "js-cookie";
import { EnumTokens } from "../const/const";
import { useAuthStore } from "@/state/auth.store";
import type { LoginResponseData } from "../types/model/auth.type";

export function saveTokens(
  tokens: LoginResponseData,
  newSession = false,
  rememberMe = newSession || Cookies.get(EnumTokens.REMEMBER_ME) !== "0",
) {
  if (
    !tokens || typeof tokens.access_token !== "string" || !tokens.access_token ||
    typeof tokens.refresh_token !== "string" || !tokens.refresh_token ||
    typeof tokens.token_type !== "string" || tokens.token_type.toLowerCase() !== "bearer" ||
    !Number.isFinite(tokens.access_expires_in) || tokens.access_expires_in <= 0 ||
    !Number.isFinite(tokens.refresh_expires_in) || tokens.refresh_expires_in <= 0
  ) {
    throw new Error("Некорректный ответ сервера авторизации");
  }

  const options = {
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
  Cookies.set(EnumTokens.ACCESS_TOKEN, tokens.access_token, {
    ...options, ...(rememberMe ? { expires: tokens.access_expires_in / 86400 } : {}),
  });
  Cookies.set(EnumTokens.REFRESH_TOKEN, tokens.refresh_token, {
    ...options, ...(rememberMe ? { expires: tokens.refresh_expires_in / 86400 } : {}),
  });
  // Keep the login choice when the token pair rotates, including after a reload.
  Cookies.set(EnumTokens.REMEMBER_ME, rememberMe ? "1" : "0", {
    ...options, ...(rememberMe ? { expires: tokens.refresh_expires_in / 86400 } : {}),
  });

  const state = useAuthStore.getState();
  if (newSession) state.startSession(tokens.access_token);
  else state.setAccessToken(tokens.access_token);
}

export function removeTokens() {
  Cookies.remove(EnumTokens.ACCESS_TOKEN, { path: "/" });
  Cookies.remove(EnumTokens.REFRESH_TOKEN, { path: "/" });
  Cookies.remove(EnumTokens.REMEMBER_ME, { path: "/" });
  useAuthStore.getState().clearAuth();
}

// Cookies are the source of truth: the in-memory token can outlive its cookie.
export function getAccessToken() {
  return Cookies.get(EnumTokens.ACCESS_TOKEN) || null;
}

export function getRefreshToken() {
  return Cookies.get(EnumTokens.REFRESH_TOKEN) || null;
}

export function initializeAuth() {
  const token = getAccessToken();
  useAuthStore.getState().initialize(token, Boolean(token || getRefreshToken()));
}
