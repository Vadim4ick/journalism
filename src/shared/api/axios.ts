import axios, { CanceledError, type InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  saveTokens,
} from "../lib/auth-token";
import { useAuthStore } from "@/state/auth.store";
import type { LoginResponse } from "../types/model/auth.type";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");
const options = {
  baseURL: serverUrl ? `${serverUrl}/api/v1` : undefined,
  headers: { Accept: "application/json" },
  timeout: 15000,
};

export const $api = axios.create(options);
export const $apiAuth = axios.create(options);

function requireServerUrl(config: InternalAxiosRequestConfig) {
  if (!serverUrl) throw new Error("Не задан NEXT_PUBLIC_SERVER_URL");
  return config;
}

$api.interceptors.request.use(requireServerUrl);

type AuthRequestConfig = InternalAxiosRequestConfig & {
  _authSessionId?: number;
  _authRetried?: boolean;
  _authRetryToken?: string;
};

let pendingRefresh: {
  sessionId: number;
  promise: Promise<LoginResponse>;
} | null = null;

export function refreshSession(): Promise<LoginResponse> {
  const sessionId = useAuthStore.getState().sessionId;
  if (pendingRefresh?.sessionId === sessionId) return pendingRefresh.promise;

  const token = getRefreshToken();
  if (!token) {
    removeTokens();
    return Promise.reject(new Error("Сессия истекла. Войдите снова."));
  }

  const promise = $api
    .post<LoginResponse>("/auth/refresh", { token })
    .then(({ data }) => {
      if (sessionId !== useAuthStore.getState().sessionId) {
        throw new CanceledError("Сессия изменилась");
      }
      saveTokens(data.data);
      return data;
    })
    .catch((error: unknown) => {
      if (
        sessionId === useAuthStore.getState().sessionId &&
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        removeTokens();
      }
      throw error;
    })
    .finally(() => {
      if (pendingRefresh?.promise === promise) pendingRefresh = null;
    });

  pendingRefresh = { sessionId, promise };
  return promise;
}

$apiAuth.interceptors.request.use(async (config: AuthRequestConfig) => {
  requireServerUrl(config);
  config._authSessionId ??= useAuthStore.getState().sessionId;
  if (config._authSessionId !== useAuthStore.getState().sessionId) {
    throw new CanceledError("Сессия изменилась");
  }

  // Use the token returned by refresh if reading its cookie fails. Prefer the
  // cookie when another request has already rotated the token again.
  let token = getAccessToken() ?? config._authRetryToken;
  if (!token && getRefreshToken()) {
    const refreshed = await refreshSession();
    token = refreshed.data.access_token;
  }

  if (config._authSessionId !== useAuthStore.getState().sessionId) {
    throw new CanceledError("Сессия изменилась");
  }
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  else config.headers.delete("Authorization");
  return config;
});

$apiAuth.interceptors.response.use(
  (response) => {
    const config = response.config as AuthRequestConfig;
    if (config._authSessionId !== useAuthStore.getState().sessionId) {
      throw new CanceledError("Сессия изменилась");
    }
    return response;
  },
  async (error: unknown) => {
    if (
      !axios.isAxiosError(error) ||
      !error.config ||
      error.response?.status !== 401
    )
      throw error;
    const config = error.config as AuthRequestConfig;
    if (config._authSessionId !== useAuthStore.getState().sessionId)
      throw error;

    if (config._authRetried) {
      // A 401 without credentials does not prove that the saved pair is invalid.
      if (config.headers.get("Authorization")) removeTokens();
      throw error;
    }
    config._authRetried = true;

    // A late 401 may belong to the previous token, already refreshed by another request.
    const currentToken = getAccessToken();
    if (
      !currentToken ||
      config.headers.get("Authorization") === `Bearer ${currentToken}`
    ) {
      const refreshed = await refreshSession();
      config._authRetryToken = refreshed.data.access_token;
    } else {
      config._authRetryToken = currentToken;
    }
    return $apiAuth.request(config);
  },
);
