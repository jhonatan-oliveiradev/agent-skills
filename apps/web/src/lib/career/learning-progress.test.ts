import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLearningNote } from "./learning-catalog";
import {
  completeLearningModule,
  completeLearningPractice,
  getLearningProgress,
  getLearningState,
  startLearningModule,
} from "./learning-progress";
import type { LearningNote } from "./learning-types";
import { createEmptyCareerProfile } from "./profile";
import { calculateRoleReadiness } from "./readiness";
import { buildRoadmap } from "./roadmap-engine";
import { getRoleMap } from "./role-maps";

vi.mock("./learning-catalog", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./learning-catalog")>();
  return {
    ...actual,
    getLearningNote: vi.fn(),
  };
});

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
  estimatedMinutes: 18,
  modules: [
    {
      id: "programming-typescript-foundation",
      criterionId: "programming-typescript.foundation",
      level: "foundation",
      title: { en: "Typed values", "pt-BR": "Valores tipados" },
      estimatedMinutes: 8,
      contentVersion: "1",
      reviewStatus: "reviewed",
      reviewedAt: "2026-09-11T00:00:00.000Z",
      primarySourcePolicy: "required",
      understand: { en: "Use explicit types.", "pt-BR": "Use tipos explícitos." },
      commonMistake: { en: "Using any.", "pt-BR": "Usar any." },
      practice: {
        id: "programming-typescript-foundation-practice",
        prompt: { en: "Type a small boundary.", "pt-BR": "Tipifique um pequeno limite." },
      },
      consolidationCriteria: {
        en: ["Explains the boundary."],
        "pt-BR": ["Explica o limite."],
      },
      sourceIds: ["fixture-source"],
    },
    {
      id: "programming-typescript-developing",
      criterionId: "programming-typescript.developing",
      level: "developing",
      title: { en: "Impossible states", "pt-BR": "Estados impossíveis" },
      estimatedMinutes: 10,
      contentVersion: "1",
      reviewStatus: "reviewed",
      reviewedAt: "2026-09-11T00:00:00.000Z",
      primarySourcePolicy: "required",
      understand: { en: "Use explicit variants.", "pt-BR": "Use variantes explícitas." },
      commonMistake: {
        en: "Optional-everything state.",
        "pt-BR": "Estado com tudo opcional.",
      },
      practice: {
        id: "programming-typescript-developing-practice",
        prompt: { en: "Refactor a loose state.", "pt-BR": "Refatore um estado frouxo." },
      },
      consolidationCriteria: {
        en: ["Explains why impossible states disappear."],
        "pt-BR": ["Explica por que estados impossíveis desaparecem."],
      },
      sourceIds: ["fixture-source"],
    },
  ],
};

function profileWithRoadmap() {
  const profile = createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    weeklyStudyHours: 8,
    now: "2026-09-11T12:00:00.000Z",
  });
  return {
    ...profile,
    roadmap: buildRoadmap(profile, getRoleMap("frontend-developer")),
  };
}

beforeEach(() => {
  vi.mocked(getLearningNote).mockReset();
  vi.mocked(getLearningNote).mockImplementation((noteId) =>
    noteId === note.id ? note : undefined,
  );
});

