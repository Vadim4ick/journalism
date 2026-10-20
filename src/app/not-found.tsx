import Link from "next/link";
import { SiteStatus } from "@/components/site-status";

export default function NotFound() {
  return (
    <SiteStatus
      kind="not-found"
      action={
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-7 font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          На главную
          <span aria-hidden="true">↗</span>
        </Link>
      }
    />
  );
}
