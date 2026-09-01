import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src");

async function readHome() {
  return readFile(resolve(appRoot, "app/[locale]/page.tsx"), "utf8");
}

async function readHomeLivingSystems() {
  return readFile(resolve(appRoot, "app/home-living-systems.css"), "utf8");
}

describe("Home Living Research Archive composition", () => {
  it("orders the three editorial acts and removes the standalone transformation section", async () => {
    const source = await readHome();

    const manifestoCase = source.indexOf('data-home-act="manifesto-case"');
    const methodsSystems = source.indexOf('data-home-act="methods-systems"');
    const proofOpenSystem = source.indexOf('data-home-act="proof-open-system"');

    expect(manifestoCase).toBeGreaterThan(-1);
    expect(methodsSystems).toBeGreaterThan(-1);
    expect(proofOpenSystem).toBeGreaterThan(-1);
    expect(manifestoCase).toBeLessThan(methodsSystems);
    expect(methodsSystems).toBeLessThan(proofOpenSystem);
    expect(source).not.toContain('data-home-section="transformation"');
  });

  it("keeps the method index and evidence ledger while rejecting legacy card formulas", async () => {
    const source = await readHome();

    expect(source).not.toContain("home-path-grid");
    expect(source).not.toContain("process-grid");
    expect(source).toContain("home-method-index");
    expect(source).toContain("home-evidence-ledger");
  });

  it("gives all five active pack dossiers an intentional desktop composition", async () => {
    const source = await readHomeLivingSystems();

    expect(source).toContain(".home-pack-dossier:nth-child(4)");
    expect(source).toContain(".home-pack-dossier:nth-child(5)");
    expect(source).toMatch(/nth-child\(4\)[\s\S]*grid-column:/);
    expect(source).toMatch(/nth-child\(5\)[\s\S]*grid-column:/);
  });
});
