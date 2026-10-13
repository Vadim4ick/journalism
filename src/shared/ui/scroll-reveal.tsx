"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useEffectiveReducedMotion } from "@/state/accessibility";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  dataTextFlow?: boolean;
};

export function ScrollReveal({ children, className, dataTextFlow = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [observedOutside, setObservedOutside] = useState(false);
  const [entered, setEntered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useEffectiveReducedMotion();

  useEffect(() => {
    if (reducedMotion || entered || typeof IntersectionObserver === "undefined") return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true);
        observer.disconnect();
      } else {
        setObservedOutside(true);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion, entered]);

  const visible = reducedMotion || focused || entered || !observedOutside;

  return (
    <motion.div
      ref={ref}
      className={className}
      data-a11y-decorative-motion
      data-text-flow={dataTextFlow || undefined}
      onFocusCapture={() => setFocused(true)}
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{
        duration: reducedMotion || focused ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
