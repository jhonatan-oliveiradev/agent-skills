import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { editorialMethodsCopy } from "./editorial-methods-copy";

const appRoot = resolve(process.cwd(), "src");

async function read(relativePath: string) {
  return readFile(resolve(appRoot, relativePath), "utf8");
}

function getRule(css: string, selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`Missing CSS rule: ${selector}`);
  return match[1];
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

  it("keeps native Method Archive select menus readable on themed surfaces", async () => {
    const css = await read("app/editorial-methods.css");
    const selectRule = getRule(css, ".method-archive__select select");
    const optionRule = getRule(css, ".method-archive__select option");

    expect(selectRule).toContain("background-color: var(--surface);");
    expect(selectRule).toContain("color: var(--text);");
    expect(optionRule).toContain("background-color: var(--surface);");
    expect(optionRule).toContain("color: var(--text);");
  });

  it("frames discovery around the task instead of catalog taxonomy", async () => {
    const page = await read("app/[locale]/skills/page.tsx");
    const en = editorialMethodsCopy.en;
    const pt = editorialMethodsCopy["pt-BR"];

    expect(en.archiveTitle).toBe("Find a method for the work in front of you.");
    expect(en.filterLabel).toBe("Find a method by task");
    expect(en.searchLabel).toBe("Describe the work");
    expect(en.searchPlaceholder).toContain("audit");
    expect(en.archiveSummary).toContain("Open a skill to inspect its trigger");

    expect(pt.archiveTitle).toBe("Encontre um método para o trabalho que você precisa resolver.");
    expect(pt.filterLabel).toBe("Encontre um método pela tarefa");
    expect(pt.searchLabel).toBe("Descreva o trabalho");
    expect(pt.searchPlaceholder).toContain("auditar");
    expect(pt.archiveSummary).toContain("Abra uma skill para inspecionar seu gatilho");

    expect(page).toContain("searchLabel: editorialCopy.searchLabel");
    expect(page).toContain("searchPlaceholder: editorialCopy.searchPlaceholder");
  });

  it("explains an empty archive result and gives a concrete recovery action", async () => {
    const page = await read("app/[locale]/skills/page.tsx");

    expect(editorialMethodsCopy.en.noResultsTitle).toBe("No method matches this selection.");
    expect(editorialMethodsCopy.en.noResultsSummary).toContain("Broaden the task");
    expect(editorialMethodsCopy.en.clearFilters).toBe("Show all methods");

    expect(editorialMethodsCopy["pt-BR"].noResultsTitle).toBe(
      "Nenhum método corresponde a esta seleção.",
    );
    expect(editorialMethodsCopy["pt-BR"].noResultsSummary).toContain("Amplie a descrição");
    expect(editorialMethodsCopy["pt-BR"].clearFilters).toBe("Ver todos os métodos");

    expect(page).toContain("noResultsTitle: editorialCopy.noResultsTitle");
    expect(page).toContain("noResultsSummary: editorialCopy.noResultsSummary");
    expect(page).toContain("clear: editorialCopy.clearFilters");
  });
});