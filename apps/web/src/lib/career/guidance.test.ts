import { describe, expect, it } from "vitest";
import { baselineAssessmentBlueprints } from "./assessment-blueprints";
import { getCareerNextAction } from "./guidance";
import { getLearningNote } from "./learning-catalog";
import { createEmptyCareerProfile } from "./profile";
import { roadmapMilestoneCatalog } from "./roadmap-catalog";
import type { CareerProfile, ProficiencyLevel } from "./types";

const NOW = "2026-09-09T12:00:00.000Z";

function freshProfile(): CareerProfile {
  return createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    weeklyStudyHours: 6,
    now: NOW,
  });
}

function withCompletedBaselines(profile: CareerProfile): CareerProfile {
  return {
    ...profile,
    assessments: baselineAssessmentBlueprints.map((blueprint, index) => ({
      id: `assessment-${index + 1}`,
      blueprintId: blueprint.id,
      blueprintVersion: blueprint.version,
      competencyId: blueprint.competencyId,
      level: "developing" as const,
      confidence: "medium" as const,
      evidenceIds: [],
      completedAt: NOW,
      trust: "local-deterministic" as const,
    })),
  };
}

function withStrongEvidence(
  profile: CareerProfile,
  javascriptLevel: ProficiencyLevel,
): CareerProfile {
  const competencyIds = [
    ...new Set(
      roadmapMilestoneCatalog.flatMap((milestone) => [
        ...milestone.requirements.map((requirement) => requirement.competencyId),
        ...milestone.evidenceRequirements.map((requirement) => requirement.competencyId),
      ]),
    ),
  ];

  const evidence = competencyIds.map((competencyId, index) => ({
    id: `evidence-${index + 1}`,
    competencyId,
    class: "E4" as const,
    sourceType: "portfolio" as const,
    trust: "local-deterministic" as const,
    observedAt: NOW,
    summary: `Verified ${competencyId}`,
    demonstratedLevel: "advanced" as const,
  }));

  return {
    ...profile,
    competencies: competencyIds.map((competencyId, index) => ({
      competencyId,
      level: competencyId === "programming-javascript" ? javascriptLevel : "advanced",
      confidence: "high" as const,
      evidenceIds: [evidence[index]!.id],
      lastAssessedAt: NOW,
    })),
    evidence,
  };
}

function withMarketSample(profile: CareerProfile): CareerProfile {
  return {
    ...profile,
    marketSamples: [
      {
        id: "market-1",
        targetRole: "frontend-developer",
        targetMarket: "br",
        capturedAt: NOW,
        postingCount: 1,
        distinctCompanyCount: 1,
        distinctSourceCount: 1,
        signals: [
          {
            competencyId: "programming-javascript",
            provenance: "market-derived",
            explicitCount: 1,
            inferredCount: 0,
            postingCount: 1,
          },
        ],
      },
    ],
  };
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
  }
  return value;
}

describe("getCareerNextAction", () => {
  it("uses the locked precedence without mutating the profile", () => {
    const cases: readonly [string, CareerProfile, string][] = [
      ["baseline missing", freshProfile(), "complete-baseline"],
      [
        "all baseline complete and no current focus",
        withCompletedBaselines(withStrongEvidence(freshProfile(), "advanced")),
        "review-roadmap",
      ],
      [
        "current focus has evidence gaps",
        withCompletedBaselines({
          ...freshProfile(),
          competencies: [
            {
              competencyId: "programming-javascript",
              level: "foundation",
              confidence: "medium",
              evidenceIds: [],
              lastAssessedAt: NOW,
            },
          ],
        }),
        "produce-evidence",
      ],
      [
        "focus evidence satisfied but no market sample",
        withCompletedBaselines(withStrongEvidence(freshProfile(), "foundation")),
        "add-market-sample",
      ],
      [
        "market exists and focus remains",
        withMarketSample(withCompletedBaselines(withStrongEvidence(freshProfile(), "foundation"))),
        "continue-roadmap",
      ],
    ];

    for (const [label, profile, expectedKind] of cases) {
      const before = JSON.stringify(profile);
      const frozen = deepFreeze(profile);
      const action = getCareerNextAction(frozen, "pt-BR");

      expect(action.kind, label).toBe(expectedKind);
      expect(JSON.stringify(profile), `${label} mutated input`).toBe(before);
    }
  });

  it("points a fresh profile to the first missing baseline", () => {
    const action = getCareerNextAction(freshProfile(), "pt-BR");

    expect(action).toEqual({
      kind: "complete-baseline",
      blueprintId: "baseline-javascript",
      href: "/pt-BR/career-lab/assessments/baseline-javascript",
    });
  });

  it("connects a completed assessment to learning, then sends studied content to reassessment", () => {
    const baseline = baselineAssessmentBlueprints[0]!;
    const assessed = {
      ...freshProfile(),
      assessments: [{
        id: "assessment-1", blueprintId: baseline.id, blueprintVersion: baseline.version,
        competencyId: baseline.competencyId, level: "foundation" as const,
        confidence: "medium" as const, evidenceIds: [], completedAt: NOW,
        trust: "local-deterministic" as const,
      }],
    };
    const study = getCareerNextAction(assessed, "pt-BR");
    expect(study.kind).toBe("study-assessed-gap");
    if (study.kind !== "study-assessed-gap") return;
    const note = getLearningNote(study.noteId)!;
    expect(note.modules.find((item) => item.id === study.moduleId)?.level).toBe("developing");
    const studied = {
      ...assessed,
      learningProgress: [{
        noteId: note.id, startedAt: NOW, updatedAt: "2026-09-10T12:00:00.000Z",
        currentModuleId: study.moduleId, completedModuleIds: [study.moduleId],
        completedPracticeIds: [note.modules.find((item) => item.id === study.moduleId)!.practice.id],
        completedAt: null,
      }],
    };
    expect(getCareerNextAction(studied, "pt-BR")).toEqual({
      kind: "prove-studied-gap", blueprintId: baseline.id,
      href: `/pt-BR/career-lab/assessments/${baseline.id}`,
    });
    const reassessed = { ...studied, assessments: [{ ...assessed.assessments[0]!, completedAt: "2026-09-11T12:00:00.000Z" }] };
    expect(getCareerNextAction(reassessed, "pt-BR").kind).toBe("complete-baseline");
    expect(getCareerNextAction({ ...assessed, assessments: [{ ...assessed.assessments[0]!, level: "advanced" }] }, "pt-BR").kind).toBe("complete-baseline");
  });
});
