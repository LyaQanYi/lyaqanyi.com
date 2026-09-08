import type { Metadata } from "next";
import Link from "next/link";

import { CurrentActivity } from "@/components/current-activity";
import { CopyEmail } from "@/components/copy-email";
import { Icon } from "@/components/icon";
import { PostRow } from "@/components/post-row";
import { ProjectCard } from "@/components/project-card";
import { Container, Section, SectionHeader } from "@/components/section";
import { uiCopy } from "@/content/copy";
import { sortedPosts } from "@/content/posts";
import { featuredProjects } from "@/content/projects";
import { profile, shareMetadata, sortedSocials } from "@/content/site";

import projectCardStyles from "@/components/project-card.module.css";

import styles from "./home.module.css";

/* The home page is the only route that shows all four purposes at once, so a
   visitor can judge which of them the site should lean towards. */
const latestPosts = sortedPosts.slice(0, 3);

/** Social links shown as icons in the hero; the rest live in the footer. */
const heroSocials = sortedSocials.slice(0, 5);

/** `title` and `description` stay with the root layout, whose defaults are this
 *  page's own values. Only the share metadata is declared here, because it is
 *  the one part the layout cannot supply for anyone: it does not know which
 *  route is being rendered. */
export function generateMetadata(): Metadata {
  return shareMetadata("/");
}

