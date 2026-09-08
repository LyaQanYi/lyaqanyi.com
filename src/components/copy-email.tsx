"use client";

import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/icon";

export interface CopyEmailCopy {
  label: string;
  copied: string;
  failed: string;
}

type Status = "idle" | "copied" | "failed";

export function CopyEmail({
  email,
  copy,
  className = "",
}: {
  email: string;
  copy: CopyEmailCopy;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  async function copyAddress() {
    try {
      /* `navigator.clipboard` only exists in a secure context, so a plain-http
         preview would throw on property access rather than on the call. */
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2600);
  }

  const message =
    status === "copied" ? copy.copied : status === "failed" ? copy.failed : null;

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      <button
        type="button"
        onClick={copyAddress}
        className="action-link inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
      >
        <Icon name={status === "copied" ? "check" : "copy"} size={13} />
        {copy.label}
      </button>

      {/* Always mounted: a live region has to exist before it can announce. */}
      <span
        role="status"
        aria-live="polite"
        className={`text-xs transition-opacity ${
          message ? "text-fg-muted opacity-100" : "opacity-0"
        }`}
      >
        {message ?? copy.copied}
      </span>
    </span>
  );
}
