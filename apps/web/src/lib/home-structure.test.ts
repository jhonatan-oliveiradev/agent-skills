import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = resolve(process.cwd(), "src");
const catalogPath = resolve(appRoot, "../../..", "catalog/generated/catalog.json");

async function readHome() {
  return readFile(resolve(appRoot, "app/[locale]/(studio)/page.tsx"), "utf8");
}

describe("Product home composition", () => {
  it("moves from promise to method, evidence, skills, packs and installation", async () => {
    const source = await readHome();
    const sections = ["product-hero", "product-demo", "product-thesis", "product-work", "product-skills", "product-packs", "product-close"];
    const locations = sections.map((section) => source.indexOf(`className="${section}"`));
    expect(locations.every((index) => index >= 0)).toBe(true);
    expect(locations).toEqual([...locations].sort((a, b) => a - b));
    expect(source).toContain('href={href("/getting-started")}');
  });

  it("uses real skill and active pack slugs from the catalog", async () => {
    const source = await readHome();
    const catalog = JSON.parse(await readFile(catalogPath, "utf8")) as {
      skills: { slug: string }[];
      packs: { slug: string; status: string }[];
    };
    for (const slug of ["designing-ui-systems", "building-premium-nextjs-interfaces", "craft-premium-motion"]) {
      expect(source).toContain(slug);
      expect(catalog.skills.some((item) => item.slug === slug)).toBe(true);
    }
    for (const slug of ["frontend-product", "motion", "application-security"]) {
      expect(source).toContain(slug);
      expect(catalog.packs.some((item) => item.slug === slug && item.status === "active")).toBe(true);
    }
  });

  it("uses a non-pinned card grid and a mobile reset", async () => {
    const css = await readFile(resolve(appRoot, "app/studio-premium.css"), "utf8");
    expect(css).toContain(".product-work__grid");
    expect(css).toContain(".product-packs__grid");
    expect(css).toContain("@media(max-width:700px)");
    expect(css).not.toContain("position:sticky");
  });
});
