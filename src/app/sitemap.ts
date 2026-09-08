import type { MetadataRoute } from "next";

import { sortedPosts } from "@/content/posts";
import { sortedProjects } from "@/content/projects";
import { absoluteUrl } from "@/content/site";

type Entry = MetadataRoute.Sitemap[number];

/** One entry per path, spelled exactly as that path's own canonical URL is —
 *  both come from `absoluteUrl`. There is no `alternates` block: hreflang
 *  advertises the same document in another language, and this site has one. */
function entry(path: string, options: Omit<Entry, "url"> = {}): Entry {
  return { url: absoluteUrl(path), ...options };
}

/** Parses an ISO date as UTC midnight, matching `lib/format` so the sitemap is
 *  identical no matter which machine builds it. */
function date(iso: string) {
  return new Date(iso);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const newestPost = sortedPosts[0];
  const newestProject = sortedProjects[0];

  return [
    entry("/", {
      changeFrequency: "weekly",
      priority: 1,
      lastModified: newestPost
        ? date(newestPost.updated ?? newestPost.date)
        : undefined,
    }),

    /* The list changes when an entry is added, so its `lastmod` follows the
       newest entry rather than claiming a date of its own. */
    entry("/work", {
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: newestProject
        ? date(`${newestProject.year}-01-01`)
        : undefined,
    }),
    /* Projects carry only a year, so no `lastModified` is claimed: a fabricated
       month would be a lie a crawler could not check. */
    ...sortedProjects.map((project) =>
      entry(`/work/${project.slug}`, {
        changeFrequency: "yearly",
        priority: 0.6,
      }),
    ),

    entry("/writing", {
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: newestPost
        ? date(newestPost.updated ?? newestPost.date)
        : undefined,
    }),
    ...sortedPosts.map((post) =>
      entry(`/writing/${post.slug}`, {
        changeFrequency: "yearly",
        priority: 0.7,
        lastModified: date(post.updated ?? post.date),
      }),
    ),

    entry("/about", { changeFrequency: "yearly", priority: 0.7 }),
  ];
}
