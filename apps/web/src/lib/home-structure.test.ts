import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src");

async function readHome() {
  return readFile(resolve(appRoot, "app/[locale]/page.tsx"), "utf8");
}

describe("Home evidence-first composition", () => {
  it("orders proof before catalog-oriented sections and keeps roadmap last", async () => {
    const source = await readHome();
    const markers = [
      'data-home-section="proof"',
      'data-home-section="transformation"',
      'data-home-section="methods"',
      'data-home-section="packs"',
      'data-home-section="workflow"',
      'data-home-section="ledger"',
      'data-home-section="roadmap"',
    ];

    const positions = markers.map((marker) => source.indexOf(marker));
    positions.forEach((position) => expect(position).toBeGreaterThan(-1));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("removes the legacy path-card and three-card process formulas from the Home", async () => {
    const source = await readHome();

    expect(source).not.toContain("home-path-grid");
    expect(source).not.toContain("process-grid");
    expect(source).toContain("home-method-index");
    expect(source).toContain("home-evidence-ledger");
  });
});