export default function HomePage() {
  const name = profile.name;

  return (
    <>
      {/* ------------------------------------------------------------ */}
      {/* Hero                                                          */}
      {/* ------------------------------------------------------------ */}
      <section aria-labelledby="home-title">
        <Container className={styles.hero}>
          <div>
            <p className="hero-enter eyebrow">{uiCopy.hero.eyebrow}</p>

            <p className={`hero-enter mt-8 text-sm text-fg-muted ${styles.greeting}`}>
              {uiCopy.hero.greeting}
            </p>
            <h1 id="home-title" className="hero-enter hero-name display-hero mt-2 text-fg">
              {name}
            </h1>

            <p className="hero-enter hero-description mt-5 font-display text-xl leading-snug text-accent sm:text-2xl">
              {profile.role}
            </p>
            <p className="hero-enter hero-description mt-4 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
              {profile.tagline}
            </p>

            <p className="hero-enter hero-availability mt-8 inline-flex items-center gap-2.5 rounded-3xl border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-fg-muted">
              <span aria-hidden="true" className="relative flex size-2 shrink-0">
                <span className="availability-glow absolute inline-flex size-full rounded-full bg-accent" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {profile.availability}
            </p>

            <div className="hero-enter hero-actions mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="action-link group inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast hover:bg-accent-hover"
              >
                {uiCopy.hero.primaryCta}
                <Icon
                  name="arrowRight"
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
                />
              </Link>
              <a
                href="#contact"
                className="action-link inline-flex items-center gap-2 rounded-md border border-line-strong px-5 py-2.5 text-sm font-medium text-fg hover:border-accent hover:text-accent"
              >
                {uiCopy.hero.secondaryCta}
              </a>
            </div>

            <ul className={`hero-enter hero-socials mt-10 flex flex-wrap items-center gap-1 ${styles.socials}`}>
              {heroSocials.map((social) => {
                const external = social.href.startsWith("http");
                const label = social.label;
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      title={label}
                      aria-label={label}
                      className="flex size-10 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-surface-hover hover:text-accent"
                    >
                      <Icon name={social.icon} size={18} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={`flex justify-start ${styles.scrollPrompt}`}>
            <a
              href="#now"
              className="group flex items-center gap-2 font-mono text-[11px] tracking-widest text-fg-subtle uppercase transition-colors hover:text-fg"
            >
              {uiCopy.hero.scrollHint}
              <Icon
                name="arrowDown"
                size={13}
                className="transition-transform group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </Container>
      </section>

      <Section id="now" className="pt-16 sm:pt-20">
        <CurrentActivity preview />
      </Section>

      {/* ------------------------------------------------------------ */}
      {/* About                                                         */}
      {/* ------------------------------------------------------------ */}
      <Section id="about" className="py-24 sm:py-28">
        <SectionHeader
          eyebrow={uiCopy.home.aboutLabel}
          title={uiCopy.home.aboutHeading}
          moreHref="/about"
          moreLabel={uiCopy.home.aboutMore}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="max-w-2xl space-y-5 text-base leading-relaxed text-fg-muted">
            <p className="text-lg leading-relaxed text-fg">
              {profile.intro}
            </p>
            <p>{profile.bio[1]}</p>
          </div>

          <dl className="flex flex-col gap-4 self-start border-t border-line pt-6 text-sm lg:border-t-0 lg:pt-0">
            <div>
              <dt className="eyebrow">{uiCopy.about.roleLabel}</dt>
              <dd className="mt-2 text-fg-muted">
                {profile.role}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">{uiCopy.about.locationLabel}</dt>
              <dd className="mt-2 flex items-start gap-2 text-fg-muted">
                <Icon name="mapPin" size={15} className="mt-0.5 shrink-0" />
                {profile.location}
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* ------------------------------------------------------------ */}
      {/* Selected work                                                 */}
      {/* ------------------------------------------------------------ */}
      <Section id="work" className="py-24 sm:py-28">
        <SectionHeader
          eyebrow={uiCopy.home.workLabel}
          title={uiCopy.home.workHeading}
          moreHref="/work"
          moreLabel={uiCopy.home.workMore}
        />

        <div
          className={`mt-10 ${projectCardStyles.grid} ${projectCardStyles.horizontalGrid}`}
          role="group"
          aria-label={uiCopy.home.workHeading}
          tabIndex={0}
        >
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              layout="horizontal"
              revealDelay={index * 70}
            />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ */}
      {/* Recent writing                                                */}
      {/* ------------------------------------------------------------ */}
      <Section id="writing" className="py-24 sm:py-28">
        <SectionHeader
          eyebrow={uiCopy.home.writingLabel}
          title={uiCopy.home.writingHeading}
          moreHref="/writing"
          moreLabel={uiCopy.home.writingMore}
        />

        <div className="mt-8">
          {latestPosts.map((post) => (
            <PostRow key={post.slug} post={post} showFeatured />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ */}
      {/* Contact                                                       */}
      {/* ------------------------------------------------------------ */}
      <Section id="contact" className="py-24 pb-32 sm:py-28">
        <div className="panel overflow-hidden">
          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow">{uiCopy.home.contactLabel}</p>
              <h2 className="display-section mt-3 text-fg">
                {uiCopy.home.contactHeading}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-fg-muted">
                {uiCopy.home.contactBody}
              </p>

              <a
                href={`mailto:${profile.email}`}
                className="mt-7 inline-block font-display text-2xl text-fg transition-colors hover:text-accent sm:text-3xl"
              >
                <span className="link-underline">{profile.email}</span>
              </a>

              <CopyEmail
                email={profile.email}
                copy={{
                  label: uiCopy.common.copyEmail,
                  copied: uiCopy.common.copied,
                  failed: uiCopy.common.copyFailed,
                }}
                className="mt-4"
              />
            </div>

            <div className="lg:border-l lg:border-line lg:pl-10">
              <p className="eyebrow">{uiCopy.home.linksHeading}</p>
              <ul className="mt-4 flex flex-col gap-1">
                {sortedSocials.map((social) => {
                  const external = social.href.startsWith("http");
                  return (
                    <li key={social.id}>
                      <a
                        href={social.href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group flex items-baseline justify-between gap-4 rounded-md px-2 py-2.5 transition-colors hover:bg-surface-hover"
                      >
                        <span className="flex items-center gap-2.5 text-sm text-fg">
                          <Icon
                            name={social.icon}
                            size={15}
                            className="shrink-0 text-fg-subtle transition-colors group-hover:text-accent"
                          />
                          {social.label}
                        </span>
                        <span className="min-w-0 truncate text-right font-mono text-[11px] text-fg-subtle">
                          {social.note}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
