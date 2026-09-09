import localFont from "next/font/local";

/** Preload common glyphs once; CSS loads the remaining Unicode blocks on demand. */
export const sourceHanSansCN = localFont({
  src: "../fonts/source-han-sans-cn/core.woff2",
  variable: "--font-source-han-sans-cn-core",
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
});
