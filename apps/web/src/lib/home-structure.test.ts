import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src");

async function readHome() {
  return readFile(resolve(appRoot, "app/[locale]/page.tsx"), "utf8");
}

async function readCss(path: string) {
  return readFile(resolve(appRoot, "app", path), "utf8");
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

  it("places the operational walkthrough before the representative method and pack archives", async () => {
    const source = await readHome();

    const workflow = source.indexOf("<HomeMethodWorkflow");
    const methods = source.indexOf("<HomeMethodIndex");
    const packs = source.indexOf("<HomePackDossiers");
    const evidence = source.indexOf("<HomeEvidenceLedger");

    expect(workflow).toBeGreaterThan(-1);
    expect(methods).toBeGreaterThan(-1);
    expect(packs).toBeGreaterThan(-1);
    expect(evidence).toBeGreaterThan(-1);
    expect(workflow).toBeLessThan(methods);
    expect(methods).toBeLessThan(packs);
    expect(packs).toBeLessThan(evidence);
  });

  it("owns the deliberate placement of all 11 active packs in the Home composition layer", async () => {
    const [homeSystems, hardening] = await Promise.all([
      readCss("home-living-systems.css"),
      readCss("ui-hardening.css"),
    ]);

    for (let index = 1; index <= 11; index += 1) {
      expect(homeSystems).toMatch(
        new RegExp(`\\.home-pack-dossier:nth-child\\(${index}\\)[\\s\\S]*grid-column:`),
      );
    }

    expect(hardening).not.toContain(".home-pack-archive .home-pack-dossier:nth-child(10)");
    expect(hardening).not.toContain(".home-pack-archive .home-pack-dossier:nth-child(11)");
  });
});