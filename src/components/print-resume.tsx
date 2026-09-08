"use client";

import { Icon } from "@/components/icon";

/**
 * Prints the page instead of linking to an uploaded PDF.
 *
 * The about page already carries the whole résumé, so a printed copy is
 * generated from the same content and can never drift out of date the way a
 * separate file would. `@media print` in globals.css strips the site chrome so
 * what comes out is the résumé and nothing else.
 */
export function PrintResume({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="action-link inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg print:hidden"
    >
      <Icon name="printer" size={13} />
      {label}
    </button>
  );
}
