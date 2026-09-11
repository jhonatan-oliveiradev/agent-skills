import { describe, expect, it } from "vitest";
import { competencyDefinitions } from "./competencies";
import { validateLearningCatalog } from "./learning-validation";
import type { LearningNote, LearningSource } from "./learning-types";

const source: LearningSource = {
  id: "ts-handbook-narrowing",
  title: "Narrowing",
  publisher: "TypeScript",
  url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
  authority: "primary",
  volatility: "medium",
  reviewedAt: "2026-09-11T00:00:00.000Z",
  supportsCriterionIds: ["programming-typescript.developing"],
};

const note: LearningNote = {
  id: "typescript-application-modeling",
  competencyId: "programming-typescript",
  title: {
    en: "TypeScript application modeling",
    "pt-BR": "Modelagem de aplicações com TypeScript",
  },
  summary: {
    en: "Model valid application states.",
    "pt-BR": "Modele estados válidos da aplicação.",
  },
  objective: {
    en: "Make invalid states hard to represent.",
    "pt-BR": "Torne estados inválidos difíceis de representar.",
  },
  estimatedMinutes: 20,
  modules: [
    {
      id: "programming-typescript-developing",
      criterionId: "programming-typescript.developing",
      level: "developing",
      title: { en: "Impossible states", "pt-BR": "Estados impossíveis" },
      estimatedMinutes: 8,
      contentVersion: "1",
      reviewStatus: "reviewed",
      reviewedAt: "2026-09-11T00:00:00.000Z",
      primarySourcePolicy: "required",
      understand: {
        en: "Use explicit variants.",
        "pt-BR": "Use variantes explícitas.",
      },
      commonMistake: {
        en: "Optional-everything state.",
        "pt-BR": "Estado com tudo opcional.",
      },
      practice: {
        id: "programming-typescript-developing-practice",
        prompt: {
          en: "Refactor a loose state shape.",
          "pt-BR": "Refatore um estado frouxo.",
        },
      },
      consolidationCriteria: {
        en: ["Explains why impossible states disappear."],
        "pt-BR": ["Explica por que estados impossíveis desaparecem."],
      },
      sourceIds: ["ts-handbook-narrowing"],
    },
  ],
};

describe("learning catalog governance", () => {
  it("accepts reviewed bilingual criterion-mapped content backed by a primary source", () => {
    expect(validateLearningCatalog([note], [source])).toEqual([note]);
  });

  it("rejects a reviewed module whose criterion belongs to another competency", () => {
    const invalid = {
      ...note,
      modules: [
        {
          ...note.modules[0],
          criterionId: "programming-javascript.developing",
        },
      ],
    };

    expect(() => validateLearningCatalog([invalid], [source])).toThrow(/criterion.*competency/i);
  });

  it("rejects required-primary modules without a primary source", () => {
    const pedagogical: LearningSource = {
      ...source,
      authority: "recognized-pedagogical",
    };

    expect(() => validateLearningCatalog([note], [pedagogical])).toThrow(/primary/i);
  });

  it("requires a reason when primarySourcePolicy is not-available", () => {
    const invalid = {
      ...note,
      modules: [
        {
          ...note.modules[0],
          primarySourcePolicy: "not-available" as const,
        },
      ],
    };

    expect(() => validateLearningCatalog([invalid], [source])).toThrow(/reason/i);
  });

  it("rejects duplicate note, module, practice, and source ids", () => {
    expect(() => validateLearningCatalog([note, note], [source])).toThrow(/duplicate note/i);
    expect(() => validateLearningCatalog([note], [source, source])).toThrow(/duplicate source/i);

    const duplicateModuleNote: LearningNote = {
      ...note,
      modules: [note.modules[0], note.modules[0]],
    };
    expect(() => validateLearningCatalog([duplicateModuleNote], [source])).toThrow(/duplicate module/i);

    const secondModule = {
      ...note.modules[0],
      id: "programming-typescript-proficient",
      criterionId: "programming-typescript.proficient",
      level: "proficient" as const,
    };
    const duplicatePracticeNote: LearningNote = {
      ...note,
      modules: [note.modules[0], secondModule],
    };
    expect(() => validateLearningCatalog([duplicatePracticeNote], [source])).toThrow(/duplicate practice/i);
  });

  it("keeps all canonical competency criteria addressable", () => {
    for (const definition of competencyDefinitions) {
      expect(definition.criteria).toHaveLength(4);
    }
  });
});
