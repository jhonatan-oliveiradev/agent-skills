import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src");

async function read(relativePath: string) {
  return readFile(resolve(appRoot, relativePath), "utf8");
}

describe("editorial packs system", () => {
  it("turns Packs into a curated systems archive without forking global chrome", async () => {
    const [layout, page] = await Promise.all([
      read("app/[locale]/layout.tsx"),
      read("app/[locale]/packs/page.tsx"),
    ]);

    expect(layout).toContain('import "../editorial-packs.css"');
    expect(page).toContain("PackArchive");
    expect(page).toContain("EditorialPageHero");
    expect(page).toContain("editorialPacksCopy");
    expect(page).not.toContain("PackCard");
    expect(page).not.toContain("SiteHeader");
    expect(page).not.toContain("SiteFooter");
  });
});
