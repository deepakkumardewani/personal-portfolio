import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/** Project root when tests are run via `vp test` / `bun run test` from the package directory. */
const root = process.cwd();

function readIndexHtml(): string {
  return readFileSync(join(root, "index.html"), "utf-8");
}

function readOgImagePng(): Buffer {
  return readFileSync(join(root, "public", "og-image.png"));
}

describe("index.html metadata and assets (Phase 7)", () => {
  it("has title, description, canonical, favicon, and OG / Twitter tags", () => {
    const html = readIndexHtml();
    expect(html).toContain("<title>Deepak Kumar Dewani — Senior Frontend Engineer</title>");
    expect(html).toMatch(/name="description"/);
    expect(html).toContain('<link rel="canonical" href="https://deepakd.me/"');
    expect(html).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg"');
    expect(html).toMatch(/property="og:title"/);
    expect(html).toMatch(/property="og:description"/);
    expect(html).toContain('<meta property="og:image"');
    expect(html).toContain('<meta property="og:url"');
    expect(html).toContain('<meta name="twitter:card"');
    expect(html).toContain('<meta name="twitter:title"');
    expect(html).toContain('<meta name="twitter:image"');
  });

  it("has a 1200×630 og-image.png", () => {
    const buf = readOgImagePng();
    const sig = buf.subarray(0, 8);
    expect(Array.from(sig)).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    expect(w).toBe(1200);
    expect(h).toBe(630);
  });
});
