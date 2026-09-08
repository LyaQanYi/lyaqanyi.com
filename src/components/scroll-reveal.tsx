"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Offscreen content reveals once. An optional CSS entrance also covers the
 *  first viewport, without waiting for hydration or hiding content if JS fails. */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  animateOnMount = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  animateOnMount?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (
      !node ||
      motion.matches ||
      !("IntersectionObserver" in window) ||
      node.getBoundingClientRect().top < window.innerHeight
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal();
      },
      { rootMargin: "0px 0px -24px 0px" },
    );

    function reveal() {
      node!.dataset.reveal = "visible";
      observer.disconnect();
    }

    function onMotionChange(event: MediaQueryListEvent) {
      if (event.matches) reveal();
    }

    node.dataset.reveal = "pending";
    observer.observe(node);
    node.addEventListener("focusin", reveal);
    motion.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      node.removeEventListener("focusin", reveal);
      motion.removeEventListener("change", onMotionChange);
      delete node.dataset.reveal;
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${animateOnMount ? "reveal-on-mount" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      onFocusCapture={(event) => {
        // Finish an entrance permanently; removing :focus-within must not
        // restart the CSS animation when the keyboard moves to the next item.
        event.currentTarget.dataset.reveal = "visible";
      }}
    >
      {children}
    </div>
  );
}
