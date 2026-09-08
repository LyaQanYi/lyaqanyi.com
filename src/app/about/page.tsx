import type { Metadata } from "next";

import { CurrentActivity } from "@/components/current-activity";
import { Icon } from "@/components/icon";
import { PrintResume } from "@/components/print-resume";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  Container,
  PageHeader,
  Section,
  SectionHeader,
} from "@/components/section";
import { uiCopy } from "@/content/copy";
import {
  education,
  principles,
  skillGroups,
  sortedExperience,
} from "@/content/resume";
import { profile, shareMetadata } from "@/content/site";

export function generateMetadata(): Metadata {
  return {
    title: uiCopy.about.title,
    description: uiCopy.about.intro,
    ...shareMetadata("/about"),
  };
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={profile.role}
        title={uiCopy.about.title}
        description={uiCopy.about.intro}
        action={<PrintResume label={uiCopy.about.printResume} />}
      />

      {/* The intro above promises "who I am, what I work on, what I believe",
          so the sections follow that order and the hard résumé facts come
          after — a visitor reads the person before the CV. */}
      <Section className="py-14 sm:py-16">
        <ScrollReveal animateOnMount delay={160} className="max-w-2xl space-y-5 text-base leading-relaxed text-fg-muted">
          {profile.bio.map((paragraph, position) => (
            <p
              key={position}
              className={
                position === 0
                  ? "text-lg leading-relaxed text-fg"
                  : undefined
              }
            >
              {paragraph}
            </p>
          ))}
        </ScrollReveal>
      </Section>

      <Section id="now" className="border-t border-line py-14 sm:py-16">
        <CurrentActivity />
      </Section>

      <Section className="border-t border-line py-14 sm:py-16">
        <SectionHeader
          eyebrow={uiCopy.about.principlesLabel}
          title={uiCopy.about.principlesHeading}
        />

        <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {principles.map((principle, index) => (
            <ScrollReveal key={principle.title} delay={(index % 2) * 70}>
              <h3 className="font-display text-lg leading-snug text-fg">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {principle.body}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {sortedExperience.length > 0 ? (
        <Section className="border-t border-line py-14 sm:py-16">
          <SectionHeader
            eyebrow={uiCopy.about.experienceLabel}
            title={uiCopy.about.experienceHeading}
          />

          {/* Period in the left column, the rest to its right: the same shape a
              printed CV uses. Paper is narrower than `lg`, so the print variant
              re-asserts it — otherwise the two columns collapse to one and the
              entry loses the alignment it was laid out for. */}
          <ol className="mt-8 flex flex-col">
            {sortedExperience.map((item) => (
              <li
                key={item.id}
                className="grid gap-x-10 gap-y-3 border-t border-line py-8 first:border-t-0 first:pt-0 print:grid-cols-[11rem_1fr] lg:grid-cols-[11rem_1fr]"
              >
                <div className="font-mono text-xs text-fg-subtle lg:pt-1.5">
                  <p>{item.period}</p>
                  {item.location ? (
                    <p className="mt-2 flex items-center gap-1.5">
                      <Icon name="mapPin" size={12} className="shrink-0" />
                      {item.location}
                    </p>
                  ) : null}
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-xl leading-snug text-fg">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-sm text-accent">
                    {item.org}
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted">
                    {item.summary}
                  </p>

                  <ul className="mt-5 flex flex-col gap-3">
                    {item.highlights.map((highlight, position) => (
                      <li
                        key={position}
                        className="flex gap-3 text-sm leading-relaxed text-fg"
                      >
                        <Icon
                          name="sparkle"
                          size={14}
                          className="mt-0.5 shrink-0 text-accent"
                        />
                        <span className="max-w-2xl">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      <Section className="border-t border-line py-14 sm:py-16">
        <SectionHeader
          eyebrow={uiCopy.about.skillsLabel}
          title={uiCopy.about.skillsHeading}
        />

        <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <ScrollReveal key={group.name} delay={index * 60}>
              <h3 className="eyebrow">{group.name}</h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {education.length > 0 ? (
        <Section className="border-t border-line py-14 sm:py-16">
          <SectionHeader
            eyebrow={uiCopy.about.educationLabel}
            title={uiCopy.about.educationHeading}
          />

          <div className="mt-8 flex flex-col gap-8">
            {education.map((item) => (
              <div
                key={item.school}
                className="grid gap-x-10 gap-y-2 print:grid-cols-[11rem_1fr] lg:grid-cols-[11rem_1fr]"
              >
                <p className="font-mono text-xs text-fg-subtle lg:pt-1.5">
                  {item.period}
                </p>

                <div className="min-w-0">
                  <h3 className="font-display text-lg leading-snug text-fg">
                    {item.school}
                  </h3>
                  <p className="mt-1 text-sm text-accent">
                    {item.degree}
                  </p>
                  {item.note ? (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
                      {item.note}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* A résumé ends with a way to reply, so the page does too. */}
      <Container className="border-t border-line py-12 text-sm sm:py-14">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Icon name="mail" size={15} className="shrink-0 text-fg-subtle" />
          <a
            href={`mailto:${profile.email}`}
            className="link-underline text-fg-muted transition-colors hover:text-accent"
          >
            {profile.email}
          </a>
          <span aria-hidden="true" className="text-fg-subtle">
            ·
          </span>
          <span className="text-fg-subtle">
            {profile.availability}
          </span>
        </div>
      </Container>
    </>
  );
}
