"use client";

import { Fragment, useState } from "react";
import type { ReactNode } from "react";

import {
  FilterChips,
  FilterEmpty,
  type FilterChip,
} from "@/components/filter-chips";

export interface PostGroup {
  /** Already formatted by the server, e.g. `2025`. */
  year: string;
  items: { slug: string; topic: string; row: ReactNode }[];
}

export interface PostFilterProps {
  /** Accessible name for the chip group. */
  label: string;
  allLabel: string;
  emptyLabel: string;
  /** Names the archive region the year groups sit in. */
  archiveLabel: string;
  totalCount: number;
  chips: FilterChip[];
  /**
   * Rows are server-rendered and passed through as nodes for the same reason
   * the project cards are: the client only decides which of them to show, so
   * no post content beyond the HTML itself reaches the browser.
   */
  groups: PostGroup[];
}

export function PostFilter({
  label,
  allLabel,
  emptyLabel,
  archiveLabel,
  totalCount,
  chips,
  groups,
}: PostFilterProps) {
  const [active, setActive] = useState<string | null>(null);

  /* Filtering runs inside each year and a year that comes out empty drops out
     entirely — otherwise a topic with no posts in, say, 2024 would leave that
     heading stranded above nothing. */
  const visible = groups
    .map((group) => ({
      year: group.year,
      items:
        active === null
          ? group.items
          : group.items.filter((item) => item.topic === active),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <FilterChips
        label={label}
        allLabel={allLabel}
        totalCount={totalCount}
        chips={chips}
        active={active}
        onSelect={setActive}
      />

      {visible.length === 0 ? (
        <FilterEmpty>{emptyLabel}</FilterEmpty>
      ) : (
        <section aria-label={archiveLabel} className="mt-12">
          {visible.map((group) => (
            <div key={group.year} className="mt-12 first:mt-0">
              {/* The year doubles as the archive divider: the hairline runs out
                  to the measure so the heading does not float on its own. */}
              <h2 className="page-enter enter-controls eyebrow flex items-center gap-4">
                <span>{group.year}</span>
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              </h2>

              <div className="mt-2">
                {group.items.map((item) => (
                  <Fragment key={item.slug}>{item.row}</Fragment>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
