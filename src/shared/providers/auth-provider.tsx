"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProfile } from "../services/auth/hooks/useGetProfile";
import { initializeAuth } from "../lib/auth-token";
import { useAuthStore } from "@/state/auth.store";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state, previous) => {
      if (state.sessionId !== previous.sessionId) {
        // Removing a query also cancels its request via the consumed AbortSignal.
        queryClient.removeQueries({ queryKey: ["me", previous.sessionId] });
      }
      if (previous.hasSession && !state.hasSession) router.replace("/");
    });
    initializeAuth();
    return unsubscribe;
  }, [queryClient, router]);

  useGetProfile();

  // Public pages must remain mounted during bootstrap and background refetches.
  // This provider is not an authorization guard for protected routes.
  return children;
};

export { AuthProvider };
