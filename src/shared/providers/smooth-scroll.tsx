"use client";

import { useEffect } from "react";
import { animate } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffectiveReducedMotion } from "@/state/accessibility";

function isPageLocked() {
  return [document.documentElement, document.body].some((element) => {
    const style = getComputedStyle(element);
    return (
      style.overflowY === "hidden" ||
      style.overflowY === "clip" ||
      style.position === "fixed"
    );
  });
}

function hasLocalScroll(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  for (
    let element: Element | null = target;
    element && element !== document.body;
    element = element.parentElement
  ) {
    if (
      element.matches(
        '[role="dialog"], [role="alertdialog"], textarea, select, [data-native-scroll]',
      )
    )
      return true;
    const style = getComputedStyle(element);
    if (
      /(auto|scroll|overlay)/.test(style.overflowY) &&
      element.scrollHeight > element.clientHeight
    )
      return true;
  }
  return false;
}

/** Smooth the document's wheel input without transforming its content or fixed elements. */
function SmoothScroll() {
  const reducedMotion = useEffectiveReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion) return;

    let animation: ReturnType<typeof animate> | undefined;
    let destination = window.scrollY;
    let writtenPosition = window.scrollY;
    let running = false;

    const stop = () => {
      animation?.stop();
      animation = undefined;
      running = false;
      destination = window.scrollY;
    };

    const onWheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !event.cancelable ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        !event.deltaY
      )
        return;
      if (isPageLocked() || hasLocalScroll(event.target)) {
        stop();
        return;
      }

      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      if (!running) destination = window.scrollY;
      const next = Math.max(
        0,
        Math.min(maxScroll, destination + event.deltaY * unit),
      );
      if (next === window.scrollY && !running) return;

      event.preventDefault();
      animation?.stop();
      destination = next;
      running = true;
      animation = animate(window.scrollY, destination, {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (position) => {
          if (isPageLocked()) {
            stop();
            return;
          }
          window.scrollTo({ top: position, behavior: "instant" });
          writtenPosition = window.scrollY;
        },
        onComplete: () => {
          running = false;
        },
      });
    };

    // Let browser navigation, focus, anchors, keyboard and the scrollbar take over immediately.
    const onScroll = () => {
      if (running && Math.abs(window.scrollY - writtenPosition) > 2) stop();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
          "Tab",
          "Escape",
        ].includes(event.key)
      )
        stop();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("resize", stop);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      stop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("resize", stop);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pathname, reducedMotion]);

  return null;
}

export { SmoothScroll };
