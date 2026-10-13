"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useEffectiveReducedMotion } from "@/state/accessibility";
import styles from "./contacts-page.module.css";

export function Requisite({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useEffectiveReducedMotion();
  const id = useId();
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  return (
    <section className={styles.requisite}>
      <h3 className={styles.requisiteHeading}>
        <button
          id={triggerId}
          type="button"
          className={styles.requisiteTrigger}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{title}</span>
          <ChevronDown aria-hidden="true" size={26} strokeWidth={1.8} />
        </button>
      </h3>
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
        inert={!open}
        className={styles.requisitePanel}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={reducedMotion ? { duration: 0 } : {
          height: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.24, ease: "easeOut" },
        }}
      >
        <div className={styles.requisiteContent}>{children}</div>
      </motion.div>
    </section>
  );
}
