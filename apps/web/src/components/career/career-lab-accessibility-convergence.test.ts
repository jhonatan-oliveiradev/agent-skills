import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = resolve(process.cwd(), "src");

async function read(relativePath: string) {
  return readFile(resolve(srcRoot, relativePath), "utf8");
}

describe("Career Lab accessibility convergence", () => {
  it("defines one visible focus contract for interactive Career Lab controls", async () => {
    const css = await read("styles/career-convergence.css");
    expect(css).toMatch(/\.career-lab-shell[\s\S]*:focus-visible/);
    expect(css).toMatch(/outline:\s*2px solid var\(--career-copper\)/);
  });

  it("reduces non-essential motion across the complete Career Lab workspace", async () => {
    const css = await read("styles/career-convergence.css");
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(css).toMatch(/animation-duration:\s*0\.01ms/);
    expect(css).toMatch(/transition-duration:\s*0\.01ms/);
  });

  it("keeps the shared Career Lab shell responsive without hiding route navigation", async () => {
    const css = await read("styles/career-convergence.css");
    expect(css).toMatch(/@media\s*\(max-width:\s*760px\)/);
    expect(css).toMatch(/career-lab-rail__pack-link/);
  });

  it("keeps file imports explicitly labeled and errors announced", async () => {
    const market = await read("components/career/market-ingestion.tsx");
    const dataControls = await read("components/career/career-data-controls.tsx");

    expect(market).toContain('type="file"');
    expect(market).toContain("aria-label={localized.importLabel}");
    expect(market).toContain('role={status === "error" ? "alert" : "status"}');
    expect(dataControls).toContain('htmlFor="career-profile-import"');
    expect(dataControls).toContain('id="career-profile-import"');
    expect(dataControls).toContain('role={messageKind === "error" ? "alert" : "status"}');
  });
});
