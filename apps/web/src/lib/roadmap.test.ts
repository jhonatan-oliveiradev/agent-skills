import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { livingProgramCopy } from "./editorial-secondary-copy";
import { messages } from "./messages";
import { getRoadmapStages } from "./roadmap";

describe("public roadmap", () => {
  it.each(["en", "pt-BR"] as const)("uses the Stable surface message contract for %s", (locale) => {
    const copy = messages[locale].roadmap as Record<string, unknown>;

    expect(copy).toHaveProperty("stableSurfaceItems");
    expect(copy).not.toHaveProperty("betaItems");
  });

  it.each(["en", "pt-BR"] as const)("derives honest roadmap stages for %s", (locale) => {
    const stages = getRoadmapStages(locale);

    expect(stages.map((stage) => stage.id)).toEqual([
      "proposal",
      "research",
      "development",
      "experimental",
      "beta",
      "stable",
      "deprecated",
    ]);
    expect(stages.map((stage) => stage.items.length)).toEqual([0, 0, 0, 0, 0, 5, 0]);

    const beta = stages.find((stage) => stage.id === "beta");
    const stable = stages.find((stage) => stage.id === "stable");
    const stableSkills = stable?.items[4];

    expect(beta?.items).toEqual([]);
    expect(stable?.items.map((item) => item.id)).toEqual([
      "plugin",
      "catalog",
      "installers",
      "microsite",
      "stable-skills",
    ]);
    expect(stable?.items.slice(0, 4).every((item) => item.meta === "1.0.0")).toBe(true);
    expect(stableSkills?.meta).toContain("18");
    expect(stableSkills?.meta).toContain("9/11");
    expect(stableSkills?.summary).toContain("18");
    expect(stableSkills?.summary).toContain("9");
    expect(stableSkills?.summary).toContain("11");
    expect(stableSkills?.summary).not.toMatch(/every canonical skill|todas as skills canônicas/i);
  });

  it.each([
    ["en", "post-Stable", "skill maturity"],
    ["pt-BR", "pós-Stable", "maturidade das skills"],
  ] as const)(
    "keeps Stable 1.0.0 distinct from later work and skill maturity for %s",
    (locale, postStableTerm, maturityTerm) => {
      const program = livingProgramCopy[locale];

      expect(program.summary).toContain("Stable 1.0.0");
      expect(program.summary).toContain(postStableTerm);
      expect(program.principle).toContain(maturityTerm);
      expect(program.principle).toMatch(/release/i);
    },
  );
});
