import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLearningNote, learningNoteCatalog } from "./learning-catalog";
import { completeLearningUnit } from "./learning";
import { completeLearningModule, getLearningState } from "./learning-progress";
import type { LearningNote } from "./learning-types";
import { createEmptyCareerProfile } from "./profile";

vi.mock("./learning-catalog", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./learning-catalog")>();
  return {
    ...actual,
    getLearningNote: vi.fn(actual.getLearningNote),
  };
});

const fixtureNote: LearningNote = {
  id: "typescript-application-modeling",
  competencyId: "programming-typescript",
  title: { en: "TypeScript application modeling", "pt-BR": "Modelagem com TypeScript" },
  summary: { en: "Model valid application states.", "pt-BR": "Modele estados válidos." },
  objective: { en: "Represent valid states explicitly.", "pt-BR": "Represente estados válidos explicitamente." },
  estimatedMinutes: 12,
  modules: [
    {
      id: "programming-typescript-developing",
      criterionId: "programming-typescript.developing",
      level: "developing",
      title: { en: "Application state", "pt-BR": "Estado da aplicação" },
      estimatedMinutes: 8,
      contentVersion: "1",
      reviewStatus: "reviewed",
      reviewedAt: "2026-09-11T00:00:00.000Z",
      primarySourcePolicy: "required",
      understand: { en: "Model explicit states.", "pt-BR": "Modele estados explícitos." },
      commonMistake: { en: "Loose optionals.", "pt-BR": "Opcionais frouxos." },
      practice: {
        id: "programming-typescript-developing-practice",
        prompt: { en: "Refactor one state.", "pt-BR": "Refatore um estado." },
      },
      consolidationCriteria: {
        en: ["Explains the state model."],
        "pt-BR": ["Explica o modelo de estado."],
      },
      sourceIds: ["fixture-source"],
    },
    {
      id: "programming-typescript-proficient",
      criterionId: "programming-typescript.proficient",
      level: "proficient",
      title: { en: "Advanced modeling", "pt-BR": "Modelagem avançada" },
      estimatedMinutes: 4,
      contentVersion: "1",
      reviewStatus: "draft",
      reviewedAt: "2026-09-11T00:00:00.000Z",
      primarySourcePolicy: "required",
      understand: { en: "Draft content.", "pt-BR": "Conteúdo em rascunho." },
      commonMistake: { en: "Draft mistake.", "pt-BR": "Erro em rascunho." },
      practice: {
        id: "programming-typescript-proficient-practice",
        prompt: { en: "Draft practice.", "pt-BR": "Prática em rascunho." },
      },
      consolidationCriteria: {
        en: ["Draft criterion."],
        "pt-BR": ["Critério em rascunho."],
      },
      sourceIds: ["fixture-source"],
    },
  ],
};

beforeEach(() => {
  vi.mocked(getLearningNote).mockReset();
  vi.mocked(getLearningNote).mockImplementation((noteId) => {
    if (noteId === fixtureNote.id) return fixtureNote;
    return learningNoteCatalog.find((note) => note.id === noteId);
  });
});

describe("career learning integration regressions", () => {
  it("records compatibility learning completion in Profile v2 without roadmap supporting state", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now: "2026-09-08T18:00:00.000Z",
    });

    const next = completeLearningUnit(
      profile,
      "programming-foundations",
      "async-js-control-flow",
      "2026-09-08T18:05:00.000Z",
    );

    expect(next.roadmap.supportingActivityId).toBeNull();
    expect(next.learningProgress).toHaveLength(1);
    expect(next.learningProgress[0]?.noteId).toBe("javascript-programming");
    expect(next.evidence).toEqual(profile.evidence);
    expect(next.competencies).toEqual(profile.competencies);
  });

  it("keeps Profile v2 study progress separate from professional state and ignores draft coverage", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now: "2026-09-11T12:00:00.000Z",
    });

    const next = completeLearningModule(
      profile,
      fixtureNote.id,
      fixtureNote.modules[0]!.id,
      "2026-09-11T12:10:00.000Z",
    );

    expect(next.learningProgress).toHaveLength(1);
    expect(getLearningState(next, fixtureNote)).toBe("studied");
    expect(next.roadmap).toEqual(profile.roadmap);
    expect(next.roadmap.supportingActivityId).toBeNull();
    expect(next.evidence).toEqual(profile.evidence);
    expect(next.competencies).toEqual(profile.competencies);
    expect(next.assessments).toEqual(profile.assessments);
    expect(next.marketSamples).toEqual(profile.marketSamples);
    expect(next.decisionRecords).toEqual(profile.decisionRecords);
  });
});
