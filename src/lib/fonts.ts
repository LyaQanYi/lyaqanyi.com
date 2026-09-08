import localFont from "next/font/local";

/** Shared by site headings and the comparison page, so the face loads once. */
export const cmdysj = localFont({
  src: "../fonts/cmdysj.woff2",
  variable: "--font-cmdysj",
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
});
