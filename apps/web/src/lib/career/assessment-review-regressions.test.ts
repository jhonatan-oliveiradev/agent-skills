import { describe, expect, it } from "vitest";
import { deriveEvidenceConfidence } from "./evidence";
import {
  applyAssessmentResult,
  evaluateAssessment,
  validateAssessmentBlueprint,
  type AssessmentBlueprint,
  type AssessmentChallenge,
  type AssessmentResponses,
} from "./assessment";
import { baselineAssessmentBlueprints } from "./assessment-blueprints";
import { createEmptyCareerProfile } from "./profile";
import type { EvidenceRecord } from "./types";

const completedAt = "2026-09-07T12:00:00.000Z";

function evaluate(
  blueprint: AssessmentBlueprint,
  answers: Record<string, readonly string[]>,
) {
  return evaluateAssessment(blueprint, {
    blueprintId: blueprint.id,
    blueprintVersion: blueprint.version,
    completedAt,
    answers,
  } satisfies AssessmentResponses);
}

function correctAnswers(blueprint: AssessmentBlueprint): Record<string, readonly string[]> {
  return Object.fromEntries(
    blueprint.challenges.map((challenge) => [challenge.id, challenge.correctOptionIds]),
  );
}

function incorrectAnswer(challenge: AssessmentChallenge): readonly string[] {
  if (challenge.kind === "structured-ordering") {
    return [...challenge.correctOptionIds].reverse();
  }
  const incorrect = challenge.options.find(
    (option) => !challenge.correctOptionIds.includes(option.id),
  );
  if (!incorrect) throw new Error("Expected an incorrect assessment option");
  return [incorrect.id];
}

function incorrectAnswers(blueprint: AssessmentBlueprint): Record<string, readonly string[]> {
  return Object.fromEntries(
    blueprint.challenges.map((challenge) => [challenge.id, incorrectAnswer(challenge)]),
  );
}

const progressiveBlueprint = {
  id: "progressive-javascript",
  version: "1",
  competencyId: "programming-javascript",
  targetLevel: "advanced",
  dimensions: [
    { id: "performance", label: "Performance", required: false },
    { id: "authentic", label: "Authentic evidence", required: false },
  ],
  challenges: [
    {
      id: "performance-debugging",
      dimensionId: "performance",
      kind: "debugging-choice",
      prompt: "Choose the production-safe fix.",
      options: [
        { id: "performance-correct", label: "Fix the failing boundary" },
        { id: "performance-wrong", label: "Hide the error" },
      ],
      correctOptionIds: ["performance-correct"],
      evidenceClass: "E3",
      demonstratedLevel: "proficient",
      criterionIds: [
        "programming-javascript.foundation",
        "programming-javascript.developing",
        "programming-javascript.proficient",
      ],
    },
    {
      id: "authentic-ordering",
      dimensionId: "authentic",
      kind: "structured-ordering",
      prompt: "Order the production validation steps.",
      options: [
        { id: "authentic-first", label: "Reproduce with evidence" },
        { id: "authentic-second", label: "Verify the fix" },
      ],
      correctOptionIds: ["authentic-first", "authentic-second"],
      evidenceClass: "E4",
      demonstratedLevel: "advanced",
      criterionIds: [
        "programming-javascript.foundation",
        "programming-javascript.developing",
        "programming-javascript.proficient",
        "programming-javascript.advanced",
      ],
    },
  ],
  gates: [
    {
      dimensionId: "performance",
      minimumPassedChallenges: 1,
      requiredForLevel: "proficient",
    },
    {
      dimensionId: "authentic",
      minimumPassedChallenges: 1,
      requiredForLevel: "advanced",
    },
  ],
} as const satisfies AssessmentBlueprint;

const progressiveAnswers = {
  "performance-debugging": ["performance-correct"],
  "authentic-ordering": ["authentic-first", "authentic-second"],
} as const;

