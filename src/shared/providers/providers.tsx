"use client";

import dynamic from "next/dynamic";
import { AccessibilityEffects } from "@/state/accessibility";
import { SmoothScroll } from "./smooth-scroll";

const Toaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), {
  ssr: false,
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AccessibilityEffects />
      <SmoothScroll />
      {children}

      <Toaster richColors />
    </>
  );
};

export { Providers };
