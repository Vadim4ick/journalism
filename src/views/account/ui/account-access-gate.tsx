"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useGetProfile } from "@/shared/services/auth/hooks/useGetProfile";
import { isJuryMember } from "@/shared/lib/jury-access";
import { useAuthStore } from "@/state/auth.store";
import { GlobalPreloader } from "@/shared/ui/global-preloader";

export function AccountAccessGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const initialized = useAuthStore((state) => state.initialized);
  const hasSession = useAuthStore((state) => state.hasSession);
  const profile = useAuthStore((state) => state.profile);
  const { isError, refetch } = useGetProfile();
  const allowed = isJuryMember(profile);

  useEffect(() => {
    if (initialized && (!hasSession || (profile && !allowed))) {
      router.replace("/");
    }
  }, [allowed, hasSession, initialized, profile, router]);

  if (allowed) return children;

  if (initialized && hasSession && !profile && isError) {
    return (
      <section className="mx-auto w-full max-w-4xl px-6 py-16" data-text-flow>
        <h1 className="text-2xl font-semibold">Не удалось проверить доступ к кабинету</h1>
        <p className="mt-4">Проверьте соединение и попробуйте снова.</p>
        <button type="button" onClick={() => void refetch()} className="mt-6 min-h-11 rounded-lg border border-border px-5 focus-visible:ring-2 focus-visible:ring-ring">
          Повторить
        </button>
      </section>
    );
  }

  return <GlobalPreloader />;
}
