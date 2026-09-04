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

  it("keeps Home pack sequence choreography out of the global hardening layer", async () => {
    const source = await readCss("ui-hardening.css");

    expect(source).not.toContain(".home-pack-archive .home-pack-dossier:nth-child(10)");
    expect(source).not.toContain(".home-pack-archive .home-pack-dossier:nth-child(11)");
  });

  it("uses the design system tokens that actually exist for interaction feedback", async () => {
    const source = await readCss("ui-hardening.css");

    expect(source).not.toMatch(/var\(--(?:primary|secondary|input|foreground)\)/);
    expect(source).toContain("var(--brand)");
    expect(source).toContain("var(--surface)");
    expect(source).toContain("var(--control-border)");
    expect(source).toContain("var(--text)");
  });

  it("gives shared buttons explicit hover, focus-visible, active and disabled feedback", async () => {
    const source = await readCss("ui-hardening.css");

    expect(source).toMatch(/\.button\s*\{[\s\S]*transition:/);
    expect(source).toContain(".button:hover");
    expect(source).toContain(".button:focus-visible");
    expect(source).toContain(".button:active");
    expect(source).toContain(".button:disabled");
    expect(source).toMatch(/\.button:disabled[\s\S]*cursor:\s*not-allowed/);
  });

  it("gives every shared site-chrome control a visible keyboard focus state", async () => {
    const source = await readCss("ui-hardening.css");

    expect(source).toContain(".locale-switcher:focus-visible");
    expect(source).toContain(".site-theme-toggle:focus-visible");
    expect(source).toContain(".navigation-trigger:focus-visible");
    expect(source).toMatch(/focus-visible[\s\S]*outline:\s*2px solid var\(--focus\)/);
  });

  it("provides launch-critical localized loading, error, and not-found route states", async () => {
    const [loading, error, notFound] = await Promise.all([
      readSource("app/[locale]/loading.tsx"),
      readSource("app/[locale]/error.tsx"),
      readSource("app/[locale]/not-found.tsx"),
    ]);

    expect(loading).toContain('data-global-state="loading"');
    expect(loading).toContain("global-preloader__mark");
    expect(loading).toContain("agent-skills-monogram.svg");
    expect(error).toContain('data-global-state="error"');
    expect(error).toContain("reset");
    expect(notFound).toContain('data-global-state="not-found"');
    expect(notFound).toContain("/skills");
  });

  it("provides document-level recovery for unmatched routes and root-layout failures", async () => {
    const [config, globalNotFound, globalError] = await Promise.all([
      readFile(resolve(process.cwd(), "next.config.ts"), "utf8"),
      readSource("app/global-not-found.tsx"),
      readSource("app/global-error.tsx"),
    ]);

    expect(config).toMatch(/experimental:\s*\{[\s\S]*globalNotFound:\s*true/);
    expect(globalNotFound).toContain('data-global-state="not-found"');
    expect(globalNotFound).toContain("<html");
    expect(globalNotFound).toContain("<body");
    expect(globalNotFound).toContain("localeFromPathname");
    expect(globalError).toContain('data-global-state="error"');
    expect(globalError).toContain("reset");
    expect(globalError).toContain("<html");
    expect(globalError).toContain("<body");
  });

  it("styles recovery states as editorial reading surfaces instead of generic dashed cards", async () => {
    const source = await readCss("ui-hardening.css");

    expect(source).toMatch(/\.global-state\s*\{[\s\S]*min-height:/);
    expect(source).toMatch(/\.global-state__actions\s*\{[\s\S]*display:\s*flex/);
    expect(source).toMatch(/\.global-state__status\s*\{[\s\S]*font-family:\s*var\(--font-mono\)/);
    expect(source).toMatch(/\.global-preloader__mark\s*\{/);
    expect(source).toMatch(/@keyframes\s+global-preloader-scan/);
    expect(source).not.toMatch(/\.global-state\s*\{[\s\S]*border:\s*1px dashed/);
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