"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProfile } from "../services/auth/hooks/useGetProfile";
import { initializeAuth } from "../lib/auth-token";
import { useAuthStore } from "@/state/auth.store";
import { Loader2 } from "lucide-react";

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

  if (initialized && hasSession && !profile && (isLoading || isSuccess)) {
    return (
      <>
        <main id="main-content" data-text-flow tabIndex={-1}>
          <div className="fixed top-1/2 left-1/2 z-100 flex h-screen w-full translate-x-[-50%] translate-y-[-50%] items-center justify-center bg-white">
            <Loader2 className="size-10 animate-spin" />
          </div>
        </main>
      </>
    );
  }

  return children;
};

export { AuthProvider };
