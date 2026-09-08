"use client";

import type { ReactNode } from "react";

export interface FilterChip {
  key: string;
  label: string;
  count: number;
}

export interface FilterChipsProps {
  /** Accessible name for the chip group. */
  label: string;
  allLabel: string;
  totalCount: number;
  chips: FilterChip[];
  /**
   * `null` means "all" rather than a synthetic key, so no real key can ever
   * collide with the reset value.
   */
  active: string | null;
  onSelect: (key: string | null) => void;
}

/**
 * The chip row shared by the work and writing archives. Both lists filter the
 * same way but render completely different shapes — a card grid versus rows
 * grouped by year — so the state stays with each list and only this
 * presentational row is shared.
 */
export function FilterChips({
  label,
  allLabel,
  totalCount,
  chips,
  active,
  onSelect,
}: FilterChipsProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="page-enter enter-controls flex flex-wrap items-center gap-1.5"
    >
      <Chip
        label={allLabel}
        count={totalCount}
        pressed={active === null}
        onClick={() => onSelect(null)}
      />
      {chips.map((chip) => (
        <Chip
          key={chip.key}
          label={chip.label}
          count={chip.count}
          pressed={active === chip.key}
          onClick={() => onSelect(chip.key)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  count,
  pressed,
  onClick,
}: {
  label: string;
  count: number;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`action-link inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs ${
        pressed
          ? "border-accent bg-accent-soft text-fg"
          : "border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg"
      }`}
    >
      {label}
      {/* The count is decoration next to the label, not part of the button's
          accessible name — "产品 1" would read as a quantity of products. */}
      <span
        aria-hidden="true"
        className={pressed ? "text-accent" : "text-fg-subtle"}
      >
        {count}
      </span>
    </button>
  );
}

/**
 * Stands in for a list that filtered down to nothing, so the page never
 * collapses into an unexplained blank below the chips.
 */
export function FilterEmpty({ children }: { children: ReactNode }) {
  return (
    <p className="mt-10 rounded-md border border-line bg-surface px-4 py-10 text-center text-sm text-fg-muted">
      {children}
    </p>
  );
}
