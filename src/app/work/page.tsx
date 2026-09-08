import type { Metadata } from "next";

import { ProjectCard } from "@/components/project-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Container, PageHeader } from "@/components/section";
import { fill, uiCopy } from "@/content/copy";
import { sortedProjects } from "@/content/projects";
import { shareMetadata } from "@/content/site";

import projectCardStyles from "@/components/project-card.module.css";

export function generateMetadata(): Metadata {
  return {
    title: uiCopy.work.title,
    description: uiCopy.work.intro,
    ...shareMetadata("/work"),
  };
}

export default function WorkPage() {
  const groups = (["ongoing", "past"] as const).map((status) => ({
    status,
    ...uiCopy.work.groups[status],
    projects: sortedProjects.filter((project) => project.status === status),
  }));

  return (
    <>
      <PageHeader
        eyebrow={fill(uiCopy.work.projectsCount, { count: sortedProjects.length })}
        title={uiCopy.work.title}
        description={uiCopy.work.intro}
      />

      <Container className="space-y-14 py-14 sm:space-y-16 sm:py-16">
        {groups.map((group) => (
          <section
            key={group.status}
            aria-labelledby={`projects-${group.status}-title`}
            className="border-t border-line pt-10 first:border-t-0 first:pt-0 sm:pt-12"
          >
            <ScrollReveal className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2
                id={`projects-${group.status}-title`}
                className="font-display text-2xl leading-snug text-fg sm:text-3xl"
              >
                {group.title}
              </h2>
              <p className="font-mono text-xs text-fg-subtle">
                {fill(uiCopy.work.projectsCount, { count: group.projects.length })}
              </p>
            </ScrollReveal>

            {group.projects.length > 0 ? (
              <>
                <div
                  className={`mt-8 ${projectCardStyles.grid} ${projectCardStyles.rail}`}
                  role="group"
                  tabIndex={0}
                  aria-labelledby={`projects-${group.status}-title`}
                  aria-describedby={`projects-${group.status}-scroll-hint`}
                >
                  {group.projects.map((project, index) => (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      revealDelay={160 + Math.min(index, 3) * 60}
                    />
                  ))}
                </div>
                <p id={`projects-${group.status}-scroll-hint`} className="mt-2 text-xs text-fg-subtle print:hidden">
                  {uiCopy.work.scrollHint}
                  <span className="sr-only">{uiCopy.work.scrollKeyboardHint}</span>
                </p>
              </>
            ) : (
              <ScrollReveal className="mt-8 border border-line bg-surface px-6 py-10 text-sm text-fg-subtle sm:py-12">
                <p>{group.empty}</p>
              </ScrollReveal>
            )}
          </section>
        ))}
      </Container>
    </>
  );
}
