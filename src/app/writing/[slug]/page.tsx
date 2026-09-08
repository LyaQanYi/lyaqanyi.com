import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icon";
import { ArticleContents } from "@/components/article-contents";
import { PostBody } from "@/components/post-body";
import { PostContact } from "@/components/post-contact";
import { PostRow } from "@/components/post-row";
import { Container } from "@/components/section";
import { fill, uiCopy } from "@/content/copy";
import {
  getPost,
  getRelatedPosts,
  getTableOfContents,
  sortedPosts,
} from "@/content/posts";
import { shareMetadata } from "@/content/site";
import { formatDate, toIso } from "@/lib/format";

/** Every post, so the whole archive is prerendered. */
export function generateStaticParams() {
  return sortedPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/writing/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;

  const post = getPost(slug);
  if (!post) return {};

  const path = `/writing/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    ...shareMetadata(path, {
      type: "article",
      publishedTime: toIso(post.date),
      modifiedTime: post.updated ? toIso(post.updated) : undefined,
    }),
  };
}

export default async function PostPage(
  props: PageProps<"/writing/[slug]">,
) {
  const { slug } = await props.params;

  const post = getPost(slug);
  if (!post) notFound();

  const toc = getTableOfContents(post);
  const related = getRelatedPosts(post.slug);

  return (
    <>
      <Container className="py-10 sm:py-12">
        <Link
          href="/writing"
          className="page-enter group inline-flex items-center gap-2 font-mono text-xs text-fg-subtle transition-colors hover:text-fg"
        >
          <Icon
            name="arrowRight"
            size={14}
            className="rotate-180 transition-transform group-hover:-translate-x-0.5"
          />
          <span className="link-underline">{uiCopy.writing.backToWriting}</span>
        </Link>
      </Container>

      <article>
        <Container>
          <header className="border-b border-line pb-12">
            <div className="page-enter flex flex-wrap items-center gap-3">
              <span className="chip">{post.topicLabel}</span>
              {post.featured ? (
                <span className="chip border-accent text-accent">
                  <Icon name="sparkle" size={12} />
                  {uiCopy.common.featured}
                </span>
              ) : null}
            </div>

            <h1 className="page-enter enter-title display-title mt-5 max-w-3xl text-fg">
              {post.title}
            </h1>

            <p className="page-enter enter-description mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
              {post.description}
            </p>

            <div className="page-enter enter-controls mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-fg-subtle">
              <time dateTime={toIso(post.date)}>
                {fill(uiCopy.writing.publishedOn, {
                  date: formatDate(post.date),
                })}
              </time>

              {post.updated ? (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={toIso(post.updated)}>
                    {fill(uiCopy.writing.updatedOn, {
                      date: formatDate(post.updated),
                    })}
                  </time>
                </>
              ) : null}

              <span aria-hidden="true">·</span>
              <span>
                {fill(uiCopy.common.minuteRead, { minutes: post.minutes })}
              </span>
            </div>
          </header>
        </Container>

        <Container className="mt-12 grid gap-12 pb-20 sm:pb-24 lg:grid-cols-[1fr_15rem] lg:gap-16">
          {toc.length > 0 ? (
            <ArticleContents
              key={post.slug}
              entries={toc}
              label={uiCopy.writing.tableOfContents}
            />
          ) : null}
          <div className="min-w-0 max-w-2xl lg:col-start-1 lg:row-start-1">
            <PostBody blocks={post.body} />

            <ul className="mt-12 flex flex-wrap gap-1.5 border-t border-line pt-8">
              {post.tags.map((tag) => (
                <li key={tag} className="chip">
                  {`#${tag}`}
                </li>
              ))}
            </ul>
            <PostContact title={post.title} slug={post.slug} />
          </div>
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-line">
          <Container className="py-14 sm:py-16">
            <h2 className="display-section text-fg">
              {uiCopy.writing.relatedHeading}
            </h2>
            {/* `PostRow` draws its own rule above the first row, so the list
                needs no extra border of its own. */}
            <div className="mt-6">
              {related.map((item) => (
                <PostRow key={item.slug} post={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
