/* Contrast audit + hue-preserving fix proposals for the theme tokens.
 *
 * Reads the live values out of `globals.css` rather than holding its own copy:
 * a hard-coded table keeps reporting the numbers it was written against long
 * after they have been fixed, which turns the audit into noise.
 *
 * Exit code 0 means every mode passes, 1 means something failed, 2 means
 * the parser could not find a token it expects (a stylesheet refactor).
 */

import { readFileSync } from "node:fs";
// Aliased: `resolve` below is the cascade resolver, not the path helper.
import { dirname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb([h, s, l]) {
  if (s === 0) return [l, l, l].map((v) => v * 255);
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) => v * 255);
}

/**
 * Moves only the HSL lightness, so the hue and saturation survive. `toward`
 * is -1 to darken, +1 to lighten. Returns null when the target is unreachable.
 */
function adjustToContrast(hex, bg, target, toward) {
  const [h, s, l] = rgbToHsl(hexToRgb(hex));
  let lo = toward < 0 ? 0 : l;
  let hi = toward < 0 ? l : 1;
  const edge = toward < 0
    ? contrast(rgbToHex(hslToRgb([h, s, 0])), bg)
    : contrast(rgbToHex(hslToRgb([h, s, 1])), bg);
  if (edge < target) return null;

  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const ratio = contrast(rgbToHex(hslToRgb([h, s, mid])), bg);
    // Darkening raises contrast against a light bg; lightening raises it against a dark bg.
    if (ratio >= target) {
      if (toward < 0) lo = mid; else hi = mid;
    } else {
      if (toward < 0) hi = mid; else lo = mid;
    }
  }
  // Whichever bound moved *toward* the original lightness while still passing:
  // `lo` climbs when darkening, `hi` descends when lightening. Returning `lo`
  // unconditionally would hand back a failing value in the lightening case.
  return rgbToHex(hslToRgb([h, s, toward < 0 ? lo : hi]));
}

/* ------------------------------------------------------------------ */
/* Parse the stylesheet                                                */
/* ------------------------------------------------------------------ */

const CSS_VAR_TO_TOKEN = {
  "--bg": "bg",
  "--bg-alt": "bgAlt",
  "--surface": "surface",
  "--surface-hover": "surfaceHover",
  "--fg": "fg",
  "--fg-muted": "fgMuted",
  "--fg-subtle": "fgSubtle",
  "--accent": "accent",
  "--accent-hover": "accentHover",
  "--accent-contrast": "accentContrast",
  "--accent-soft": "accentSoft",
};

// An alternative stylesheet can be passed as the first argument, which is how
// the failure path gets tested without editing the real tokens.
const cssPath = process.argv[2]
  ? resolvePath(process.argv[2])
  : join(dirname(fileURLToPath(import.meta.url)), "..", "src", "app", "globals.css");
