import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";

const origin = process.env.SITE_CHECK_URL ?? "http://127.0.0.1:3100";
const get = (path) => fetch(new URL(path, origin), {
  signal: AbortSignal.timeout(5000),
});

let ready = false;
for (let attempt = 0; attempt < 40; attempt += 1) {
  try {
    const response = await get("/");
    ready = response.ok;
    await response.arrayBuffer();
    if (ready) break;
  } catch { /* The server may still be starting. */ }
  await setTimeout(500);
}
assert(ready, `Website did not start at ${origin}`);

for (const path of ["/", "/about", "/work", "/work/neko", "/writing", "/writing/building-a-personal-home"]) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert(html.includes("浅忆QanYi"), `${path}: expected site content`);
  if (path === "/") {
    for (const extension of ["css", "woff2"]) {
      const asset = html.match(new RegExp(`(?:href|src)="([^" ]+\\.${extension}(?:\\?[^" ]*)?)"`))?.[1];
      assert(asset, `Missing ${extension} asset in home page`);
      const assetResponse = await get(asset.replaceAll("&amp;", "&"));
      assert.equal(assetResponse.status, 200, `Static asset: ${asset}`);
      assert((await assetResponse.arrayBuffer()).byteLength > 0, `Empty asset: ${asset}`);
    }
  }
}
for (const [path, marker] of [["/feed.xml", "<rss"], ["/sitemap.xml", "<urlset"], ["/robots.txt", "User-Agent:"]]) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  assert((await response.text()).toLowerCase().includes(marker.toLowerCase()), path);
}
const image = await get("/opengraph-image");
assert.equal(image.status, 200, "Open Graph image");
assert(image.headers.get("content-type")?.startsWith("image/"), "Open Graph content type");
assert((await image.arrayBuffer()).byteLength > 0, "Empty Open Graph image");
console.log("Website smoke checks passed: pages, CSS, font, RSS, sitemap, robots and Open Graph image.");
