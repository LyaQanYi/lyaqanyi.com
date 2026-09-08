import Link from "next/link";

import { Icon } from "@/components/icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { uiCopy } from "@/content/copy";
import { now, nowUpdated } from "@/content/now";
import { formatDate } from "@/lib/format";

export function CurrentActivity({ preview = false }: { preview?: boolean }) {
  const items = preview ? now.slice(0, 2) : now;

  return (
    <ScrollReveal className={preview ? "panel-flat p-6 sm:p-8" : ""}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{uiCopy.about.nowLabel}</p>
          <h2 className="mt-3 font-display text-2xl text-fg sm:text-3xl">
            {uiCopy.about.nowHeading}
          </h2>
        </div>
        <p className="font-mono text-xs text-fg-subtle">
          {uiCopy.home.nowUpdated} <time dateTime={nowUpdated}>{formatDate(nowUpdated)}</time>
        </p>
      </div>
      <dl className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-10">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="eyebrow">{item.label}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-fg-muted">{item.value}</dd>
          </div>
        ))}
      </dl>
      {preview ? (
        <Link href="/about#now" className="group mt-6 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
          <span className="link-underline">{uiCopy.home.nowMore}</span>
          <Icon name="arrowRight" size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </ScrollReveal>
  );
}
