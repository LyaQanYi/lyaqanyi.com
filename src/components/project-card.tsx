import type { CSSProperties } from "react";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { Project } from "@/content/types";

import styles from "./project-card.module.css";

export function projectHref(slug: string) {
  return `/work/${slug}`;
}

/**
 * Cover colours are supplied per project, so they are passed in as custom
 * properties and the `.cover` rule does the layering. The artwork is inert:
 * the title and summary carry the accessible name instead.
 */
function Cover({ project }: { project: Project }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${styles.cover}`}
      style={
        {
          "--cover-from": project.cover.from,
          "--cover-to": project.cover.to,
        } as CSSProperties
      }
    >
      <div className="project-cover-art cover absolute inset-0 flex items-end justify-end p-4">
        <span className={`font-display leading-none text-cover-ink select-none ${project.cover.label ? "text-5xl" : "text-7xl"}`}>
          {project.cover.label ?? project.year}
        </span>
      </div>
    </div>
  );
}

export function ProjectCard({
  project,
  layout = "vertical",
  headingLevel = 3,
  revealDelay = 0,
}: {
  project: Project;
  layout?: "vertical" | "horizontal";
  /** Defaults to h3 beneath the home section or work status group's h2. */
  headingLevel?: 2 | 3;
  revealDelay?: number;
}) {
  const titleId = `project-${project.slug}-title`;
  const summaryId = `project-${project.slug}-summary`;
  /* Compared rather than interpolated: `h${headingLevel}` widens to `string`,
     which JSX will not accept as an element name without a cast. */
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <ScrollReveal className={`flex ${styles.frame} ${layout === "horizontal" ? styles.horizontal : ""}`} delay={revealDelay} animateOnMount>
      <Link
        href={projectHref(project.slug)}
        aria-labelledby={titleId}
        aria-describedby={summaryId}
        className={`project-card panel-flat group flex h-full w-full flex-col overflow-hidden transition-colors duration-200 hover:border-line-strong focus-visible:border-line-strong ${styles.card}`}
      >
        <Cover project={project} />

        <div className={`flex min-h-0 min-w-0 flex-1 flex-col gap-3 p-5 ${styles.content}`}>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="chip">{project.categoryLabel}</span>
            <span className="font-mono text-[11px] text-fg-subtle">
              {project.period}
            </span>
          </div>

          <div className="flex shrink-0 items-baseline justify-between gap-3">
            <Heading
              id={titleId}
              className="font-display text-xl leading-snug text-fg transition-colors group-hover:text-accent"
            >
              {project.title}
            </Heading>
            <Icon
              name="arrowRight"
              size={17}
              className="project-card-arrow shrink-0 self-center text-fg-subtle"
            />
          </div>

          <p
            id={summaryId}
            className="line-clamp-3 min-h-0 text-sm leading-relaxed text-fg-muted"
          >
            {project.summary}
          </p>

          <ul className="mt-auto flex shrink-0 flex-wrap gap-1.5 pt-2">
            {project.stack.slice(0, 4).map((item) => (
              <li
                key={item}
                className="rounded-xs bg-bg-alt px-2 py-0.5 font-mono text-[11px] text-fg-subtle"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </ScrollReveal>
  );
}
