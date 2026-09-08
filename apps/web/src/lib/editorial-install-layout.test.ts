import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = resolve(process.cwd(), "src");

async function read(relativePath: string) {
  return readFile(resolve(srcRoot, relativePath), "utf8");
}

async function readOptional(relativePath: string) {
  try {
    return await read(relativePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return "";
    throw error;
  }
}

describe("editorial detail layout", () => {
  it("loads the detail-layout override after skill and pack editorial styles", async () => {
    const layout = await read("app/[locale]/layout.tsx");

    expect(layout).toContain('import "../editorial-detail-layout.css"');
    expect(layout.indexOf('import "../editorial-detail-layout.css"')).toBeGreaterThan(
      layout.indexOf('import "../editorial-method-dossier.css"'),
    );
    expect(layout.indexOf('import "../editorial-detail-layout.css"')).toBeGreaterThan(
      layout.indexOf('import "../editorial-pack-blueprint.css"'),
    );
  });

  it("gives detail pages a wider canvas and bounded desktop reader index", async () => {
    const css = await readOptional("app/editorial-detail-layout.css");

    expect(css).toMatch(/\.method-dossier,\s*\.pack-blueprint\s*\{[\s\S]*?max-width:\s*92rem;/);
    expect(css).toMatch(
      /\.method-reader,\s*\.pack-blueprint__reader\s*\{[\s\S]*?grid-template-columns:\s*minmax\(10rem,\s*13rem\)\s+minmax\(0,\s*1fr\);/,
    );
    expect(css).toMatch(
      /\.method-reader,\s*\.pack-blueprint__reader\s*\{[\s\S]*?gap:\s*clamp\(2rem,\s*4vw,\s*5rem\);/,
    );
  });

  it("preserves the one-column reader layout at tablet and mobile widths", async () => {
    const css = await readOptional("app/editorial-detail-layout.css");

    expect(css).toMatch(
      /@media\s*\(max-width:\s*64rem\)\s*\{[\s\S]*?\.method-reader,\s*\.pack-blueprint__reader\s*\{[\s\S]*?grid-template-columns:\s*1fr;/,
    );
  });
});
