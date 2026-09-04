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

  it("gives a concrete skill-versus-pack decision rule and archive recovery action", async () => {
    const en = editorialPacksCopy.en as Readonly<Record<string, string>>;
    const pt = editorialPacksCopy["pt-BR"] as Readonly<Record<string, string>>;
    const [page, notFound] = await Promise.all([
      read("app/[locale]/packs/page.tsx"),
      read("app/[locale]/packs/[slug]/not-found.tsx"),
    ]);

    expect(en.selectionTitle).toBe("Skill or pack?");
    expect(en.selectionSummary).toContain("one bounded method");
    expect(en.selectionSummary).toContain("several related methods");
    expect(pt.selectionTitle).toBe("Skill ou pack?");
    expect(pt.selectionSummary).toContain("um método bem delimitado");
    expect(pt.selectionSummary).toContain("vários métodos relacionados");

    expect(page).toContain("selectionTitle={copy.selectionTitle}");
    expect(page).toContain("selectionSummary={copy.selectionSummary}");
    expect(notFound).toContain("editorialPacksCopy");
    expect(notFound).toContain("notFoundAction");
  });

  it("keeps long pack titles inside the identity column and gives hover surfaces lateral breathing room", async () => {
    const css = await read("app/editorial-packs.css");

    expect(css).toMatch(/\.pack-dossier\s*\{[\s\S]*padding-inline:\s*clamp\(/);
    expect(css).toMatch(/\.pack-dossier__identity\s*\{[\s\S]*padding-right:\s*clamp\(/);
    expect(css).toMatch(/\.pack-dossier__identity h2\s*\{[\s\S]*max-width:\s*100%/);
    expect(css).toMatch(/\.pack-dossier__identity h2\s*\{[\s\S]*font-size:\s*clamp\(2\.8rem,\s*5vw,\s*5\.6rem\)/);
    expect(css).toMatch(/\.pack-dossier__composition\s*\{[\s\S]*min-width:\s*0/);
  });
});