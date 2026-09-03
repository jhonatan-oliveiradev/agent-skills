import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { editorialPacksCopy } from "./editorial-packs-copy";

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

  it("explains packs as installable groups of independently invokable skills", () => {
    expect(editorialPacksCopy.en.archiveTitle).toBe("Use a pack when one method is not enough.");
    expect(editorialPacksCopy.en.archiveSummary).toContain("invoke each method independently");
    expect(editorialPacksCopy.en.systemLabel).toBe("PACK");
    expect(editorialPacksCopy.en.explore).toBe("Inspect pack");

    expect(editorialPacksCopy["pt-BR"].archiveTitle).toBe(
      "Use um pack quando um único método não for suficiente.",
    );
    expect(editorialPacksCopy["pt-BR"].archiveSummary).toContain(
      "invoque cada método de forma independente",
    );
    expect(editorialPacksCopy["pt-BR"].systemLabel).toBe("PACK");
    expect(editorialPacksCopy["pt-BR"].explore).toBe("Inspecionar pack");
  });
});