import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src", "app");

async function read(relativePath: string) {
  return readFile(resolve(appRoot, relativePath), "utf8");
}

describe("editorial detail layout", () => {
  it("gives skill dossiers a wider desktop canvas with a bounded reader index", async () => {
    const css = await read("editorial-method-dossier.css");

    expect(css).toMatch(/\.method-dossier\s*\{[\s\S]*?max-width:\s*92rem;/);
    expect(css).toMatch(
      /\.method-reader\s*\{[\s\S]*?grid-template-columns:\s*minmax\(10rem,\s*13rem\)\s+minmax\(0,\s*1fr\);/,
    );
    expect(css).toMatch(/\.method-reader\s*\{[\s\S]*?gap:\s*clamp\(2rem,\s*4vw,\s*5rem\);/);
  });

  it("gives pack blueprints the same wider editorial canvas and bounded reader index", async () => {
    const css = await read("editorial-pack-blueprint.css");

    expect(css).toMatch(/\.pack-blueprint\s*\{[\s\S]*?max-width:\s*92rem;/);
    expect(css).toMatch(
      /\.pack-blueprint__reader\s*\{[\s\S]*?grid-template-columns:\s*minmax\(10rem,\s*13rem\)\s+minmax\(0,\s*1fr\);/,
    );
    expect(css).toMatch(
      /\.pack-blueprint__reader\s*\{[\s\S]*?gap:\s*clamp\(2rem,\s*4vw,\s*5rem\);/,
    );
  });
});
