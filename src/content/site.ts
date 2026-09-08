import type { Metadata } from "next";

import type { Profile } from "./types";

/**
 * Canonical origin used for absolute URLs in metadata, sitemap and OG images.
 * Override with NEXT_PUBLIC_SITE_URL for preview deployments.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lyaqanyi.com"
).replace(/\/$/, "");

export const siteName = "浅忆QanYi";

/**
 * BCP 47 tag for `<html lang>` and for `Intl` date formatting. Spelled once
 * because both the root layout and `lib/format.ts` need it, and a site that
 * declares one language in its markup while formatting dates in another is a
 * bug nobody would notice.
 */
export const htmlLang = "zh-CN";

/**
 * Open Graph locale, in the `language_TERRITORY` shape platform scrapers
 * expect. Kept apart from `htmlLang` because the two standards differ in form,
 * and a tag that is correct for one is not automatically correct for the other.
 */
const openGraphLocale = "zh_CN";

/** Path of the RSS feed. Spelled once here because the channel list, the
 *  discovery link and the feed's own self-reference all have to agree on it. */
export const feedPath = "/feed.xml";

/** Absolute feed URL, for metadata and for `<atom:link rel="self">`. */
export const feedUrl = `${siteUrl}${feedPath}`;

/**
 * Absolute URL for a route — the one spelling every absolute reference on the
 * site goes through.
 *
 * The root loses its trailing slash because that is the form Next emits for the
 * canonical link and `og:url`, whatever it is handed. A sitemap listing
 * `https://lyaqanyi.com/` for a document whose canonical says
 * `https://lyaqanyi.com` is two spellings of one address: harmless to a human,
 * and exactly the kind of thing a crawler is entitled to treat as two pages.
 * Deriving both from here is what makes them unable to drift.
 */
export function absoluteUrl(path: string = "/"): string {
  return path === "/" ? siteUrl : `${siteUrl}${path}`;
}

/* ------------------------------------------------------------------ */
/* Profile and public contact details                                 */
/* ------------------------------------------------------------------ */

export const profile: Profile = {
  name: siteName,
  handle: "LyaQanYi",
  role: "记录、折腾与分享",
  tagline: "记录做过的东西，也给没想完的问题留个位置。",
  intro:
    `你好，我是${siteName}，来自安徽。这里放着我的项目、笔记，以及一些还在探索中的想法。`,
  bio: [
    `你好，我是${siteName}，来自安徽。这里是我在互联网上慢慢整理的一小块地方。`,
    "我想把做过的东西和思考的过程留在这里：一个项目是怎么开始的，途中做了哪些选择，还有哪些问题值得继续探索。",
    "网站本身也会持续更新。如果某个项目或某篇笔记让你想到什么，欢迎来聊聊。",
  ],
  email: "hi@lyaqanyi.com",
  location: "中国 · 安徽",
  availability: "个人网站持续更新中",
  socials: [
    {
      id: "email",
      label: "Email",
      note: "关于项目与文章，欢迎写信交流",
      href: "mailto:hi@lyaqanyi.com",
      icon: "mail",
      priority: 1,
    },
    {
      id: "github",
      label: "GitHub",
      note: "开源项目与代码实验",
      href: "https://github.com/LyaQanYi",
      icon: "github",
      priority: 2,
    },
    {
      id: "x",
      label: "X",
      note: "碎片想法与日常记录",
      href: "https://x.com/lyaqanyi",
      icon: "x",
      priority: 3,
    },
    // Add WeChat when a real article URL or QR asset is available.
    {
      id: "bilibili",
      label: "哔哩哔哩",
      note: "我的哔哩哔哩主页",
      href: "https://space.bilibili.com/517648971",
      icon: "bilibili",
      priority: 5,
    },
    {
      id: "rss",
      label: "RSS",
      note: "订阅本站更新",
      href: feedPath,
      icon: "rss",
      priority: 6,
    },
  ],
};

/**
 * Presentation order for social links, shared by every list that shows them.
 * Sorting in one place keeps the hero, the contact list and the footer
 * agreeing even if `profile.socials` above is reordered or a
 * priority number changes.
 */
export const sortedSocials = [...profile.socials].sort(
  (a, b) => a.priority - b.priority,
);

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export interface NavItem {
  path: string;
  labelKey: "home" | "work" | "writing" | "about";
}

/** Shared page order for desktop, mobile and footer navigation. */
export const navItems: NavItem[] = [
  { path: "/", labelKey: "home" },
  { path: "/work", labelKey: "work" },
  { path: "/writing", labelKey: "writing" },
  { path: "/about", labelKey: "about" },
];

/**
 * Canonical URL plus the feed's discovery link.
 *
 * The feed rides along here rather than being declared once in the root layout:
 * metadata resolves per key, so a page that sets its own `alternates` replaces
 * the inherited object instead of merging into it. Since every page declares a
 * canonical URL, a layout-level entry would be dropped everywhere — which is to
 * say, everywhere it was meant to appear. Putting it in the one helper all of
 * them call is what makes it site-wide.
 *
 * There are no hreflang entries. Those advertise the same document in another
 * language, and this site has one.
 */
export function alternatesFor(path: string = "/"): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(path),
    /* Titled with the site name. The array form is what Next's
       `alternates.types` accepts — one MIME type may name several feeds. */
    types: {
      "application/rss+xml": [{ url: feedUrl, title: `${siteName} · RSS` }],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Social card                                                         */
/* ------------------------------------------------------------------ */

/**
 * Dimensions and alt text of the card rendered by `app/opengraph-image.tsx`.
 * Held here rather than there because the routes that declare their own
 * `openGraph` have to point at the same picture, and a second copy of these
 * numbers would be free to drift from the first.
 *
 * The alt text is Chinese and the picture is not — see that file for why.
 */
export const socialCard = {
  width: 1200,
  height: 630,
  alt: `${siteName} — ${profile.role}`,
} as const;

/** The `images` array for the shared card. */
export function socialImages() {
  return [
    {
      /* Written out rather than left to the metadata file convention: a route
         that declares its own `openGraph` stops inheriting the convention's
         image, and the un-hashed path serves the same bytes. */
      url: `${siteUrl}/opengraph-image`,
      width: socialCard.width,
      height: socialCard.height,
      alt: socialCard.alt,
    },
  ];
}

/**
 * The share metadata every route needs: a canonical URL, plus an `openGraph`
 * object that is complete on its own.
 *
 * Routes call this instead of assembling the pieces, because metadata resolves
 * per key and an `openGraph` object set by a page *replaces* the inherited one
 * rather than merging into it. A page declaring only `type: "article"` therefore
 * silently drops the card image, and a layout declaring a title or a URL imposes
 * it on every route beneath it — which is how every list page here came to
 * advertise the home page's URL as its own, and every article came to share
 * under the site's name. Completing the object in one place makes both mistakes
 * unreachable.
 *
 * `title` and `description` are deliberately absent. Next infers them from the
 * route's own resolved `title`, which is the only way each page gets its own
 * rather than the site's; setting them here would repeat the layout's mistake.
 */
export function shareMetadata(
  path: string = "/",
  options: {
    type?: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
  } = {},
): Pick<Metadata, "alternates" | "openGraph"> {
  const { type = "website", ...article } = options;

  return {
    alternates: alternatesFor(path),
    openGraph: {
      type,
      siteName,
      locale: openGraphLocale,
      url: absoluteUrl(path),
      images: socialImages(),
      ...article,
    },
  };
}
