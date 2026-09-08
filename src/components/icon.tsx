import type { ReactNode, SVGProps } from "react";
import { siBilibili, siGithub, siWechat, siX } from "simple-icons";

import type { IconName } from "@/content/types";

/** Brand marks are filled single-path glyphs sourced from `simple-icons`. */
const brandIcons = ["github", "x", "wechat", "bilibili"] as const;
type BrandIcon = (typeof brandIcons)[number];
type StrokeIcon = Exclude<IconName, BrandIcon>;

const brandPaths: Record<BrandIcon, string> = {
  github: siGithub.path,
  x: siX.path,
  wechat: siWechat.path,
  bilibili: siBilibili.path,
};

function isBrand(name: IconName): name is BrandIcon {
  return (brandIcons as readonly string[]).includes(name);
}

/**
 * Hand-drawn on a 24×24 grid. Filled shapes opt out of the stroke explicitly,
 * so the parent `<svg>` can stay stroke-first for everything else.
 *
 * `Record<StrokeIcon, …>` is deliberate: adding a name to the union without
 * drawing it becomes a compile error rather than a silently missing glyph.
 */
const strokeIcons: Record<StrokeIcon, ReactNode> = {
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 8 8.5 6 8.5-6" />
    </>
  ),
  rss: (
    <>
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9.5h17.6M3.2 14.5h17.6" />
      <path d="M12 3a15.5 15.5 0 0 1 0 18 15.5 15.5 0 0 1 0-18Z" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M12 4v15" />
      <path d="m6 13 6 6 6-6" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5" />
    </>
  ),
  printer: (
    <>
      {/* Sheet feeding in from the top, the body, then the printed sheet
          emerging below it — the body's bottom edge stays open so the two
          read as one object rather than a box sitting on a rectangle. */}
      <path d="M7 9.5V3.5h10v6" />
      <path d="M7 17.5H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <rect x="7" y="13.5" width="10" height="7" rx="1.5" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 1.8v2.4M12 19.8v2.4M4.5 4.5l1.7 1.7M17.8 17.8l1.7 1.7M1.8 12h2.4M19.8 12h2.4M4.5 19.5l1.7-1.7M17.8 6.2l1.7-1.7" />
    </>
  ),
  moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />,
  menu: <path d="M3 6.5h18M3 12h18M3 17.5h18" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  sparkle: (
    <>
      <path d="M11 3.5 12.8 9 18.3 10.8 12.8 12.6 11 18.1 9.2 12.6 3.7 10.8 9.2 9Z" />
      <path d="M18.2 3.2 18.9 5.3 21 6 18.9 6.7 18.2 8.8 17.5 6.7 15.4 6 17.5 5.3Z" />
    </>
  ),
  quote: (
    <>
      <path
        d="M9.6 5.4C6.6 7 5 9.7 5 13.1V19h6.4v-6.4H8.5c0-2.1.9-3.8 2.7-4.9Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M19.6 5.4C16.6 7 15 9.7 15 13.1V19h6.4v-6.4h-2.9c0-2.1.9-3.8 2.7-4.9Z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  mapPin: (
    <>
      <path d="M19.5 10.2c0 5.3-7.5 11.3-7.5 11.3s-7.5-6-7.5-11.3a7.5 7.5 0 1 1 15 0Z" />
      <circle cx="12" cy="10" r="2.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Rendered edge length in pixels; the viewBox is always 24×24. */
  size?: number;
  strokeWidth?: number;
  /** Adds a `<title>` and exposes the icon to assistive technology. */
  title?: string;
}

/**
 * Renders as plain SVG markup with no client boundary, so it is safe to use
 * from Server Components without shipping JavaScript.
 */
export function Icon({
  name,
  size = 18,
  strokeWidth = 1.6,
  title,
  ...rest
}: IconProps) {
  const labelled = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  if (isBrand(name)) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        {...labelled}
        {...rest}
      >
        <path d={brandPaths[name]} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...labelled}
      {...rest}
    >
      {strokeIcons[name]}
    </svg>
  );
}
