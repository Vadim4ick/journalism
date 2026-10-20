"use client";

import dynamic from "next/dynamic";
import { AccessibilityEffects } from "@/state/accessibility";
import { SmoothScroll } from "./smooth-scroll";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth-provider";
import { SettingsLoader } from "./settings-loader";

const Toaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), {
  ssr: false,
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // retry: 0,
            refetchOnWindowFocus: false,
            // staleTime: 3 * 60_000,
          },
          // mutations: {
          //   retry: 0,
          // },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityEffects />
      <SettingsLoader />
      <SmoothScroll />

      <AuthProvider>{children}</AuthProvider>

      <Toaster richColors />
    </QueryClientProvider>
  );
};

export { Providers };
