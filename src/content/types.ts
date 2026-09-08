/**
 * Icons are hand-drawn inline SVG so they render as plain markup in Server
 * Components. Brand marks come from `simple-icons` path data (no React).
 */
export type IconName =
  // brand marks
  | "github"
  | "x"
  | "wechat"
  | "bilibili"
  // interface
  | "mail"
  | "rss"
  | "globe"
  | "arrowRight"
  | "arrowUpRight"
  | "arrowDown"
  | "external"
  | "copy"
  | "printer"
  | "check"
  | "sun"
  | "moon"
  | "menu"
  | "close"
  | "sparkle"
  | "quote"
  | "mapPin"
  | "calendar"
  | "clock";

export interface SocialLink {
  id: string;
  label: string;
  /** One-line descriptor shown under the label. */
  note: string;
  href: string;
  icon: IconName;
  /** Display order shared by every social link list. */
  priority: number;
}

export interface Profile {
  name: string;
  /** Short latin handle used in the wordmark and metadata. */
  handle: string;
  role: string;
  tagline: string;
  /** Long-form introduction, rendered as paragraphs on the about page. */
  bio: string[];
  /** Two-sentence introduction used on the home page. */
  intro: string;
  email: string;
  location: string;
  availability: string;
  socials: SocialLink[];
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectCategory =
  | "product"
  | "opensource"
  | "design"
  | "experiment";

export interface ProjectLink {
  label: string;
  href: string;
  kind: "live" | "source" | "case";
}

export interface Project {
  /** Drafts are excluded from public routes, lists and the sitemap. */
  draft?: boolean;
  slug: string;
  title: string;
  summary: string;
  /** Longer narrative for the detail page, rendered as paragraphs. */
  body: string[];
  sections?: { title: string; paragraphs: string[] }[];
  category: ProjectCategory;
  categoryLabel: string;
  /** Explicit lifecycle state used to group the work archive. */
  status: "ongoing" | "past";
  /** Four-digit year used for sorting; `period` supplies the visible dates. */
  year: number;
  period: string;
  role: string;
  stack: string[];
  highlights: string[];
  links: ProjectLink[];
  featured: boolean;
  /** Homepage order, independent of the chronological work archive. */
  featuredOrder?: number;
  /** Two colours used to synthesise a cover when no screenshot exists yet. */
  cover: { from: string; to: string; label?: string };
}

/* ------------------------------------------------------------------ */
/* Writing                                                             */
/* ------------------------------------------------------------------ */

/**
 * Structured prose instead of Markdown: no parser dependency, fully typed,
 * and headings carry stable ids so the table of contents can be derived.
 */
export type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; id: string; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "code"; lang: string; code: string };

export interface Post {
  /** Drafts are excluded from public routes, lists and RSS. */
  draft?: boolean;
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  updated?: string;
  topic: string;
  topicLabel: string;
  /** Shown as-is, prefixed with `#`. `getRelatedPosts` matches posts on these,
   *  so they double as the site's only controlled vocabulary. */
  tags: string[];
  minutes: number;
  featured: boolean;
  body: Block[];
}

/* ------------------------------------------------------------------ */
/* Résumé                                                              */
/* ------------------------------------------------------------------ */

export interface ExperienceItem {
  id: string;
  org: string;
  role: string;
  period: string;
  /** Sort key; higher renders first. */
  start: string;
  location?: string;
  summary: string;
  highlights: string[];
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  note?: string;
}

export interface Principle {
  title: string;
  body: string;
}

export interface NowItem {
  label: string;
  value: string;
}
