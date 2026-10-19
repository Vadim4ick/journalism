"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authServices } from "@/shared/services/auth";
import { useAuthStore } from "@/state/auth.store";

type UseGetProfileParams = { enabled?: boolean };

export function useGetProfile({ enabled = true }: UseGetProfileParams = {}) {
  const hasSession = useAuthStore((state) => state.hasSession);
  const initialized = useAuthStore((state) => state.initialized);
  const sessionId = useAuthStore((state) => state.sessionId);

  const query = useQuery({
    queryKey: ["me", sessionId],
    queryFn: ({ signal }) => authServices.getMe(signal),
    enabled: enabled && initialized && hasSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const state = useAuthStore.getState();
    if (query.isSuccess && query.data && state.hasSession && state.sessionId === sessionId) {
      state.setProfile(query.data);
    }
  }, [query.isSuccess, query.data, sessionId]);

  // Network/5xx errors do not invalidate a session. Rejected credentials are
  // handled centrally by the authenticated HTTP client.
  return {
    profile: hasSession ? query.data ?? null : null,
    isLoading: query.isLoading,
    isSuccess: hasSession && query.isSuccess,
    isFetching: query.isFetching,
    refetch: query.refetch,
    isError: query.isError,
    error: query.error,
  };
}