describe("Career learning progress", () => {
  it("starts a reviewed module without mutating professional state", () => {
    const before = profileWithRoadmap();
    const after = startLearningModule(
      before,
      note.id,
      note.modules[0]!.id,
      "2026-09-11T12:10:00.000Z",
    );

    expect(getLearningProgress(after, note.id)).toMatchObject({
      noteId: note.id,
      currentModuleId: note.modules[0]!.id,
      completedModuleIds: [],
      completedPracticeIds: [],
      completedAt: null,
    });
    expect(after.competencies).toEqual(before.competencies);
    expect(after.evidence).toEqual(before.evidence);
    expect(after.assessments).toEqual(before.assessments);
    expect(after.roadmap).toEqual(before.roadmap);
  });

  it("records practice and module completion idempotently", () => {
    const before = profileWithRoadmap();
    const afterPractice = completeLearningPractice(
      before,
      note.id,
      note.modules[0]!.id,
      note.modules[0]!.practice.id,
      "2026-09-11T12:15:00.000Z",
    );
    const afterPracticeAgain = completeLearningPractice(
      afterPractice,
      note.id,
      note.modules[0]!.id,
      note.modules[0]!.practice.id,
      "2026-09-11T12:16:00.000Z",
    );
    const afterModule = completeLearningModule(
      afterPracticeAgain,
      note.id,
      note.modules[0]!.id,
      "2026-09-11T12:20:00.000Z",
    );
    const afterModuleAgain = completeLearningModule(
      afterModule,
      note.id,
      note.modules[0]!.id,
      "2026-09-11T12:21:00.000Z",
    );

    const progress = getLearningProgress(afterModuleAgain, note.id);
    expect(progress?.completedPracticeIds).toEqual([note.modules[0]!.practice.id]);
    expect(progress?.completedModuleIds).toEqual([note.modules[0]!.id]);
  });

  it("marks a note studied only after every reviewed module is complete", () => {
    const before = profileWithRoadmap();
    expect(getLearningState(before, note)).toBe("not-started");

    const first = completeLearningModule(
      before,
      note.id,
      note.modules[0]!.id,
      "2026-09-11T12:20:00.000Z",
    );
    expect(getLearningState(first, note)).toBe("in-progress");
    expect(getLearningProgress(first, note.id)?.completedAt).toBeNull();

    const second = completeLearningModule(
      first,
      note.id,
      note.modules[1]!.id,
      "2026-09-11T12:30:00.000Z",
    );
    expect(getLearningState(second, note)).toBe("studied");
    expect(getLearningProgress(second, note.id)?.completedAt).toBe(
      "2026-09-11T12:30:00.000Z",
    );
  });

  it("changes only learning progress and profile updatedAt when study is completed", () => {
    const before = profileWithRoadmap();
    const readinessBefore = calculateRoleReadiness(before, getRoleMap("frontend-developer"));
    const after = completeLearningModule(
      before,
      note.id,
      note.modules[1]!.id,
      "2026-09-11T13:00:00.000Z",
    );

    expect(after.learningProgress).not.toEqual(before.learningProgress);
    expect(after.updatedAt).toBe("2026-09-11T13:00:00.000Z");
    expect(after.competencies).toEqual(before.competencies);
    expect(after.evidence).toEqual(before.evidence);
    expect(after.assessments).toEqual(before.assessments);
    expect(after.roadmap).toEqual(before.roadmap);
    expect(after.roadmap.supportingActivityId).toBe(before.roadmap.supportingActivityId);
    expect(after.marketSamples).toEqual(before.marketSamples);
    expect(after.decisionRecords).toEqual(before.decisionRecords);
    expect(calculateRoleReadiness(after, getRoleMap("frontend-developer"))).toEqual(
      readinessBefore,
    );
  });

  it("fails closed for unknown notes, modules, practices, and draft modules", () => {
    const profile = profileWithRoadmap();
    expect(() => startLearningModule(profile, "unknown-note", "unknown-module")).toThrow(
      /unknown learning note/i,
    );
    expect(() => startLearningModule(profile, note.id, "unknown-module")).toThrow(
      /unknown learning module/i,
    );
    expect(() =>
      completeLearningPractice(
        profile,
        note.id,
        note.modules[0]!.id,
        "wrong-practice",
      ),
    ).toThrow(/unknown learning practice/i);

    const draftNote: LearningNote = {
      ...note,
      id: "draft-note",
      modules: [{ ...note.modules[0]!, id: "draft-module", reviewStatus: "draft" }],
    };
    vi.mocked(getLearningNote).mockImplementation((noteId) => {
      if (noteId === note.id) return note;
      if (noteId === draftNote.id) return draftNote;
      return undefined;
    });
    expect(() => startLearningModule(profile, draftNote.id, "draft-module")).toThrow(
      /reviewed/i,
    );
  });
});