// Comments go first: several of them mention `[data-mode]`, and a stray match
// there would misattribute declarations to the wrong mode.
const css = readFileSync(cssPath, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/* `@media print` re-declares the whole palette in paper colours, and nothing on
   screen ever resolves through that block — auditing it would grade values no
   visitor sees and pass a page that is actually unreadable. It is the last
   section in the sheet, so everything before it is what a browser paints. */
const printAt = css.indexOf("@media print");
const screenCss = printAt === -1 ? css : css.slice(0, printAt);

/**
 * The two blocks that carry the palette: an unscoped `:root` and its dark
 * override.
 *
 * Matched on the exact selector rather than on a substring. The print block's
 * selector is the list `:root, :root[data-mode]`, which contains `:root` — so a
 * substring test would pull the paper colours in, and because that block comes
 * last in source order the cascade resolver would then let them win.
 *
 * The capture group runs back to the previous `}`, not to the start of the
 * selector, so at-rules end up glued to the front of it: the first block in the
 * sheet arrives as `@import "tailwindcss"; ... :root`. Taking the text after the
 * last semicolon drops that. Splitting on commas as well would be wrong — it is
 * exactly the print block's comma-separated list that has to fail the match.
 */
function parseTokenBlocks(source) {
  const found = [];
  for (const [, selector, body] of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const name = selector.split(";").pop().trim();
    if (name === ":root") found.push({ mode: "light", body });
    else if (name === ':root[data-mode="dark"]') found.push({ mode: "dark", body });
  }
  return found;
}

function declarations(body) {
  const out = {};
  for (const [, name, raw] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const token = CSS_VAR_TO_TOKEN[name];
    const value = raw.trim();
    // Only flat hex is comparable. `color-mix()` decorations are not text or
    // surface colours, so they are simply not this script's business.
    if (token && /^#[0-9a-f]{6}$/i.test(value)) out[token] = value.toLowerCase();
  }
  return out;
}

/** Applies the cascade the browser would: the dark block overrides the base. */
function resolve(blocks, mode) {
  let tokens = {};
  for (const block of blocks) {
    if (block.mode === "dark" && mode === "light") continue;
    tokens = { ...tokens, ...declarations(block.body) };
  }
  return tokens;
}

const blocks = parseTokenBlocks(screenCss);
const modes = Object.fromEntries(
  ["light", "dark"].map((mode) => [mode, resolve(blocks, mode)]),
);

const required = Object.values(CSS_VAR_TO_TOKEN);
for (const [name, tokens] of Object.entries(modes)) {
  const missing = required.filter((token) => !tokens[token]);
  if (missing.length) {
    console.error(
      `parse failure — ${name} is missing ${missing.join(", ")}.\n` +
        "Either the stylesheet was refactored or a colour is no longer a flat hex value.",
    );
    process.exit(2);
  }
}
console.log(`auditing ${Object.keys(modes).length} modes read from globals.css\n`);

const TARGET = 4.6; // a hair above the 4.5 AA threshold, to survive rounding

/* Only the backgrounds each token is *actually* rendered on. Over-constraining
   here would darken fg-subtle to near fg-muted and flatten the hierarchy. */
const pageSurfaces = ["bg", "bgAlt", "surface", "surfaceHover"];
const allSurfaces = [...pageSurfaces, "accentSoft"];

const problems = [];

for (const [name, t] of Object.entries(modes)) {
  const dark = name === "dark";
  const toward = dark ? 1 : -1; // lighten on dark bgs, darken on light bgs

  const checks = [
    // meta text: dates, stack tags, eyebrows — never sits on accent-soft
    ["fgSubtle", pageSurfaces, t.fgSubtle, 4.5],
    // body-secondary text: appears inside the selected switcher row too
    ["fgMuted", allSurfaces, t.fgMuted, 4.5],
    // links and active states, as text on the page surfaces
    ["accent-as-text", pageSurfaces, t.accent, 4.5],
    // On accent-soft the accent is only ever the selected row's border and its
    // check icon — both non-text, so WCAG 1.4.11 asks for 3:1 rather than 4.5:1.
    ["accent-as-graphic", ["accentSoft"], t.accent, 3],
    ["accentContrast-on-accent", ["accent"], t.accentContrast, 4.5],
  ];

  for (const [label, bgs, fg, min] of checks) {
    for (const bgKey of bgs) {
      const bg = t[bgKey];
      const ratio = contrast(fg, bg);
      if (ratio < min) {
        const fixed = adjustToContrast(fg, bg, TARGET, toward);
        problems.push({ mode: name, pair: `${label} ${fg} on ${bgKey} ${bg}`, ratio: ratio.toFixed(2), fixed });
      }
    }
  }
}

/* Report: worst offender per (mode, token) with the strictest fix. */
const grouped = new Map();
for (const p of problems) {
  const token = p.pair.split(" ")[0];
  const fg = p.pair.split(" ")[1];
  const key = `${p.mode}|${token}|${fg}`;
  const existing = grouped.get(key);
  if (!existing || Number(p.ratio) < Number(existing.ratio)) grouped.set(key, p);
}

console.log("=== FAILING PAIRS (worst per mode+token) ===");
if (grouped.size === 0) {
  console.log("none — every foreground/accent pair clears 4.5:1 on the surfaces it renders on");
}
for (const p of grouped.values()) {
  console.log(`${p.mode.padEnd(6)} ${p.pair.padEnd(52)} ${String(p.ratio).padStart(5)}`);
}

/* ------------------------------------------------------------------ */
/* Solve, don't just patch.                                            */
/*                                                                     */
/* A minimum-distance fix collapses the hierarchy: the smallest value that     */
/* merely passes for fg-subtle can land within a shade of the existing         */
/* fg-muted, leaving two text steps that look like one. So instead solve       */
/* each ramp step for a target ratio, keeping the hue and saturation the       */
/* designer chose.                                                             */
/* ------------------------------------------------------------------ */

const TARGETS = { fgSubtle: 4.7, fgMuted: 6.5 };
/* accent-soft is one small UI surface (the selected switcher row), so it only
   needs to clear AA — holding it to the page target would over-darken body
   text site-wide for the sake of a single description line. */
const SOFT_TARGET = 4.6;

/** Least lightness change that clears every constraint in `groups`. */
function solveRamp(hex, t, groups, toward) {
  let best = hex;
  let binding = null;
  for (const [bgs, target] of groups) {
    const worstBg = bgs.reduce((a, b) => (contrast(best, t[a]) < contrast(best, t[b]) ? a : b));
    const worst = Math.min(...bgs.map((b) => contrast(best, t[b])));
    if (worst >= target) continue;
    const fixed = adjustToContrast(best, t[worstBg], target, toward);
    if (!fixed) return { hex, unreachable: true, ratio: worst };
    best = fixed;
    binding = worstBg;
  }
  const ratio = Math.min(
    ...groups.flatMap(([bgs]) => bgs).map((b) => contrast(best, t[b])),
  );
  return { hex: best, ratio, binding, unchanged: best === hex };
}

console.log("\n=== FOREGROUND RAMP (solved for target ratios) ===");
let offTarget = 0;
for (const [name, t] of Object.entries(modes)) {
  const toward = name === "dark" ? 1 : -1;
  const parts = [];
  for (const [token, target] of [["fgSubtle", TARGETS.fgSubtle], ["fgMuted", TARGETS.fgMuted]]) {
    const groups = token === "fgMuted"
      ? [[pageSurfaces, target], [["accentSoft"], SOFT_TARGET]]
      : [[pageSurfaces, target]];
    const solved = solveRamp(t[token], t, groups, toward);
    if (!solved.unchanged) offTarget++;
    const mark = solved.unchanged ? "=" : solved.unreachable ? "!" : "*";
    parts.push(
      `${token} ${t[token]}->${solved.hex}${mark} ${solved.ratio.toFixed(2)}` +
        (solved.binding ? ` (on ${solved.binding})` : ""),
    );
  }
  console.log(`${name.padEnd(6)} fg ${contrast(t.fg, t.bg).toFixed(1)}:1 | ${parts.join(" | ")}`);

  // Hierarchy check: the three steps must stay distinguishable from each other.
  const [sub, mut] = parts.map((p) => p.split("->")[1].split(/[*=!]/)[0]);
  console.log(
    `${"".padEnd(6)}   ramp on bg: fg ${contrast(t.fg, t.bg).toFixed(1)}` +
      ` / muted ${contrast(mut, t.bg).toFixed(1)}` +
      ` / subtle ${contrast(sub, t.bg).toFixed(1)}` +
      `   muted-vs-subtle step ${(contrast(mut, t.bg) - contrast(sub, t.bg)).toFixed(1)}`,
  );
}

console.log("\n=== ACCENT ===");
let accentFailures = 0;
for (const [name, t] of Object.entries(modes)) {
  const toward = name === "dark" ? 1 : -1;
  const asText = contrast(t.accent, t.accentSoft);
  const asTextPage = Math.min(...pageSurfaces.map((b) => contrast(t.accent, t[b])));
  const onAccent = contrast(t.accentContrast, t.accent);
  const flag = asTextPage < 4.5 || onAccent < 4.5 ? "  <-- FAIL" : "";
  console.log(
    `${name.padEnd(6)} accent ${t.accent}  as-text(page) ${asTextPage.toFixed(2)}` +
      `  graphic-on-soft ${asText.toFixed(2)}  label-on-accent ${onAccent.toFixed(2)}${flag}`,
  );

  if (flag) {
    accentFailures++;
    /* Both constraints are satisfied by moving the accent the same way: on a
       light page, darkening the accent raises accent-as-text contrast *and*
       raises the near-white button label's contrast against it. */
    const forText = adjustToContrast(t.accent, t.bgAlt, 4.6, toward);
    const forLabel = adjustToContrast(t.accent, t.accentContrast, 4.6, toward);
    const need = [forText, forLabel].filter(Boolean);
    if (need.length < 2) {
      console.log(`                  cannot satisfy both by moving accent lightness`);
      continue;
    }
    // The binding one is whichever moved furthest from the original.
    const [, , l0] = rgbToHsl(hexToRgb(t.accent));
    const pick = need.reduce((a, b) =>
      Math.abs(rgbToHsl(hexToRgb(b))[2] - l0) > Math.abs(rgbToHsl(hexToRgb(a))[2] - l0) ? b : a,
    );
    console.log(
      `                  propose accent ${pick}` +
        `  as-text(page) ${Math.min(...pageSurfaces.map((b) => contrast(pick, t[b]))).toFixed(2)}` +
        `  label-on-accent ${contrast(t.accentContrast, pick).toFixed(2)}` +
        `  icon-on-soft ${contrast(pick, t.accentSoft).toFixed(2)}`,
    );
    // accent-hover must stay a visible step beyond the new accent
    const hover = adjustToContrast(t.accentHover, t.bgAlt, 4.6, toward);
    console.log(
      `                  accent-hover ${t.accentHover} -> ${hover ?? "(unreachable)"}` +
        `  label-on-hover ${contrast(t.accentContrast, hover ?? t.accentHover).toFixed(2)}`,
    );
  }
}

/* ------------------------------------------------------------------ */
/* Verdict                                                             */
/*                                                                     */
/* Three bars are in play, and only the first two can fail this script.*/
/* WCAG AA (4.5:1) governs every pair that carries text; 3:1 governs   */
/* the accent used as a graphic, per 1.4.11, and a value between the   */
/* two is a pass there even though it would fail as text. The ramp     */
/* targets are higher than AA and exist so the three text steps stay   */
/* visibly distinct, so missing one is a warning, not a failure.       */
/* ------------------------------------------------------------------ */

const failures = grouped.size + accentFailures;
console.log("\n=== VERDICT ===");
if (offTarget) {
  console.log(
    `warning: ${offTarget} foreground token(s) differ from the solved optimum ` +
      "(marked * above); they may still clear AA but sit below the ramp target",
  );
}
if (failures) {
  console.log(
    `FAIL: ${grouped.size} pair(s) below WCAG AA in the table above` +
      (accentFailures ? ` + ${accentFailures} accent(s) flagged in the ACCENT section` : ""),
  );
  process.exit(1);
}
/* Worded per bar rather than as a blanket 4.5:1: the graphic pair is graded at
   3:1, and a summary claiming otherwise would overstate what passed. */
console.log(
  "pass: text pairs clear WCAG AA 4.5:1, the accent-as-graphic pair clears 1.4.11 3:1",
);
