import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src");

async function read(relativePath: string) {
  return readFile(resolve(appRoot, relativePath), "utf8");
}

describe("editorial methods system", () => {
  it("turns the Skills index into the Method Archive without forking global chrome", async () => {
    const [layout, page] = await Promise.all([
      read("app/[locale]/layout.tsx"),
      read("app/[locale]/skills/page.tsx"),
    ]);

    expect(layout).toContain('import "../editorial-methods.css"');
    expect(page).toContain("MethodArchive");
    expect(page).toContain("EditorialPageHero");
    expect(page).toContain("editorialMethodsCopy");
    expect(page).not.toContain("SkillsCatalog");
    expect(page).not.toContain("SiteHeader");
    expect(page).not.toContain("SiteFooter");
  });
});
