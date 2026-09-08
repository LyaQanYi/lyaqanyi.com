import { sortedPosts } from "@/content/posts";
import { absoluteUrl, feedUrl, htmlLang, profile, siteName } from "@/content/site";

/**
 * RSS 2.0 for the writing archive.
 */

/** Titles and descriptions are prose, so `&` and `<` are the ones that matter;
 *  the rest are escaped because a stray apostrophe in a copy edit should not be
 *  able to break the document. */
function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822, as RSS requires. Date-only ISO strings parse as UTC midnight, so
 *  this is as independent of the build machine's timezone as `lib/format`. */
function rfc822(iso: string) {
  return new Date(iso).toUTCString();
}

export function GET() {
  /* The channel's own link, spelled the way the home page's canonical is. */
  const home = absoluteUrl("/");

  /* `lastBuildDate` follows the newest post rather than the moment of the
     request. A feed that claims to have changed on every fetch makes readers
     re-download items that have not moved. An empty archive has no build date
     worth claiming, so the element is simply left out. */
  const newest = sortedPosts[0];
  const lastBuildDate = newest
    ? `    <lastBuildDate>${rfc822(newest.updated ?? newest.date)}</lastBuildDate>`
    : "";

  const items = sortedPosts
    .map((post) => {
      const url = absoluteUrl(`/writing/${post.slug}`);
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <pubDate>${rfc822(post.date)}</pubDate>`,
        categories,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(siteName)}</title>`,
    `    <link>${home}</link>`,
    `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    `    <description>${escapeXml(profile.tagline)}</description>`,
    /* RSS 2.0 wants a W3C DTD language code, which is the BCP 47 tag from
       `<html lang>` lower-cased: `zh-cn`. */
    `    <language>${htmlLang.toLowerCase()}</language>`,
    lastBuildDate,
    items,
    "  </channel>",
    "</rss>",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      /* Readers poll on their own schedule. An hour of shared-cache lifetime
         absorbs that polling without letting a new post sit unpublished for
         long; `max-age=0` keeps the reader's own copy honest. */
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
