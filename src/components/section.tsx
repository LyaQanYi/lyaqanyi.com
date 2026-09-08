import type { ReactNode } from "react";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { ScrollReveal } from "@/components/scroll-reveal";

/** The single content measure; every page and section uses it so vertical
 *  edges line up across the whole site. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={className}>
      <Container>{children}</Container>
    </section>
  );
}

export interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Renders a trailing "view all" link, right-aligned against the heading. */
  moreHref?: string;
  moreLabel?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  moreHref,
  moreLabel,
}: SectionHeaderProps) {
  return (
    <ScrollReveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display-section mt-3 text-fg">{title}</h2>
        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {moreHref && moreLabel ? (
        <Link
          href={moreHref}
          className="group flex shrink-0 items-center gap-1.5 rounded-md text-sm text-fg-muted transition-colors hover:text-accent"
        >
          <span className="link-underline">{moreLabel}</span>
          <Icon
            name="arrowRight"
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </ScrollReveal>
  );
}

/** Page-level heading used at the top of every non-home route. */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional control right-aligned against the heading, as in `SectionHeader`. */
  action?: ReactNode;
}) {
  return (
    <header className="border-b border-line">
      <Container className="py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div className="min-w-0">
            {eyebrow ? <p className="page-enter eyebrow">{eyebrow}</p> : null}
            <h1 className="page-enter enter-title display-title mt-4 text-fg">{title}</h1>
            {description ? (
              <p className="page-enter enter-description mt-5 max-w-2xl text-base leading-relaxed text-fg-muted">
                {description}
              </p>
            ) : null}
          </div>

          {action ? <div className="page-enter enter-controls shrink-0">{action}</div> : null}
        </div>
      </Container>
    </header>
  );
}
