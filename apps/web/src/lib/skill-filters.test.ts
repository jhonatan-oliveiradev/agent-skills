import { describe, expect, it } from "vitest";

const skills = [
  {
    slug: "motion-audit",
    category: "motion",
    packs: ["motion"],
    maturity: "stable",
    difficulty: "advanced",
    tags: ["animação", "performance"],
    displayName: "Auditoria de Animação",
    summary: "Encontra gargalos em experiências animadas.",
    primaryBenefit: "Movimento fluido em produção.",
  },
  {
    slug: "ui-system",
    category: "frontend",
    packs: ["frontend-product"],
    maturity: "stable",
    difficulty: "intermediate",
    tags: ["design-systems"],
    displayName: "Design de Sistemas de UI",
    summary: "Cria componentes reutilizáveis.",
    primaryBenefit: "Interfaces consistentes.",
  },
] as const;

describe("skill catalog filters", () => {
  it("searches localized content and tags without case or accent sensitivity", async () => {
    const filters = await import("./skill-filters").catch(() => null);
    expect(filters).not.toBeNull();
    if (!filters) return;

    expect(filters.filterSkills(skills, { query: "ANIMACAO" }).map((skill) => skill.slug)).toEqual([
      "motion-audit",
    ]);
    expect(filters.filterSkills(skills, { query: "gargalos" }).map((skill) => skill.slug)).toEqual([
      "motion-audit",
    ]);
  });

  it("combines category, pack, difficulty, and maturity with AND semantics", async () => {
    const filters = await import("./skill-filters").catch(() => null);
    expect(filters).not.toBeNull();
    if (!filters) return;

    expect(
      filters
        .filterSkills(skills, {
          category: "frontend",
          pack: "frontend-product",
          difficulty: "intermediate",
          maturity: "stable",
        })
        .map((skill) => skill.slug),
    ).toEqual(["ui-system"]);

    expect(
      filters.filterSkills(skills, { category: "frontend", difficulty: "advanced" }),
    ).toEqual([]);
  });
});
