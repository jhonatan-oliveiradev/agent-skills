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
    expect(stages.map((stage) => stage.items.length)).toEqual([1, 0, 0, 0, 4, 1, 0]);
    expect(stages.find((stage) => stage.id === "stable")?.items[0]?.meta).toContain("18");
    expect(stages.find((stage) => stage.id === "beta")?.items[0]?.meta).toBe(
      "1.0.0-beta.1",
    );
  });
});
