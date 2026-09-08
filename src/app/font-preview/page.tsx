import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import Link from "next/link";

import { Container } from "@/components/section";
import { sortedPosts } from "@/content/posts";
import { featuredProjects } from "@/content/projects";
import { profile } from "@/content/site";
import { sourceHanSansCN } from "@/lib/fonts";
import { FontComparison } from "./font-comparison";

// Keep the previous title face available only in this comparison.
const originalDisplay = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "字体对比",
  description: "对比原版字体与 Source Han Sans CN 的标题和正文效果。",
  robots: { index: false, follow: false },
};

export default function FontPreviewPage() {
  const post = sortedPosts[0];
  const project = featuredProjects[0];

  return (
    <Container className={`${originalDisplay.variable} py-10 sm:py-14`}>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="eyebrow">排版试验</p>
          <h1 className="mt-3 font-display text-3xl text-fg sm:text-4xl">换一种字，看看感觉</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted">
            两边使用相同的内容、字号和行距。可以只换标题，也可以一起比较正文。
          </p>
        </div>
        <Link href="/" className="link-underline text-sm text-fg-muted hover:text-fg">返回网站</Link>
      </div>

      <FontComparison
        fontFamily={sourceHanSansCN.style.fontFamily}
        sample={{
          name: profile.name,
          handle: profile.handle,
          role: profile.role,
          tagline: profile.tagline,
          email: profile.email,
          location: profile.location,
          paragraphs: [profile.intro, profile.bio[1]],
          projectTitle: project?.title ?? "个人网站",
          projectSummary: project?.summary ?? profile.tagline,
          postTitle: post?.title ?? "最近的文字",
          postDescription: post?.description ?? profile.intro,
        }}
      />
    </Container>
  );
}
