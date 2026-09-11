import { describe, expect, it } from "vitest";
import { learningNoteCatalog } from "./learning-catalog";
import { learningSourceCatalog } from "./learning-source-catalog";
import { validateLearningCatalog } from "./learning-validation";

describe("production Career learning catalog", () => {
  it("publishes six validated reviewed Core Notes with 24 criterion modules", () => {
    expect(validateLearningCatalog(learningNoteCatalog, learningSourceCatalog)).toEqual(
      learningNoteCatalog,
    );
    expect(learningNoteCatalog).toHaveLength(6);

    const modules = learningNoteCatalog.flatMap((note) => note.modules);
    expect(modules).toHaveLength(24);
    expect(modules.every((learningModule) => learningModule.reviewStatus === "reviewed")).toBe(
      true,
    );
    expect(
      modules.every(
        (learningModule) =>
          learningModule.consolidationCriteria.en.length >= 2 &&
          learningModule.consolidationCriteria["pt-BR"].length >= 2,
      ),
    ).toBe(true);
  });

  it("keeps every migrated module pedagogically distinct in both locales", () => {
    const modules = learningNoteCatalog.flatMap((note) => note.modules);
    expect(new Set(modules.map((learningModule) => learningModule.understand.en)).size).toBe(24);
    expect(
      new Set(modules.map((learningModule) => learningModule.understand["pt-BR"])).size,
    ).toBe(24);
    expect(new Set(modules.map((learningModule) => learningModule.practice.prompt.en)).size).toBe(
      24,
    );
    expect(
      new Set(modules.map((learningModule) => learningModule.practice.prompt["pt-BR"])).size,
    ).toBe(24);
  });
});
