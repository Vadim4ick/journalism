import { Loader2 } from "lucide-react";

export function GlobalPreloader({ asMain = false }: { asMain?: boolean }) {
  const loader = (
    <div
      className="fixed top-1/2 left-1/2 z-100 flex h-screen w-full translate-x-[-50%] translate-y-[-50%] items-center justify-center bg-background"
      role="status"
    >
      <Loader2 aria-hidden="true" className="size-10 animate-spin motion-reduce:animate-none" />
      <span className="sr-only">Загрузка…</span>
    </div>
  );

  return asMain
    ? <main id="main-content" data-text-flow tabIndex={-1}>{loader}</main>
    : loader;
}
