import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src");

async function read(relativePath: string) {
  return readFile(resolve(appRoot, relativePath), "utf8");
}

describe("editorial design foundation", () => {
  it("exposes the semantic Tailwind v4 theme in both color schemes", async () => {
    const css = await read("app/globals.css");

    expect(css).toContain("@theme inline");
    expect(css).toContain("--font-display");
    expect(css).toContain("--font-mono");
    expect(css).toContain("--color-canvas");
    expect(css).toContain("--color-surface");
    expect(css).toContain("--color-foreground");
    expect(css).toContain("--color-muted");
    expect(css).toContain("--color-accent");
    expect(css).toContain("--color-line");
    expect(css).toContain("--ease-editorial");
    expect(css).toMatch(/:root\s*\{[\s\S]*?--editorial-canvas:/);
    expect(css).toMatch(/\.dark\s*\{[\s\S]*?--editorial-canvas:/);
  });

  it("preserves legacy aliases while the internal pages migrate", async () => {
    const css = await read("app/globals.css");

    expect(css).toContain("--canvas: var(--editorial-canvas)");
    expect(css).toContain("--surface: var(--editorial-surface)");
    expect(css).toContain("--text: var(--editorial-foreground)");
    expect(css).toContain("--text-muted: var(--editorial-muted)");
    expect(css).toContain("--border: var(--editorial-line)");
    expect(css).toContain("--brand: var(--editorial-accent)");
  });

  it("styles native scrollbars for Firefox and WebKit", async () => {
    const css = await read("app/globals.css");

    expect(css).toContain("scrollbar-color:");
    expect(css).toContain("::-webkit-scrollbar-thumb");
    expect(css).toContain("::-webkit-scrollbar-track");
  });

  it("loads the licensed local fonts and applies stable body utilities", async () => {
    const [css, layout, instrumentLicense, plexLicense] = await Promise.all([
      read("app/globals.css"),
      read("app/[locale]/layout.tsx"),
      read("app/fonts/OFL-Instrument-Sans.txt"),
      read("app/fonts/OFL-IBM-Plex-Mono.txt"),
    ]);

    expect(css).toContain('url("./fonts/instrument-sans-latin.woff2")');
    expect(css).toContain('url("./fonts/ibm-plex-mono-latin.woff2")');
    expect(css).toContain("font-display: swap");
    expect(layout).toContain(
      'className="bg-canvas font-display text-foreground antialiased"',
    );
    expect(instrumentLicense).toContain("SIL OPEN FONT LICENSE");
    expect(plexLicense).toContain("SIL OPEN FONT LICENSE");
  });
});
