"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";

import { Icon } from "@/components/icon";
import { ModeSwitcher } from "@/components/mode-switcher";
import { useDismissable } from "@/lib/use-dismissable";

/**
 * Everything the header renders is assembled by the server layout from the copy
 * module, so this component stays a pure presenter: it owns no copy and no
 * theme logic of its own.
 */
export interface HeaderCopy {
  name: string;
  handle: string;
  nav: { path: string; label: string }[];
  navLabel: string;
  openMenu: string;
  closeMenu: string;
  switchLabel: string;
  modeLight: string;
  modeDark: string;
  modeSystem: string;
  autoLabel: string;
  switchHint: string;
}

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function isAwayFromTop() {
  return window.scrollY > 0;
}

function getServerScrollSnapshot() {
  return false;
}

export function SiteHeader({ copy }: { copy: HeaderCopy }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    isAwayFromTop,
    getServerScrollSnapshot,
  );

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dismissMenu = useCallback(() => {
    if (document.activeElement?.closest("#mobile-navigation")) {
      menuButtonRef.current?.focus();
    }
    setMenuOpen(false);
  }, []);
  // The header itself is the dismiss boundary: it contains both the trigger
  // and the sheet, so a click on either is not treated as "outside".
  const headerRef = useDismissable<HTMLElement>(menuOpen, dismissMenu);

  /* Close on history navigation as well as clicks inside the sheet.

     Done during the render rather than in an effect that watches `pathname`.
     An effect fires after the new page has already been committed, so the
     sheet would stay open for one frame painted over content it belongs to;
     setting it here means the very render that shows the new route is the
     render that closes the menu over it. React re-runs this component
     immediately when a set-state call happens in the render body, before
     anything reaches the screen.

     `seenPathname` is what makes the comparison possible: `menuOpen` alone
     cannot tell a navigation apart from any other reason to re-render. */
  const [seenPathname, setSeenPathname] = useState(pathname);
  if (pathname !== seenPathname) {
    setSeenPathname(pathname);
    setMenuOpen(false);
  }

  /**
   * `/` must match exactly, otherwise every route would light up the home
   * item; the rest match themselves and anything nested below them.
   */
  function isActive(path: string) {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  const navLinkClass = (active: boolean) =>
    `relative rounded-md px-3 py-2 text-sm transition-colors ${
      active ? "text-fg" : "text-fg-muted hover:text-fg"
    }`;

  return (
    <header
      id="top"
      ref={headerRef}
      data-scrolled={scrolled}
      className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md"
    >
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Link
          href="/"
          aria-label={`${copy.name} · @${copy.handle}`}
          className="group flex items-baseline justify-self-start rounded-md"
        >
          <span aria-hidden="true" className="site-wordmark-prefix">
            <span className="min-w-0 overflow-hidden whitespace-nowrap">
              <span className="font-display text-lg leading-none text-fg">
                {copy.name}
              </span>
              <span className="px-2 text-fg-subtle">·</span>
            </span>
          </span>
          <span className="font-display text-[13px] text-fg-subtle">
            @{copy.handle}
          </span>
        </Link>

        {/* Equal outer tracks keep the nav centred as the name collapses. */}
        <nav
          aria-label={copy.navLabel}
          className="hidden items-center gap-0.5 md:flex"
        >
          {copy.nav.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                aria-current={active ? "page" : undefined}
                className={navLinkClass(active)}
              >
                {item.label}
                {/* The active marker is a token-driven rule, so it inherits the
                    site's border weight instead of being hard-coded. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-px border-t border-accent transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <ModeSwitcher
            copy={{
              label: copy.switchLabel,
              modeLight: copy.modeLight,
              modeDark: copy.modeDark,
              modeSystem: copy.modeSystem,
              autoLabel: copy.autoLabel,
              switchHint: copy.switchHint,
            }}
          />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            className="flex size-9 items-center justify-center rounded-md border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg md:hidden"
          >
            <Icon name={menuOpen ? "close" : "menu"} size={17} />
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        data-open={menuOpen}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className="mobile-navigation panel absolute inset-x-4 top-[calc(100%+0.5rem)] z-50 p-2 md:hidden"
      >
        <nav aria-label={copy.navLabel} className="flex flex-col">
          {copy.nav.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={dismissMenu}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-accent-soft text-fg"
                    : "text-fg-muted hover:bg-surface-hover hover:text-fg"
                }`}
              >
                {item.label}
                {active ? (
                  <Icon name="arrowRight" size={14} className="text-accent" />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
