import type { Metadata } from "next";

import { PostFilter, type PostGroup } from "@/components/post-filter";
import { PostRow } from "@/components/post-row";
import { Container, PageHeader } from "@/components/section";
import { fill, uiCopy } from "@/content/copy";
import { getPostTopics, sortedPosts } from "@/content/posts";
import { shareMetadata } from "@/content/site";
import { formatYear } from "@/lib/format";

export function generateMetadata(): Metadata {
  return {
    title: uiCopy.writing.title,
    description: uiCopy.writing.intro,
    ...shareMetadata("/writing"),
  };
}

export default function WritingPage() {
  const topics = getPostTopics();

  /* Grouped here rather than in the filter so the client only ever rearranges
     nodes it was handed. `sortedPosts` is newest-first, which makes both the
     rows inside a year and the years themselves come out descending — the
     Map preserves that insertion order. */
  const byYear = new Map<string, PostGroup>();
  for (const [index, post] of sortedPosts.entries()) {
    const year = formatYear(post.date);
    const item = {
      slug: post.slug,
      topic: post.topic,
      row: <PostRow post={post} showFeatured revealDelay={160 + Math.min(index, 3) * 60} />,
    };

    const group = byYear.get(year);
    if (group) group.items.push(item);
    else byYear.set(year, { year, items: [item] });
  }

  return (
    <>
      <PageHeader
        eyebrow={fill(uiCopy.writing.postsCount, { count: sortedPosts.length })}
        title={uiCopy.writing.title}
        description={uiCopy.writing.intro}
      />

      <Container className="py-14 sm:py-16">
        <PostFilter
          label={uiCopy.writing.topicLabel}
          allLabel={uiCopy.common.allTopics}
          emptyLabel={uiCopy.writing.empty}
          archiveLabel={uiCopy.writing.archiveHeading}
          totalCount={sortedPosts.length}
          chips={topics.map((topic) => ({
            key: topic.key,
            label: topic.label,
            count: topic.count,
          }))}
          groups={[...byYear.values()]}
        />
      </Container>
    </>
  );
}
