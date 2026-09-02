import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { getRoadmapStages } from "./roadmap";

describe("public roadmap", () => {
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

    expect(beta?.items).toEqual([]);
    expect(stable?.items.map((item) => item.id)).toEqual([
      "plugin",
      "catalog",
      "installers",
      "microsite",
      "stable-skills",
    ]);
    expect(stable?.items.slice(0, 4).every((item) => item.meta === "1.0.0")).toBe(true);
    expect(stable?.items[4]?.meta).toContain("18");
  });
});