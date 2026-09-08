"use client";

import { useEffect, useRef } from "react";

/**
 * Closes a popover on an outside pointerdown or Escape, and returns a ref to
 * attach to the popover's root element (trigger and panel share it, so clicks
 * on the trigger are not treated as "outside").
 */
export function useDismissable<T extends HTMLElement>(
  open: boolean,
  onDismiss: () => void,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const node = ref.current;
      if (!node) return;
      if (event.target instanceof Node && !node.contains(event.target)) onDismiss();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onDismiss]);

  return ref;
}
