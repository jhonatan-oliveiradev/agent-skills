import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src");
const catalogPath = resolve(appRoot, "../../..", "catalog/generated/catalog.json");

async function readHome() {
  return readFile(resolve(appRoot, "app/[locale]/(studio)/page.tsx"), "utf8");
}

async function readCss(path: string) {
  return readFile(resolve(appRoot, "app", path), "utf8");
}

async function getActivePackCount() {
  const source = await readFile(catalogPath, "utf8");
  const catalog = JSON.parse(source) as { packs: Array<{ status: string }> };
  return catalog.packs.filter((pack) => pack.status === "active").length;
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

  it("owns deliberate desktop placement and responsive reset for every active pack", async () => {
    const [homeSystems, hardening, activePackCount] = await Promise.all([
      readCss("home-living-systems.css"),
      readCss("ui-hardening.css"),
      getActivePackCount(),
    ]);

    expect(activePackCount).toBeGreaterThan(0);

    for (let index = 1; index <= activePackCount; index += 1) {
      const selector = `\\.home-pack-dossier:nth-child\\(${index}\\)`;
      const placements = homeSystems.match(new RegExp(selector, "g")) ?? [];

      expect(homeSystems).toMatch(new RegExp(`${selector}[\\s\\S]*grid-column:`));
      expect(placements.length).toBeGreaterThanOrEqual(2);
    }

    expect(hardening).not.toContain(".home-pack-archive .home-pack-dossier:nth-child(10)");
    expect(hardening).not.toContain(".home-pack-archive .home-pack-dossier:nth-child(11)");
    expect(hardening).not.toContain(".home-pack-archive .home-pack-dossier:nth-child(12)");
  });
});