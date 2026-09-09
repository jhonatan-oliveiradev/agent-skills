import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = resolve(process.cwd(), "src");

async function read(relativePath: string) {
  return readFile(resolve(srcRoot, relativePath), "utf8");
}

async function exists(relativePath: string) {
  try {
    await access(resolve(srcRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

describe("Career Lab shell separation", () => {
  it("keeps the locale layout infrastructure-only and delegates Studio chrome", async () => {
    const [localeLayout, studioLayout] = await Promise.all([
      read("app/[locale]/layout.tsx"),
      read("app/[locale]/(studio)/layout.tsx"),
    ]);

    expect(localeLayout).toContain("<ThemeProvider");
    expect(localeLayout).toContain("<NuqsAdapter>");
    expect(localeLayout).toContain('href="#main-content"');
    expect(localeLayout).not.toContain("SiteHeader");
    expect(localeLayout).not.toContain("SiteFooter");
    expect(localeLayout).not.toContain('<main id="main-content"');

    expect(studioLayout).toContain("<SiteHeader locale={locale} />");
    expect(studioLayout).toContain('<main id="main-content">{children}</main>');
    expect(studioLayout).toContain("<SiteFooter locale={locale} />");
  });

  it("uses URL-transparent route groups for Studio and Career Lab ownership", async () => {
    await expect(exists("app/[locale]/(studio)/page.tsx")).resolves.toBe(true);
    await expect(exists("app/[locale]/(studio)/skills/page.tsx")).resolves.toBe(true);
    await expect(exists("app/[locale]/(studio)/packs/page.tsx")).resolves.toBe(true);
    await expect(exists("app/[locale]/(career)/career-lab/layout.tsx")).resolves.toBe(true);
    await expect(exists("app/[locale]/(career)/career-lab/page.tsx")).resolves.toBe(true);

    await expect(exists("app/[locale]/page.tsx")).resolves.toBe(false);
    await expect(exists("app/[locale]/skills/page.tsx")).resolves.toBe(false);
    await expect(exists("app/[locale]/career-lab/layout.tsx")).resolves.toBe(false);
  });

  it("does not let the Career Lab route tree import institutional chrome", async () => {
    const careerLayout = await read("app/[locale]/(career)/career-lab/layout.tsx");

    expect(careerLayout).toContain("CareerLabShell");
    expect(careerLayout).not.toContain("SiteHeader");
    expect(careerLayout).not.toContain("SiteFooter");
  });
});
