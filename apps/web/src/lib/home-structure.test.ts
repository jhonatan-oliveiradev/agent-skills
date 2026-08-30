import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src");

async function readHome() {
  return readFile(resolve(appRoot, "app/[locale]/page.tsx"), "utf8");
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
});
