import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";

/**
 * Nothing here is kept from crawlers — every route is a public page, and the
 * feed and this sitemap are files meant to be read. The `Allow: /` rule is
 * therefore a formality, but the file itself is not: a crawler that never finds
 * a robots.txt has no way to learn where the sitemap lives, and the whole point
 * of `sitemap.ts` is to be found.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    /* Names the canonical host, so a crawler that honours it indexes that
       rather than whatever mirror or preview domain it arrived through. */
    host: siteUrl,
  };
}
