import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { messages } from "./messages";

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

  it("uses the Dark Veil violet family as the product accent in both themes", async () => {
    const css = await read("app/globals.css");

    expect(css).toMatch(/:root\s*\{[\s\S]*?--editorial-accent:\s*#6d28d9;/);
    expect(css).toMatch(/:root\s*\{[\s\S]*?--editorial-focus:\s*#7c3aed;/);
    expect(css).toMatch(/\.dark\s*\{[\s\S]*?--editorial-accent:\s*#a78bfa;/);
    expect(css).toMatch(/\.dark\s*\{[\s\S]*?--editorial-focus:\s*#c4b5fd;/);
    expect(css).not.toMatch(/--editorial-accent:\s*#1745e8;/);
    expect(css).not.toMatch(/--editorial-accent:\s*#6f91ff;/);
    expect(css).not.toMatch(/--editorial-focus:\s*#8ea8ff;/);
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

  it("keeps editorial page styles and global chrome owned by the locale layout", async () => {
    const [layout, skillsIndex, skillDetail] = await Promise.all([
      read("app/[locale]/layout.tsx"),
      read("app/[locale]/skills/page.tsx"),
      read("app/[locale]/skills/[slug]/page.tsx"),
    ]);

    expect(layout).toContain('import "../editorial-pages.css"');
    expect(layout).toContain("<SiteHeader locale={locale} />");
    expect(layout).toContain("<SiteFooter locale={locale} />");

    for (const route of [skillsIndex, skillDetail]) {
      expect(route).not.toContain("SiteHeader");
      expect(route).not.toContain("SiteFooter");
    }
  });

  it("uses specific shared product actions in both locales", () => {
    expect(messages.en.brandLabel).toBe("Agent Skills Studio");
    expect(messages["pt-BR"].brandLabel).toBe("Agent Skills Studio");
    expect(messages.en.navigation.cta).toBe("Explore skills");
    expect(messages["pt-BR"].navigation.cta).toBe("Explorar skills");

    const genericActions = new Set([
      "Learn more",
      "Get started",
      "Continue",
      "Saiba mais",
      "Começar",
      "Continuar",
    ]);

    expect(genericActions.has(messages.en.navigation.cta)).toBe(false);
    expect(genericActions.has(messages["pt-BR"].navigation.cta)).toBe(false);
  });
});