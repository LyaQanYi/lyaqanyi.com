import Link from "next/link";

import { Icon } from "@/components/icon";
import { fill, uiCopy } from "@/content/copy";
import { navItems, profile, sortedSocials } from "@/content/site";

/** Social hrefs are `mailto:`, absolute origins or the XML feed — none of them
 *  are app routes, so plain anchors are correct: `Link` would try to fetch
 *  `/feed.xml` through the client router. */
function isExternal(href: string) {
  return href.startsWith("http");
}

/** A server component, so it reads the copy and content modules directly
 *  instead of taking them as props. */
export function SiteFooter() {
  const name = profile.name;

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl leading-tight text-fg">{name}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
              {profile.tagline}
            </p>
            <p className="mt-4 flex items-center gap-1.5 font-mono text-xs text-fg-subtle">
              <Icon name="mapPin" size={13} />
              {profile.location}
            </p>
          </div>

          <nav aria-label={uiCopy.nav.label} className="text-sm">
            <p className="eyebrow">{uiCopy.common.page}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="link-underline text-fg-muted transition-colors hover:text-fg"
                  >
                    {uiCopy.nav[item.labelKey]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-sm">
            <p className="eyebrow">{uiCopy.common.channelLabel}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {sortedSocials.map((social) => {
                const external = isExternal(social.href);
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex items-center gap-2 text-fg-muted transition-colors hover:text-fg"
                    >
                      <Icon name={social.icon} size={15} className="shrink-0" />
                      <span className="link-underline">{social.label}</span>
                      {external ? (
                        <>
                          <Icon
                            name="arrowUpRight"
                            size={12}
                            className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
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
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-fg-subtle sm:flex-row sm:items-start sm:justify-between lg:items-center">
          <div className="flex min-w-0 flex-col gap-1.5 lg:flex-row lg:items-center lg:gap-3">
            <span className="lg:whitespace-nowrap">
              {fill(uiCopy.footer.copyright, {
                year: new Date().getFullYear(),
                name,
              })}
            </span>
            <span className="hidden lg:inline" aria-hidden="true">
              ·
            </span>
            <span className="lg:whitespace-nowrap">{uiCopy.footer.builtWith}</span>
            <span className="hidden lg:inline" aria-hidden="true">
              ·
            </span>
            <span className="lg:whitespace-nowrap">{uiCopy.footer.colophon}</span>
          </div>

          <a
            href="#top"
            className="group inline-flex shrink-0 items-center gap-1.5 self-start whitespace-nowrap text-fg-muted transition-colors hover:text-fg lg:self-auto"
          >
            <Icon
              name="arrowDown"
              size={13}
              className="shrink-0 rotate-180 transition-transform group-hover:-translate-y-0.5"
            />
            {uiCopy.footer.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
