"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProfile } from "../services/auth/hooks/useGetProfile";
import { initializeAuth } from "../lib/auth-token";
import { useAuthStore } from "@/state/auth.store";
import { GlobalPreloader } from "@/shared/ui/global-preloader";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useAuthStore((state) => state.initialized);
  const hasSession = useAuthStore((state) => state.hasSession);
  const profile = useAuthStore((state) => state.profile);

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state, previous) => {
      if (state.sessionId !== previous.sessionId) {
        // Removing a query also cancels its request via the consumed AbortSignal.
        queryClient.removeQueries({ queryKey: ["me", previous.sessionId] });
      }
      if (
        previous.hasSession &&
        !state.hasSession &&
        (pathname === "/account" || pathname.startsWith("/account/"))
      ) {
        router.replace("/");
      }
    });
    initializeAuth();
    return unsubscribe;
  }, [pathname, queryClient, router]);

  const { isLoading, isSuccess } = useGetProfile();

  if (pathname !== "/login" && initialized && hasSession && !profile && (isLoading || isSuccess)) {
    return <GlobalPreloader asMain />;
  }

  return children;
};

export { AuthProvider };
