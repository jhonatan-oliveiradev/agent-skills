import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

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
});
