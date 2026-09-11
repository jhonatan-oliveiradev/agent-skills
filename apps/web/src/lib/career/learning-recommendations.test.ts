import { describe, expect, it } from "vitest";
import type { AssessmentResultArtifact } from "./assessment";
import { getLearningModuleByCriterion } from "./learning-catalog";
import {
  getAssessmentLearningRecommendation,
  getMilestoneLearningModules,
  getPrimaryLearningRecommendation,
} from "./learning-recommendations";
import { createEmptyCareerProfile } from "./profile";
import type {
  CareerProfile,
  CompetencyState,
  LearningProgressRecord,
  ProficiencyLevel,
} from "./types";

const now = "2026-09-11T12:00:00.000Z";

function competencyState(
  competencyId: string,
  level: ProficiencyLevel | null,
): CompetencyState {
  return {
    competencyId,
    level,
    confidence: "low",
    evidenceIds: [],
    lastAssessedAt: null,
  };
}

function learningProgress(
  noteId: string,
  options: Readonly<{
    currentModuleId?: string | null;
    completedModuleIds?: readonly string[];
    completedPracticeIds?: readonly string[];
  }> = {},
): LearningProgressRecord {
  return {
    noteId,
    startedAt: now,
    updatedAt: now,
    currentModuleId: options.currentModuleId ?? null,
    completedModuleIds: options.completedModuleIds ?? [],
    completedPracticeIds: options.completedPracticeIds ?? [],
    completedAt: null,
  };
}

function profile(
  overrides: Partial<CareerProfile> = {},
): CareerProfile {
  return {
    ...createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "BR",
      now,
    }),
    ...overrides,
  };
}

