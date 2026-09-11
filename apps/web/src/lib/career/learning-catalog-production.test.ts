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

  it("uses the planned source anchors and institutional Testing Library classification", () => {
    expect(learningSourceCatalog.map(({ id, url }) => ({ id, url }))).toEqual([
      {
        id: "mdn-async-function",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
      },
      {
        id: "mdn-promise",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
      },
      {
        id: "ts-handbook-narrowing",
        url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      },
      {
        id: "ts-handbook-type-manipulation",
        url: "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
      },
      {
        id: "testing-library-guiding-principles",
        url: "https://testing-library.com/docs/guiding-principles/",
      },
      {
        id: "rfc-9110-http-semantics",
        url: "https://www.rfc-editor.org/rfc/rfc9110.html",
      },
      {
        id: "git-commit-docs",
        url: "https://git-scm.com/docs/git-commit",
      },
      {
        id: "pro-git-distributed-workflows",
        url: "https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows",
      },
      {
        id: "wcag-22",
        url: "https://www.w3.org/TR/WCAG22/",
      },
      {
        id: "wai-aria-apg",
        url: "https://www.w3.org/WAI/ARIA/apg/",
      },
    ]);

    expect(
      learningSourceCatalog.find((source) => source.id === "testing-library-guiding-principles")
        ?.authority,
    ).toBe("recognized-institutional");
  });
});
