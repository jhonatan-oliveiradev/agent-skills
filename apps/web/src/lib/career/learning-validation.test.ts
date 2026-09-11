import { beforeEach, describe, expect, it, vi } from "vitest";
import { competencyDefinitions } from "./competencies";
import {
  getLearningNote,
  getReviewedLearningModules,
} from "./learning-catalog";
import {
  validateLearningCatalog,
  validateLearningProgressReferences,
} from "./learning-validation";
import type { LearningNote, LearningSource } from "./learning-types";
import { createEmptyCareerProfile } from "./profile";

vi.mock("./learning-catalog", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./learning-catalog")>();
  return {
    ...actual,
    getLearningNote: vi.fn(),
  };
});

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

function profileWithProgress() {
  return {
    ...createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      now: "2026-09-11T12:00:00.000Z",
    }),
    learningProgress: [
      {
        noteId: note.id,
        startedAt: "2026-09-11T12:00:00.000Z",
        updatedAt: "2026-09-11T12:10:00.000Z",
        currentModuleId: note.modules[0]!.id,
        completedModuleIds: [note.modules[0]!.id],
        completedPracticeIds: [note.modules[0]!.practice.id],
        completedAt: "2026-09-11T12:10:00.000Z",
      },
    ],
  };
}

beforeEach(() => {
  vi.mocked(getLearningNote).mockReset();
  vi.mocked(getLearningNote).mockImplementation((noteId) =>
    noteId === note.id ? note : undefined,
  );
});

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

  it("rejects incomplete bilingual content and invalid review timestamps", () => {
    const missingPtBr: LearningNote = {
      ...note,
      modules: [
        {
          ...note.modules[0],
          understand: { en: "Use explicit variants.", "pt-BR": "" },
        },
      ],
    };
    expect(() => validateLearningCatalog([missingPtBr], [source])).toThrow(/pt-BR/i);

    const invalidTimestamp: LearningNote = {
      ...note,
      modules: [{ ...note.modules[0], reviewedAt: "not-a-date" }],
    };
    expect(() => validateLearningCatalog([invalidTimestamp], [source])).toThrow(/reviewedAt/i);
  });

  it("rejects unknown source references and sources claiming unknown criteria", () => {
    const unknownSourceNote: LearningNote = {
      ...note,
      modules: [{ ...note.modules[0], sourceIds: ["missing-source"] }],
    };
    expect(() => validateLearningCatalog([unknownSourceNote], [source])).toThrow(/unknown source/i);

    const invalidSource: LearningSource = {
      ...source,
      supportsCriterionIds: ["programming-typescript.unknown"],
    };
    expect(() => validateLearningCatalog([note], [invalidSource])).toThrow(/unknown criterion/i);
  });

  it("enforces primary-source policy and localized not-available reasons", () => {
    const pedagogical: LearningSource = {
      ...source,
      authority: "recognized-pedagogical",
    };
    expect(() => validateLearningCatalog([note], [pedagogical])).toThrow(/primary/i);

    const missingReason: LearningNote = {
      ...note,
      modules: [
        {
          ...note.modules[0],
          primarySourcePolicy: "not-available",
          primarySourceReason: { en: "No suitable primary source.", "pt-BR": "" },
        },
      ],
    };
    expect(() => validateLearningCatalog([missingReason], [pedagogical])).toThrow(/pt-BR/i);
  });

  it("filters draft modules out of reviewed learning content", () => {
    const draft = { ...note.modules[0]!, id: "draft-module", reviewStatus: "draft" as const };
    expect(getReviewedLearningModules({ ...note, modules: [note.modules[0]!, draft] })).toEqual([
      note.modules[0],
    ]);
  });

  it("validates learning progress references against the curated note domain", () => {
    const profile = profileWithProgress();
    expect(validateLearningProgressReferences(profile)).toBe(profile);

    expect(() =>
      validateLearningProgressReferences({
        ...profile,
        learningProgress: [{ ...profile.learningProgress[0]!, noteId: "unknown-note" }],
      }),
    ).toThrow(/unknown learning note/i);

    expect(() =>
      validateLearningProgressReferences({
        ...profile,
        learningProgress: [
          { ...profile.learningProgress[0]!, currentModuleId: "unknown-module" },
        ],
      }),
    ).toThrow(/unknown learning module/i);

    expect(() =>
      validateLearningProgressReferences({
        ...profile,
        learningProgress: [
          { ...profile.learningProgress[0]!, completedModuleIds: ["unknown-module"] },
        ],
      }),
    ).toThrow(/unknown learning module/i);

    expect(() =>
      validateLearningProgressReferences({
        ...profile,
        learningProgress: [
          { ...profile.learningProgress[0]!, completedPracticeIds: ["unknown-practice"] },
        ],
      }),
    ).toThrow(/unknown learning practice/i);
  });

  it("keeps all canonical competency criteria addressable", () => {
    for (const definition of competencyDefinitions) {
      expect(definition.criteria).toHaveLength(4);
    }
  });
});
