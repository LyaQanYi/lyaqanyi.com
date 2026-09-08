import Link from "next/link";

import { Icon } from "@/components/icon";
import { Container, PageHeader } from "@/components/section";
import { uiCopy } from "@/content/copy";

/**
 * Chinese, because the rest of the site is. Without this file Next renders its
 * own built-in 404, which is English — the one page that would have switched
 * language on a visitor, and precisely when they were already lost.
 *
 * Uses `PageHeader` like every other non-home route, so a dead link lands
 * somewhere that still looks like the site.
 */
export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="404"
        title={uiCopy.notFound.title}
        description={uiCopy.notFound.description}
      />

      <Container className="py-14 sm:py-16">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent-hover"
        >
          {uiCopy.notFound.backHome}
          <Icon
            name="arrowRight"
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </Container>
    </>
  );
}
