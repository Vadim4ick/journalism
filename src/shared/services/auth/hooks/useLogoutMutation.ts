"use client";

import { authServices } from "..";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { removeTokens } from "@/shared/lib/auth-token";
import { useAuthStore } from "@/state/auth.store";

export function useLogoutMutation() {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const sessionId = useAuthStore.getState().sessionId;
      try {
        return await authServices.logout();
      } finally {
        // Local logout must work even offline. Never clear a newer login.
        if (sessionId === useAuthStore.getState().sessionId) removeTokens();
      }
    },
    onSuccess: () => toast.success("Выход из аккаунта"),
    onError: (error) => {
      if (axios.isCancel(error)) return;
      toast.error("Локальный выход выполнен. Отзыв сессии на сервере не подтверждён.");
    },
  });
}