describe("Career learning recommendations", () => {
  it("prioritizes an unstudied blocking criterion", () => {
    const subject = profile({
      competencies: [competencyState("programming-javascript", "developing")],
    });

    expect(getPrimaryLearningRecommendation(subject)).toEqual({
      kind: "study",
      competencyId: "programming-javascript",
      criterionId: "programming-javascript.proficient",
      noteId: "javascript-programming",
      moduleId: "programming-javascript-proficient",
      reason: "blocking-gap",
      priority: 500,
    });
  });

  it("returns prove for a studied but still unproved criterion", () => {
    const subject = profile({
      competencies: [competencyState("programming-javascript", "foundation")],
      learningProgress: [
        learningProgress("javascript-programming", {
          completedModuleIds: ["programming-javascript-developing"],
        }),
      ],
    });

    const recommendation = getPrimaryLearningRecommendation(subject);

    expect(recommendation).toEqual({
      kind: "prove",
      competencyId: "programming-javascript",
      criterionId: "programming-javascript.developing",
      reason: "studied-not-proved",
      priority: 400,
      destination: "assessment",
    });
    expect(recommendation).not.toHaveProperty("noteId");
    expect(recommendation).not.toHaveProperty("moduleId");
  });

  it("prefers the current milestone over prerequisites and role progress", () => {
    const subject = profile({
      competencies: [
        competencyState("programming-javascript", "proficient"),
        competencyState("programming-typescript", "foundation"),
      ],
      roadmap: {
        milestoneIds: ["typed-application-modeling"],
        currentFocusMilestoneId: "typed-application-modeling",
        supportingActivityId: null,
      },
    });

    expect(getPrimaryLearningRecommendation(subject)).toEqual({
      kind: "study",
      competencyId: "programming-typescript",
      criterionId: "programming-typescript.developing",
      noteId: "typescript-application-modeling",
      moduleId: "programming-typescript-developing",
      reason: "current-milestone",
      priority: 300,
    });
  });

  it("prefers an unmet prerequisite over the next role competency", () => {
    expect(getPrimaryLearningRecommendation(profile())).toEqual({
      kind: "study",
      competencyId: "programming-javascript",
      criterionId: "programming-javascript.foundation",
      noteId: "javascript-programming",
      moduleId: "programming-javascript-foundation",
      reason: "prerequisite",
      priority: 200,
    });
  });

  it("returns the next canonical role level instead of jumping to the required level", () => {
    const subject = profile({
      competencies: [
        competencyState("programming-javascript", "foundation"),
        competencyState("http-api-engineering", "foundation"),
        competencyState("testing-behavior", "foundation"),
        competencyState("git-collaboration", "foundation"),
      ],
    });

    expect(getPrimaryLearningRecommendation(subject)).toEqual({
      kind: "study",
      competencyId: "programming-javascript",
      criterionId: "programming-javascript.developing",
      noteId: "javascript-programming",
      moduleId: "programming-javascript-developing",
      reason: "next-role-competency",
      priority: 100,
    });
  });

  it("never recommends a draft module", () => {
    const subject = profile({
      competencies: [
        competencyState("programming-javascript", "foundation"),
        competencyState("programming-typescript", "developing"),
        competencyState("web-accessibility", "developing"),
        competencyState("testing-behavior", "developing"),
        competencyState("git-collaboration", "developing"),
        competencyState("http-api-engineering", "foundation"),
      ],
    });
    const resolved = getLearningModuleByCriterion("programming-javascript.developing");
    expect(resolved).toBeDefined();
    const mutable = resolved!.module as { reviewStatus: "draft" | "reviewed" };
    const original = mutable.reviewStatus;

    try {
      mutable.reviewStatus = "draft";
      expect(getPrimaryLearningRecommendation(subject)).toBeNull();
    } finally {
      mutable.reviewStatus = original;
    }
  });

  it("returns null when a relevant criterion has no reviewed mapping", () => {
    const subject = profile({
      competencies: [
        competencyState("programming-javascript", "proficient"),
        competencyState("programming-typescript", "developing"),
        competencyState("web-accessibility", "developing"),
        competencyState("testing-behavior", "developing"),
        competencyState("git-collaboration", "developing"),
        competencyState("http-api-engineering", "foundation"),
      ],
    });

    expect(getPrimaryLearningRecommendation(subject)).toBeNull();
  });

  it("is deterministic for identical profile and catalog input", () => {
    const subject = profile({
      competencies: [competencyState("programming-javascript", "developing")],
    });

    expect(getPrimaryLearningRecommendation(subject)).toEqual(
      getPrimaryLearningRecommendation(subject),
    );
  });

  it("derives assessment gaps from failed challenge ids and blueprint criterionIds", () => {
    const result: AssessmentResultArtifact = {
      schemaVersion: "1",
      artifactType: "assessment-result",
      blueprintId: "baseline-typescript",
      blueprintVersion: "1",
      competencyId: "programming-typescript",
      completedAt: now,
      level: "foundation",
      confidence: "low",
      dimensions: [
        {
          dimensionId: "reasoning",
          passed: false,
          passedChallengeIds: [],
          failedChallengeIds: [
            "baseline-typescript-ordering",
            "baseline-typescript-question",
          ],
          observedSignals: [],
        },
      ],
      evidence: [],
      gaps: ["this string is deliberately not a criterion id"],
      strongSignals: [],
      weakSignals: [],
      recommendedNextEvidence: "Retake focused evidence",
      provenance: { trust: "local-deterministic" },
    };

    expect(getAssessmentLearningRecommendation(result)).toEqual({
      kind: "study",
      competencyId: "programming-typescript",
      criterionId: "programming-typescript.foundation",
      noteId: "typescript-application-modeling",
      moduleId: "programming-typescript-foundation",
      reason: "blocking-gap",
      priority: 500,
    });
  });

  it("reports milestone module state from learning progress", () => {
    const subject = profile({
      competencies: [competencyState("programming-typescript", "foundation")],
      learningProgress: [
        learningProgress("typescript-application-modeling", {
          currentModuleId: "programming-typescript-developing",
        }),
      ],
    });

    expect(getMilestoneLearningModules(subject, "typed-application-modeling")).toEqual([
      expect.objectContaining({
        module: expect.objectContaining({ id: "programming-typescript-developing" }),
        state: "in-progress",
      }),
    ]);
  });
});
