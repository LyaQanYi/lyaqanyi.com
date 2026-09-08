import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, type HeaderCopy } from "@/components/site-header";
import { uiCopy } from "@/content/copy";
import { htmlLang, navItems, profile, siteName, siteUrl } from "@/content/site";
import { cmdysj } from "@/lib/fonts";
import { themeBootScript } from "@/lib/theme";

import "@/app/globals.css";

/* cmdysj supplies display type. Body and navigation keep Geist with the
   platform's Chinese sans-serif fallback. */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const fontVariables = [
  geist.variable,
  geistMono.variable,
  cmdysj.variable,
].join(" ");

export function generateMetadata(): Metadata {
  const name = profile.name;
  const title = `${name} · ${profile.role}`;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${name}` },
    description: profile.tagline,
    applicationName: siteName,
    authors: [{ name, url: siteUrl }],
    creator: name,
    publisher: name,
    keywords: [
      name,
      "QanYi",
      "个人网站",
      "产品设计",
      "前端工程",
      "设计系统",
      "作品集",
    ],
    /* No `alternates` and no `openGraph` at this level, even though both are
       metadata every page wants. They carry per-page values — the canonical URL,
       the share title, the card image — and anything declared here is inherited
       *literally* by every route below, because a child that sets the same key
       replaces the object rather than merging into it and a child that does not
       gets this one verbatim. That is how each list page here came to advertise
       the home page's URL as its own, and each article came to share under the
       site's name instead of its own. Every route calls `shareMetadata` with its
       own path instead. */
    twitter: { card: "summary_large_image" },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    formatDetection: { email: false, telephone: false, address: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* The two `--bg` values, light and dark. Hard-coded because a `theme-color`
     meta tag is read by the browser chrome, which does not evaluate CSS. */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const headerCopy: HeaderCopy = {
    name: profile.name,
    handle: profile.handle,
    nav: navItems.map((item) => ({
      path: item.path,
      label: uiCopy.nav[item.labelKey],
    })),
    navLabel: uiCopy.nav.label,
    openMenu: uiCopy.nav.openMenu,
    closeMenu: uiCopy.nav.closeMenu,
    switchLabel: uiCopy.appearance.switchLabel,
    modeLight: uiCopy.appearance.modeLight,
    modeDark: uiCopy.appearance.modeDark,
  };

  return (
    <html
      lang={htmlLang}
      className={`${fontVariables} antialiased`}
      /* Next.js 16 no longer overrides scroll-behavior during navigation
         unless the element opts in. */
      data-scroll-behavior="smooth"
      /* The boot script sets data-mode before hydration. */
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col bg-bg text-fg">
        {/* A real inline element, and not `next/script` with
            `strategy="beforeInteractive"`, which is what this used to be. That
            strategy does not mean what it says in this position: the server
            emits the source as a *string* inside `self.__next_s.push(...)` for
            the client runtime to drain during hydration, and a parser never
            evaluates an argument. The theme therefore landed after first paint
            on every load, so a visitor who had chosen dark watched the page
            arrive light and then flip — the exact flash the boot script exists
            to prevent. Written as an element, it executes where it sits.

            It sits at the top of `<body>` because that is the earliest place it
            can go. React hoists `<title>`, `<link>` and `<meta>` into `<head>`
            but deliberately not inline scripts, so a script written here cannot
            be lifted above the markup it has to precede. Nothing themed has
            been parsed yet at this point, and `document.documentElement`
            already exists, so the attribute is on the element before the first
            token-bearing descendant is. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />

        {/* Column rules behind everything; inert and ignored by AT. */}
        <div className="decor" aria-hidden="true" />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-contrast"
        >
          {uiCopy.common.skipToContent}
        </a>

        <SiteHeader copy={headerCopy} />

        <main id="main" className="flex-1">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
