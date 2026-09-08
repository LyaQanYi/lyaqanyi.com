import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ScrollReveal } from "@/components/scroll-reveal";
import { Icon } from "@/components/icon";
import { projectHref } from "@/components/project-card";
import { Container } from "@/components/section";
import { uiCopy } from "@/content/copy";
import { getProject, sortedProjects } from "@/content/projects";
import { shareMetadata } from "@/content/site";
import type { IconName, ProjectLink } from "@/content/types";

/** Every project, so the whole archive is prerendered. */
export function generateStaticParams() {
  return sortedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;

  const project = getProject(slug);
  if (!project) return {};

  const path = `/work/${project.slug}`;

  return {
    title: project.title,
    description: project.summary,
    /* No `publishedTime`, for the reason the sitemap gives: a project carries a
       year and nothing finer, so any date here would be invented. */
    ...shareMetadata(path, { type: "article" }),
  };
}

const linkIcons: Record<ProjectLink["kind"], IconName> = {
  live: "globe",
  source: "github",
  case: "external",
};

export default async function ProjectPage(
  props: PageProps<"/work/[slug]">,
) {
  const { slug } = await props.params;

  const project = getProject(slug);
  if (!project) notFound();

  /* Wraps around, so the last project points back to the first and the archive
     can be walked end to end without hitting a dead end. */
  const index = sortedProjects.findIndex((item) => item.slug === project.slug);
  const nextProject = sortedProjects.length > 1
    ? sortedProjects[(index + 1) % sortedProjects.length]
    : undefined;

  return (
    <>
      <Container className="py-10 sm:py-12">
        <Link
          href="/work"
          className="page-enter group inline-flex items-center gap-2 font-mono text-xs text-fg-subtle transition-colors hover:text-fg"
        >
          <Icon
            name="arrowRight"
            size={14}
            className="rotate-180 transition-transform group-hover:-translate-x-0.5"
          />
          <span className="link-underline">{uiCopy.work.backToWork}</span>
        </Link>
      </Container>

      <article>
        <Container>
          <div
            aria-hidden="true"
            className="page-enter cover flex aspect-21/9 items-end justify-end overflow-hidden rounded-lg border border-line p-6 sm:p-8"
            style={
              {
                "--cover-from": project.cover.from,
                "--cover-to": project.cover.to,
              } as CSSProperties
            }
          >
            <span className={`font-display leading-none text-cover-ink select-none ${project.cover.label ? "text-4xl sm:text-7xl" : "text-7xl sm:text-8xl"}`}>
              {project.cover.label ?? project.year}
            </span>
          </div>
        </Container>

        <Container className="mt-12 sm:mt-16">
          <ScrollReveal animateOnMount delay={100}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip">{project.categoryLabel}</span>
              <span className="font-mono text-xs text-fg-subtle">
                {project.period}
              </span>
            </div>

            <h1 className="display-title mt-5 text-fg">{project.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
              {project.summary}
            </p>
          </ScrollReveal>
        </Container>

        <Container className="mt-12 grid gap-12 pb-20 sm:pb-24 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div className="max-w-2xl">
            {/* The opening paragraph carries the lede weight; the rest stay at
                body size so the narrative settles into a readable rhythm. */}
            <ScrollReveal className="space-y-5 text-base leading-relaxed text-fg-muted">
              {project.body.map((paragraph, position) => (
                <p
                  key={position}
                  className={
                    position === 0 ? "text-lg leading-relaxed text-fg" : undefined
                  }
                >
                  {paragraph}
                </p>
              ))}
            </ScrollReveal>

            {project.sections?.map((section) => (
              <section key={section.title} className="mt-10">
                <ScrollReveal>
                  <h2 className="font-display text-2xl text-fg">{section.title}</h2>
                  <div className="mt-4 space-y-5 text-base leading-relaxed text-fg-muted">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </ScrollReveal>
              </section>
            ))}

            {project.highlights.length > 0 ? (
              <section className="mt-12 border-t border-line pt-8">
                <ScrollReveal>
                  <h2 className="eyebrow">{uiCopy.work.fields.highlights}</h2>
                  <ul className="mt-4 flex flex-col gap-3.5">
                    {project.highlights.map((highlight, position) => (
                      <li
                        key={position}
                        className="flex gap-3 text-sm leading-relaxed text-fg"
                      >
                        <Icon
                          name="sparkle"
                          size={15}
                          className="mt-0.5 shrink-0 text-accent"
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              </section>
            ) : null}
          </div>

          <aside className="self-start lg:border-l lg:border-line lg:pl-10">
            <dl className="flex flex-col gap-7 text-sm">
              <div>
                <dt className="eyebrow">{uiCopy.work.fields.role}</dt>
                <dd className="mt-2 text-fg">{project.role}</dd>
              </div>

              <div>
                <dt className="eyebrow">{uiCopy.work.fields.period}</dt>
                <dd className="mt-2 font-mono text-xs text-fg-muted">
                  {project.period}
                </dd>
              </div>

              <div>
                <dt className="eyebrow">{uiCopy.work.fields.stack}</dt>
                <dd className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>

              {project.links.length > 0 ? (
                <div>
                  <dt className="eyebrow">{uiCopy.work.fields.links}</dt>
                  <dd className="mt-2">
                    <ul className="flex flex-col">
                      {project.links.map((link) => {
                        const external = link.href.startsWith("http");
                        return (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              {...(external
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                              className="group -mx-2 flex items-center gap-2.5 rounded-md px-2 py-2 text-fg-muted transition-colors hover:bg-surface-hover hover:text-accent"
                            >
                              <Icon
                                name={linkIcons[link.kind]}
                                size={15}
                                className="shrink-0"
                              />
                              <span className="link-underline">
                                {link.label}
                              </span>
                              {external ? (
                                <>
                                  <Icon
                                    name="arrowUpRight"
                                    size={13}
                                    className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                  />
                                  <span className="sr-only">
                                    {uiCopy.common.opensInNewTab}
                                  </span>
                                </>
                              ) : null}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </Container>
      </article>

      {nextProject ? (
        <section className="border-t border-line">
          <Container className="py-14 sm:py-16">
            <p className="eyebrow">{uiCopy.work.nextProject}</p>
            <Link
              href={projectHref(nextProject.slug)}
              className="group mt-4 block"
            >
              <span className="display-section block font-display text-fg transition-colors group-hover:text-accent">
                {nextProject.title}
              </span>
              <span className="mt-3 line-clamp-2 block max-w-2xl text-sm leading-relaxed text-fg-muted">
                {nextProject.summary}
              </span>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-fg-subtle transition-colors group-hover:text-accent">
                {uiCopy.common.viewProject}
                <Icon
                  name="arrowRight"
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </Container>
        </section>
      ) : null}
    </>
  );
}
