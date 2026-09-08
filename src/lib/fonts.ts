import localFont from "next/font/local";

/** Shared by site headings and the comparison page, so the face loads once. */
export const sourceHanSansCN = localFont({
  src: "../fonts/source-han-sans-cn.woff2",
  variable: "--font-source-han-sans-cn",
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
});
