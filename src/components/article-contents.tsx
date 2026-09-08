"use client";

import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/icon";

export function ArticleContents({
  entries,
  label,
}: {
  entries: { id: string; text: string }[];
  label: string;
}) {
  const [activeId, setActiveId] = useState(entries[0]?.id ?? "");
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((heading): heading is HTMLElement => heading !== null);
    let frame = 0;

    function updateActiveHeading() {
      frame = 0;
      // Use the same offset as native anchor navigation beneath the header.
      const offset = parseFloat(
        getComputedStyle(document.documentElement).scrollPaddingTop,
      ) || 0;
      let current = headings[0]?.id ?? "";
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > offset + 8) break;
        current = heading.id;
      }
      setActiveId(current);
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateActiveHeading);
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [entries]);

  function renderLinks(mobile: boolean) {
    return (
      <ul className="mt-4 flex flex-col border-l border-line">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${encodeURIComponent(entry.id)}`}
              aria-current={activeId === entry.id ? "location" : undefined}
              onClick={mobile ? () => detailsRef.current?.removeAttribute("open") : undefined}
              className={`-ml-px block border-l py-2 pl-4 text-sm leading-snug transition-colors ${
                activeId === entry.id
                  ? "border-accent text-fg"
                  : "border-transparent text-fg-muted hover:border-accent hover:text-accent"
              }`}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <aside className="min-w-0 self-start print:hidden lg:sticky lg:top-28 lg:col-start-2 lg:row-start-1">
      <details ref={detailsRef} className="page-enter enter-controls article-contents group panel-flat p-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm text-fg">
          {label}
          <Icon name="arrowDown" size={15} className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <nav aria-label={label}>{renderLinks(true)}</nav>
      </details>

      <nav aria-label={label} className="page-enter enter-controls hidden max-h-[calc(100svh-9rem)] overflow-y-auto lg:block">
        <p className="eyebrow">{label}</p>
        {renderLinks(false)}
      </nav>
    </aside>
  );
}
