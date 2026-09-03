import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src");

async function readCss(path: string) {
  return readFile(resolve(appRoot, "app", path), "utf8");
}

describe("sitewide UI hardening", () => {
  it("reflows narrow pack dossiers by container width before text can overlap", async () => {
    const source = await readCss("home-living-systems.css");

    expect(source).toMatch(/\.home-pack-dossier\s*\{[\s\S]*container-type:\s*inline-size/);
    expect(source).toMatch(/@container\s*\(max-width:\s*46rem\)[\s\S]*\.home-pack-dossier__body\s*\{[\s\S]*grid-template-columns:\s*1fr/);
    expect(source).toMatch(/@container\s*\(max-width:\s*46rem\)[\s\S]*\.home-pack-dossier h3\s*\{[\s\S]*max-width:\s*100%/);
  });

  it("gives shared buttons explicit hover, focus-visible and active feedback", async () => {
    const source = await readCss("globals.css");

    expect(source).toMatch(/\.button\s*\{[\s\S]*transition:/);
    expect(source).toContain(".button:hover");
    expect(source).toContain(".button:focus-visible");
    expect(source).toContain(".button:active");
  });

  it("keeps stacked closing actions equal width", async () => {
    const source = await readCss("globals.css");

    expect(source).toMatch(/\.home-roadmap__inner \.hero-actions\s*\{[\s\S]*align-items:\s*stretch/);
    expect(source).toMatch(/\.home-roadmap__inner \.hero-actions \.button\s*\{[\s\S]*width:\s*100%/);
  });

  it("keeps evidence actions readable and visibly interactive", async () => {
    const source = await readCss("home-evidence.css");

    expect(source).toMatch(/\.home-evidence-ledger th:last-child,[\s\S]*\.home-evidence-ledger td:last-child\s*\{[\s\S]*(width|min-width):\s*12rem/);
    expect(source).toMatch(/\.home-evidence-ledger a\s*\{[\s\S]*transition:/);
    expect(source).toContain(".home-evidence-ledger a:hover");
    expect(source).toContain(".home-evidence-ledger a:focus-visible");
  });
});
