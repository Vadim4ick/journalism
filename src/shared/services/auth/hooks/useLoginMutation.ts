"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { CanceledError } from "axios";
import { toast } from "sonner";
import { authServices } from "..";
import type { LoginParams } from "@/shared/types/model/auth.type";
import { saveTokens } from "@/shared/lib/auth-token";
import { useAuthStore } from "@/state/auth.store";

type LoginVariables = LoginParams & { rememberMe?: boolean };

export function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (error.response?.status === 401) return "Неверный логин или пароль.";
    if (!error.response) return "Не удалось связаться с сервером. Попробуйте снова.";
    return "Ошибка входа. Попробуйте снова.";
  }
  return "Не удалось войти. Попробуйте снова.";
}

export function useLoginMutation({ showToasts = true }: { showToasts?: boolean } = {}) {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ rememberMe = true, ...payload }: LoginVariables) => {
      const sessionId = useAuthStore.getState().sessionId;
      const response = await authServices.login(payload);
      if (sessionId !== useAuthStore.getState().sessionId) {
        throw new CanceledError("Сессия изменилась");
      }
      saveTokens(response.data, true, rememberMe);
      return response;
    },
    // The new session's query key triggers /auth/me once in AuthProvider.
    onSuccess: (response) => {
      if (showToasts) toast.success(response.message);
    },
    onError: (error) => {
      if (!showToasts || axios.isCancel(error)) return;
      toast.error(getLoginErrorMessage(error));
    },
  });
}
