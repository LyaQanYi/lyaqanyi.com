import Link from "next/link";

import { Icon } from "@/components/icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { fill, uiCopy } from "@/content/copy";
import type { Post } from "@/content/types";
import { formatDate, toIso } from "@/lib/format";

export function postHref(slug: string) {
  return `/writing/${slug}`;
}

/**
 * One row of a post list. The title link is stretched over the whole row, so
 * the hit target is generous while the row still exposes exactly one link.
 *
 * A server component, so it reads the copy module directly.
 */
export function PostRow({
  post,
  showFeatured = false,
  revealDelay = 0,
}: {
  post: Post;
  showFeatured?: boolean;
  revealDelay?: number;
}) {
  return (
    <ScrollReveal
      animateOnMount
      delay={revealDelay}
      className="-mx-3 border-b border-line first:border-t first:border-line"
    >
      <article className="post-row group relative px-3 py-5 transition-colors hover:bg-surface-hover/70 focus-within:bg-surface-hover/70">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
          <time
            dateTime={toIso(post.date)}
            className="shrink-0 font-mono text-xs text-fg-subtle sm:w-28 sm:pt-1.5"
          >
            {formatDate(post.date)}
          </time>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-lg leading-snug text-fg sm:text-xl">
                <Link
                  href={postHref(post.slug)}
                  className="transition-colors after:absolute after:inset-0 group-hover:text-accent"
                >
                  {post.title}
                </Link>
              </h3>
              <Icon name="arrowRight" size={16} className="post-row-arrow mt-1 shrink-0 text-fg-subtle" />
            </div>

            <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
              {post.description}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-fg-subtle">
              {showFeatured && post.featured ? (
                <>
                  <span className="text-accent">{uiCopy.common.featured}</span>
                  <span aria-hidden="true">·</span>
                </>
              ) : null}
              <span>{post.topicLabel}</span>
              <span aria-hidden="true">·</span>
              <span>
                {fill(uiCopy.common.minuteRead, { minutes: post.minutes })}
              </span>
            </div>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}
