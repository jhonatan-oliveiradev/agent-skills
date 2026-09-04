import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src");

async function readCss(path: string) {
  return readFile(resolve(appRoot, "app", path), "utf8");
}

async function readSource(path: string) {
  return readFile(resolve(appRoot, path), "utf8");
}

describe("sitewide UI hardening", () => {
  it("loads the hardening layer after the editorial styles", async () => {
    const layout = await readSource("app/[locale]/layout.tsx");
    const finalPolish = layout.indexOf('import "../site-chrome-refinement.css"');
    const hardening = layout.indexOf('import "../ui-hardening.css"');

    expect(finalPolish).toBeGreaterThan(-1);
    expect(hardening).toBeGreaterThan(finalPolish);
  });

  it("reflows narrow pack dossiers with selectors strong enough to win the existing cascade", async () => {
    const source = await readCss("ui-hardening.css");

    expect(source).toMatch(/\.home-pack-dossier\s*\{[\s\S]*container-type:\s*inline-size/);
    expect(source).toMatch(
      /@container\s*\(max-width:\s*46rem\)[\s\S]*\.home-pack-archive \.home-pack-dossier__body\s*\{[\s\S]*grid-template-columns:\s*1fr/,
    );
    expect(source).toMatch(
      /@container\s*\(max-width:\s*46rem\)[\s\S]*\.home-pack-archive \.home-pack-dossier h3[\s\S]*max-width:\s*100%/,
    );
    expect(source).toMatch(/\.home-pack-dossier__body > \*[\s\S]*min-width:\s*0/);
  });

  it("defines deliberate placement for every one of the 11 active packs", async () => {
    const source = await readCss("ui-hardening.css");
    const catalog = JSON.parse(await readSource("generated/catalog.json")) as {
      filters: { packs: string[] };
    };

    expect(catalog.filters.packs).toHaveLength(11);
    expect(source).toMatch(
      /\.home-pack-dossier:nth-child\(10\)[\s\S]*grid-column:/,
    );
    expect(source).toMatch(
      /\.home-pack-dossier:nth-child\(11\)[\s\S]*grid-column:/,
    );
  });

  it("uses the design system tokens that actually exist for interaction feedback", async () => {
    const source = await readCss("ui-hardening.css");

    expect(source).not.toMatch(/var\(--(?:primary|secondary|input|foreground)\)/);
    expect(source).toContain("var(--brand)");
    expect(source).toContain("var(--surface)");
    expect(source).toContain("var(--control-border)");
    expect(source).toContain("var(--text)");
  });

  it("gives shared buttons explicit hover, focus-visible and active feedback", async () => {
    const source = await readCss("ui-hardening.css");

    expect(source).toMatch(/\.button\s*\{[\s\S]*transition:/);
    expect(source).toContain(".button:hover");
    expect(source).toContain(".button:focus-visible");
    expect(source).toContain(".button:active");
  });

  it("keeps stacked action groups equal width", async () => {
    const source = await readCss("ui-hardening.css");
    const hero = await readSource("components/home/home-manifesto-hero.tsx");

    expect(source).toMatch(/\.home-roadmap__inner \.hero-actions\s*\{[\s\S]*align-items:\s*stretch/);
    expect(source).toMatch(/\.home-roadmap__inner \.hero-actions \.button\s*\{[\s\S]*width:\s*100%/);
    expect(source).toMatch(/@media \(max-width: 36rem\)[\s\S]*\.home-manifesto-actions\s*\{[\s\S]*align-items:\s*stretch/);
    expect(source).toMatch(/\.home-manifesto-actions \.button\s*\{[\s\S]*width:\s*100%/);
    expect(hero).toContain("home-manifesto-actions flex flex-wrap gap-3");
  });

  it("keeps evidence actions readable and visibly interactive", async () => {
    const source = await readCss("ui-hardening.css");

    expect(source).toMatch(/\.home-evidence-ledger th:last-child,[\s\S]*\.home-evidence-ledger td:last-child\s*\{[\s\S]*width:\s*12rem/);
    expect(source).toMatch(/\.home-evidence-ledger a\s*\{[\s\S]*transition:/);
    expect(source).toContain(".home-evidence-ledger a:hover");
    expect(source).toContain(".home-evidence-ledger a:focus-visible");
  });

  it("disables decorative movement for reduced-motion users", async () => {
    const source = await readCss("ui-hardening.css");

    expect(source).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*transition:\s*none/);
    expect(source).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*transform:\s*none/);
  });
});