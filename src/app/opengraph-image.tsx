import { ImageResponse } from "next/og";

import { profile, siteUrl, socialCard } from "@/content/site";

/* The light tokens, spelled out rather than referenced. This renders outside
   any document, so there is no cascade for `var()` to resolve against and the
   values have to be literal. If the tokens move, these move with them by hand —
   which is why they are named after what they are rather than after where they
   came from. */
const paper = "#ffffff"; // --bg
const ink = "#0b0b0b"; // --fg, and --accent
const subtle = "#6c6c6c"; // --fg-subtle
const spot = "#ff3b1f"; // --spot

/* Taken from `socialCard` rather than restated here. The routes that declare
   their own `openGraph` point at this picture using those same numbers, and two
   copies would be free to disagree about the size of an image only one of them
   actually renders. */
export const alt = socialCard.alt;
export const size = { width: socialCard.width, height: socialCard.height };
export const contentType = "image/png";

/**
 * Shared social card for every page on the site.
 *
 * Two things about this file are load-bearing and neither is visible from
 * reading it.
 *
 * It is named explicitly in every route's `openGraph.images` rather than left
 * to this file convention alone. A route that declares its own `openGraph`
 * replaces the inherited object, image included, so the convention on its own
 * would reach only the routes that declare nothing — and those are exactly the
 * ones that need it least.
 *
 * The text is Latin only, and that is a constraint rather than a choice.
 * `next/og` ships exactly one face, Geist Regular, and that is the only text
 * guaranteed to render. Chinese *appears* to work locally: resvg leaves system
 * font fallback enabled and picks up PingFang from macOS, which is how the
 * glyphs get drawn. A Linux build host has no such font and the same code emits
 * empty space where the text was. An image that is correct on one machine and
 * blank on the deployment is worse than one that is consistently Latin.
 *
 * So the card sets the handle and the domain — the two things about this site
 * that are Latin to begin with — and leans on scale and rules rather than prose.
 * Nothing is lost where it matters: platforms take their headline from
 * `og:title` and their blurb from `og:description`, both Chinese and both
 * per-page. Adding Chinese here means shipping a CJK font file and passing it
 * through the `fonts` option — not merely changing the strings.
 *
 * The display face is Geist rather than the Instrument Serif the site itself
 * uses, for the same reason: a second face would have to be shipped as a file.
 */
export default function opengraphImage() {
  const domain = siteUrl.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: paper,
          paddingTop: 72,
          paddingRight: 84,
          paddingBottom: 72,
          paddingLeft: 84,
        }}
      >
        {/* Mark and origin. The tile is square, not rounded: the site's radii
            are all zero and the card should read as the same object. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              backgroundColor: ink,
              color: paper,
              fontSize: 44,
            }}
          >
            {profile.handle.charAt(0)}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: subtle,
              letterSpacing: 3,
            }}
          >
            {domain}
          </div>
        </div>

        {/* The wordmark, with the spot rule above it doing the work a subtitle
            would otherwise do. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: 190,
              height: 12,
              backgroundColor: spot,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 210,
              lineHeight: 1,
              color: ink,
              letterSpacing: -9,
              marginTop: 30,
            }}
          >
            {profile.handle}
          </div>
        </div>

        {/* A hard rule across the foot, the way a broadsheet closes a masthead. */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 4,
            backgroundColor: ink,
          }}
        />
      </div>
    ),
    size,
  );
}
