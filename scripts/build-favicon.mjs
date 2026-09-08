/* Rasterises `src/app/icon.svg` into `src/app/favicon.ico`.
 *
 * The SVG is the mark the site actually ships and modern browsers use it
 * directly, through the `<link rel="icon">` that Next emits for a file at that
 * path. This exists for the clients that ask for `/favicon.ico` by convention
 * and never read the link tag: Windows shortcuts, some crawlers, some feed
 * readers. Deriving it from the SVG rather than drawing a second mark is what
 * stops the two from drifting apart.
 *
 * Deliberately not wired into `npm run build`. The output is committed and only
 * needs regenerating when the mark changes, and a build step that can fail on a
 * missing optional dependency is a bad trade for something that runs once.
 *
 *   node scripts/build-favicon.mjs
 *
 * Needs `sharp`, which arrives as an *optional* dependency of `next` and so may
 * be absent from a minimal or `--omit=optional` install. The script says so
 * rather than dying on an unresolved import.
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "src/app/icon.svg");
const target = join(root, "src/app/favicon.ico");

/* 16 and 32 are the sizes browsers and the OS actually request. 48 is included
   for Windows' larger views, where a 32 upscaled by 1.5 goes visibly soft. */
const SIZES = [16, 32, 48];

/* Rendered several times above the largest target and then downsampled, so the
   ring and the tail antialias instead of aliasing at the small sizes. At this
   density a 64-unit viewBox comes out around 533px across. */
const DENSITY = 600;

async function loadSharp() {
  try {
    const sharp = await import("sharp");
    return sharp.default;
  } catch {
    throw new Error(
      [
        "sharp is not installed. It ships as an optional dependency of next,",
        "so a minimal install may not have it.",
        "",
        "    npm i -D sharp && node scripts/build-favicon.mjs",
      ].join("\n"),
    );
  }
}

/* One PNG per size.

   These come out in the light variant, and not by choice: the rasteriser has no
   OS appearance to consult, so it resolves the SVG's `prefers-color-scheme`
   query as non-matching and keeps the base declarations. An ICO has nowhere to
   record a second variant either — a client picking an entry matches on size
   and bit depth alone. So the light mark is what lands in the file, while the
   SVG continues to serve both appearances to browsers that read it directly.
   `verify` below reads the finished file back and decodes each entry. */
async function rasterise(svg) {
  const sharp = await loadSharp();
  return Promise.all(
    SIZES.map((size) =>
      sharp(svg, { density: DENSITY }).resize(size, size).png().toBuffer(),
    ),
  );
}

/* An ICO is a six-byte header, sixteen bytes of directory entry per image, then
   the payloads. PNG payloads have been legal since Vista and are the only way
   to keep the alpha the rounded corners need; a BMP payload would need an AND
   mask written out by hand to describe the same transparency. */
function packIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved, always 0
  header.writeUInt16LE(1, 2); // 1 = icon, 2 = cursor
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;

  images.forEach((image, index) => {
    const size = SIZES[index];
    const at = index * 16;
    /* A byte of 0 means 256. None of these sizes reach that, but the wrap is
       what keeps a future larger entry from silently becoming 0. */
    directory.writeUInt8(size >= 256 ? 0 : size, at);
    directory.writeUInt8(size >= 256 ? 0 : size, at + 1);
    directory.writeUInt8(0, at + 2); // colour count, 0 = no palette
    directory.writeUInt8(0, at + 3); // reserved
    directory.writeUInt16LE(1, at + 4); // colour planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(image.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += image.length;
  });

  return Buffer.concat([header, directory, ...images]);
}

/* Reads the written file back rather than trusting the buffers that went into
   it. A directory entry whose offset or length is wrong produces a file that is
   still a valid ICO to this script and a blank tab icon to a browser, so each
   entry is decoded from the bytes at the offset the header claims for it. */
async function verify(file) {
  const sharp = await loadSharp();
  const buffer = await readFile(file);

  if (buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1) {
    throw new Error("header does not describe an icon directory");
  }
  const count = buffer.readUInt16LE(4);
  if (count !== SIZES.length) {
    throw new Error(`expected ${SIZES.length} entries, header says ${count}`);
  }

  const decoded = [];
  for (let index = 0; index < count; index += 1) {
    const at = 6 + index * 16;
    const size = buffer.readUInt8(at) || 256;
    const length = buffer.readUInt32LE(at + 8);
    const offset = buffer.readUInt32LE(at + 12);

    if (offset + length > buffer.length) {
      throw new Error(`entry ${size}px runs past the end of the file`);
    }
    /* Compares the two stored bytes rather than either against the decoded
       size, so an entry stored as 0 meaning 256 is still recognised as square. */
    if (buffer.readUInt8(at) !== buffer.readUInt8(at + 1)) {
      throw new Error(`entry ${index} is not square`);
    }

    const payload = buffer.subarray(offset, offset + length);
    const meta = await sharp(payload).metadata();
    if (meta.format !== "png" || meta.width !== size || meta.height !== size) {
      throw new Error(
        `entry ${index} decoded as ${meta.format} ${meta.width}x${meta.height}, expected png ${size}x${size}`,
      );
    }

    /* Guards against a payload that decodes cleanly but paints nothing, which
       is what an SVG that failed to render would leave behind. */
    const { channels } = await sharp(payload).stats();
    const alpha = channels[3] ? channels[3].mean : 255;
    if (alpha <= 0) {
      throw new Error(`entry ${size}px is fully transparent`);
    }

    decoded.push(`${size}px ${length}B alpha ${alpha.toFixed(0)}/255`);
  }

  const lastEnd =
    buffer.readUInt32LE(6 + (count - 1) * 16 + 12) +
    buffer.readUInt32LE(6 + (count - 1) * 16 + 8);
  if (lastEnd !== buffer.length) {
    throw new Error(`${buffer.length - lastEnd} bytes unaccounted for`);
  }

  return decoded;
}

const images = await rasterise(await readFile(source));
const ico = packIco(images);
await writeFile(target, ico);
const decoded = await verify(target);

console.log(`favicon.ico ${ico.length}B ← ${decoded.join(", ")}`);