describe("assessment review regressions", () => {
  it("treats a required dimension as a gate even when no explicit gate is declared", () => {
    const baseline = baselineAssessmentBlueprints[0];
    const requiredDimensionBlueprint = {
      ...baseline,
      id: "required-dimension-regression",
      dimensions: baseline.dimensions.map((dimension) => ({
        ...dimension,
        required: true,
      })),
      gates: [],
    } satisfies AssessmentBlueprint;
    const passingAnswers = correctAnswers(requiredDimensionBlueprint);
    const firstChallenge = requiredDimensionBlueprint.challenges[0];
    if (!firstChallenge) throw new Error("Expected required-dimension challenge");

    const passing = evaluate(requiredDimensionBlueprint, passingAnswers);
    const failing = evaluate(requiredDimensionBlueprint, {
      ...passingAnswers,
      [firstChallenge.id]: incorrectAnswer(firstChallenge),
    });

    expect(passing.level).toBe("developing");
    expect(failing.level).toBe("foundation");
  });

  it("does not let a failed baseline observation satisfy canonical competency criteria", () => {
    const baseline = baselineAssessmentBlueprints[0];
    const failed = evaluate(baseline, incorrectAnswers(baseline));
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      now: "2026-09-07T11:00:00.000Z",
    });

    const updated = applyAssessmentResult(profile, failed);
    const state = updated.competencies.find(
      (candidate) => candidate.competencyId === "programming-javascript",
    );

    expect(state?.level).toBeNull();
  });

  it("uses gate.requiredForLevel to cap only the level protected by a failed gate", () => {
    const result = evaluate(progressiveBlueprint, {
      ...progressiveAnswers,
      "authentic-ordering": ["authentic-second", "authentic-first"],
    });

    expect(result.level).toBe("proficient");
  });

  it("fails closed for unsupported challenge kinds and criterion references outside the competency", () => {
    const baseline = baselineAssessmentBlueprints[0];
    const unsupportedKind = {
      ...baseline,
      challenges: [{ ...baseline.challenges[0], kind: "free-text" }, ...baseline.challenges.slice(1)],
    } as unknown as AssessmentBlueprint;
    const unknownCriterion = {
      ...baseline,
      challenges: [{
        ...baseline.challenges[0],
        criterionIds: ["programming-typescript.developing"],
      }, ...baseline.challenges.slice(1)],
    } as unknown as AssessmentBlueprint;

    expect(() => validateAssessmentBlueprint(unsupportedKind)).toThrow(/challenge.*kind|unsupported/i);
    expect(() => validateAssessmentBlueprint(unknownCriterion)).toThrow(/criterion.*unknown|criterion.*competency/i);
  });

  it("fails closed when responses contain a challenge that is not in the blueprint", () => {
    const baseline = baselineAssessmentBlueprints[0];

    expect(() => evaluate(baseline, {
      ...correctAnswers(baseline),
      "not-in-blueprint": ["anything"],
    })).toThrow(/unknown response|challenge.*not.*blueprint/i);
  });

  it("records a failed deterministic observation so contradictory reassessment lowers confidence", () => {
    const priorEvidence = [
      {
        id: "prior-e3",
        competencyId: "programming-javascript",
        class: "E3",
        sourceType: "assessment",
        trust: "local-deterministic",
        observedAt: completedAt,
        summary: "Prior proficient performance",
        demonstratedLevel: "advanced",
        criterionIds: ["programming-javascript.advanced"],
      },
      {
        id: "prior-e4",
        competencyId: "programming-javascript",
        class: "E4",
        sourceType: "portfolio",
        trust: "local-deterministic",
        observedAt: completedAt,
        summary: "Prior authentic performance",
        demonstratedLevel: "advanced",
        criterionIds: ["programming-javascript.advanced"],
      },
    ] as const satisfies readonly EvidenceRecord[];
    expect(deriveEvidenceConfidence(priorEvidence, new Date(completedAt))).toBe("high");

    const failedAdvanced = evaluate(progressiveBlueprint, {
      ...progressiveAnswers,
      "authentic-ordering": ["authentic-second", "authentic-first"],
    });
    const failedObservation = failedAdvanced.evidence.find(
      (record) => record.id.endsWith(":authentic-ordering"),
    );

    expect(failedObservation).toEqual(expect.objectContaining({
      demonstratedLevel: "proficient",
      criterionIds: expect.arrayContaining(["programming-javascript.advanced"]),
    }));
    expect(
      deriveEvidenceConfidence(
        [...priorEvidence, ...failedAdvanced.evidence],
        new Date(completedAt),
      ),
    ).not.toBe("high");
  });
});
