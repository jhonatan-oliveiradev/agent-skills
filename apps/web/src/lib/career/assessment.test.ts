import { describe, expect, it } from "vitest";
import { createEmptyCareerProfile } from "./profile";
import type {
  AssessmentRecord,
  CareerProfile,
  EvidenceRecord,
} from "./types";
import {
  applyAssessmentResult,
  evaluateAssessment,
  type AssessmentBlueprint,
  type AssessmentResponses,
} from "./assessment";
import {
  baselineAssessmentBlueprints,
  validateAssessmentBlueprint,
} from "./assessment-blueprints";

const completedAt = "2026-09-05T16:30:00.000Z";

const blueprint = {
  id: "baseline-typescript",
  version: "1",
  competencyId: "programming-typescript",
  targetLevel: "proficient",
  dimensions: [
    { id: "theory", label: "Concept knowledge", required: false },
    { id: "reasoning", label: "Code reading", required: false },
    { id: "performance", label: "Debugging performance", required: true },
  ],
  challenges: [
    {
      id: "theory-single-choice",
      dimensionId: "theory",
      kind: "single-choice",
      prompt: "Which construct narrows a discriminated union?",
      options: [
        { id: "single-correct", label: "A discriminant check" },
        { id: "single-wrong", label: "A type assertion" },
      ],
      correctOptionIds: ["single-correct"],
      evidenceClass: "E1",
      demonstratedLevel: "foundation",
      criterionIds: ["programming-typescript.foundation"],
    },
    {
      id: "theory-multi-select",
      dimensionId: "theory",
      kind: "multi-select",
      prompt: "Select every safe boundary.",
      options: [
        { id: "multi-first-correct", label: "Validate unknown input" },
        { id: "multi-second-correct", label: "Narrow before access" },
        { id: "multi-wrong", label: "Use any" },
      ],
      correctOptionIds: ["multi-first-correct", "multi-second-correct"],
      evidenceClass: "E1",
      demonstratedLevel: "foundation",
      criterionIds: ["programming-typescript.foundation"],
    },
    {
      id: "reasoning-code-reading",
      dimensionId: "reasoning",
      kind: "code-reading-choice",
      prompt: "What change makes an impossible state unrepresentable?",
      options: [
        { id: "reading-correct", label: "Use a discriminated union" },
        { id: "reading-wrong", label: "Add a non-null assertion" },
      ],
      correctOptionIds: ["reading-correct"],
      evidenceClass: "E2",
      demonstratedLevel: "developing",
      criterionIds: [
        "programming-typescript.foundation",
        "programming-typescript.developing",
      ],
    },
    {
      id: "performance-debugging",
      dimensionId: "performance",
      kind: "debugging-choice",
      prompt: "Choose the fix for unsafe property access.",
      options: [
        { id: "debugging-correct", label: "Narrow before accessing the property" },
        { id: "debugging-wrong", label: "Cast the value to any" },
      ],
      correctOptionIds: ["debugging-correct"],
      evidenceClass: "E3",
      demonstratedLevel: "proficient",
      criterionIds: [
        "programming-typescript.foundation",
        "programming-typescript.developing",
        "programming-typescript.proficient",
      ],
    },
    {
      id: "reasoning-structured-ordering",
      dimensionId: "reasoning",
      kind: "structured-ordering",
      prompt: "Order the validation steps.",
      options: [
        { id: "ordering-first", label: "Receive unknown input" },
        { id: "ordering-second", label: "Validate the discriminant" },
        { id: "ordering-third", label: "Access the narrowed property" },
      ],
      correctOptionIds: ["ordering-first", "ordering-second", "ordering-third"],
      evidenceClass: "E2",
      demonstratedLevel: "developing",
      criterionIds: [
        "programming-typescript.foundation",
        "programming-typescript.developing",
      ],
    },
  ],
  gates: [
    {
      dimensionId: "performance",
      minimumPassedChallenges: 1,
      requiredForLevel: "proficient",
    },
  ],
} as const satisfies AssessmentBlueprint;

function responses(
  answers: Record<string, readonly string[]>,
  blueprintVersion = "1",
): AssessmentResponses {
  return {
    blueprintId: blueprint.id,
    blueprintVersion,
    completedAt,
    answers,
  } satisfies AssessmentResponses;
}

const passingAnswers = {
  "theory-single-choice": ["single-correct"],
  "theory-multi-select": ["multi-first-correct", "multi-second-correct"],
  "reasoning-code-reading": ["reading-correct"],
  "performance-debugging": ["debugging-correct"],
  "reasoning-structured-ordering": [
    "ordering-first",
    "ordering-second",
    "ordering-third",
  ],
} as const;

describe("evidence-gated assessment evaluation", () => {
  it("requires the performance gate: the complete blueprint reaches proficient only when it passes", () => {
    const passing = evaluateAssessment(blueprint, responses(passingAnswers));
    const failedPerformance = evaluateAssessment(
      blueprint,
      responses({
        ...passingAnswers,
        "performance-debugging": ["debugging-wrong"],
      }),
    );

    expect(passing.level).toBe("proficient");
    expect(failedPerformance.level).toBe("developing");
    expect(failedPerformance.dimensions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimensionId: "performance",
          passed: false,
          failedChallengeIds: ["performance-debugging"],
        }),
      ]),
    );
  });

  it("keeps level and confidence separate for a sparse passing assessment", () => {
    const sparseBlueprint = {
      ...blueprint,
      dimensions: [blueprint.dimensions[2]],
      challenges: [blueprint.challenges[3]],
    } as const satisfies AssessmentBlueprint;

    const result = evaluateAssessment(sparseBlueprint, {
      blueprintId: sparseBlueprint.id,
      blueprintVersion: "1",
      completedAt,
      answers: { "performance-debugging": ["debugging-correct"] },
    } satisfies AssessmentResponses);

    expect(result.level).toBe("proficient");
    expect(result.confidence).toBe("low");
  });

  it("produces the complete local deterministic Assessment Result Artifact shape", () => {
    const result = evaluateAssessment(blueprint, responses(passingAnswers));

    expect(result).toEqual(
      expect.objectContaining({
        schemaVersion: "1",
        artifactType: "assessment-result",
        blueprintId: blueprint.id,
        blueprintVersion: blueprint.version,
        competencyId: blueprint.competencyId,
        level: "proficient",
        confidence: expect.any(String),
        dimensions: expect.any(Array),
        evidence: expect.any(Array),
        gaps: expect.any(Array),
        strongSignals: expect.any(Array),
        weakSignals: expect.any(Array),
        recommendedNextEvidence: expect.any(String),
        provenance: { trust: "local-deterministic" },
      }),
    );
    expect(result.evidence).toHaveLength(5);
    expect(result.evidence.map((record) => record.class)).toEqual([
      "E1",
      "E1",
      "E2",
      "E3",
      "E2",
    ]);
  });

  it.each([
    ["single-choice", "theory-single-choice", ["single-wrong"]],
    ["multi-select", "theory-multi-select", ["multi-first-correct"]],
    ["code-reading-choice", "reasoning-code-reading", ["reading-wrong"]],
    ["debugging-choice", "performance-debugging", ["debugging-wrong"]],
    [
      "structured-ordering",
      "reasoning-structured-ordering",
      ["ordering-second", "ordering-first", "ordering-third"],
    ],
  ] as const)(
    "scores %s deterministically instead of treating every challenge as generic multiple choice",
    (_kind, challengeId, incorrectAnswer) => {
      const result = evaluateAssessment(
        blueprint,
        responses({ ...passingAnswers, [challengeId]: incorrectAnswer }),
      );

      expect(result.dimensions.some((dimension) =>
        dimension.failedChallengeIds.includes(challengeId),
      )).toBe(true);
    },
  );

  it("rejects missing and invalid responses instead of inventing evidence", () => {
    expect(() =>
      evaluateAssessment(
        blueprint,
        responses({
          ...passingAnswers,
          "performance-debugging": [],
        }),
      ),
    ).toThrow(/missing response.*performance-debugging/i);

    expect(() =>
      evaluateAssessment(
        blueprint,
        responses({
          ...passingAnswers,
          "theory-single-choice": ["not-an-option"],
        }),
      ),
    ).toThrow(/invalid response.*theory-single-choice/i);
  });

  it("rejects a semantically invalid blueprint and a response for another blueprint version", () => {
    const duplicateChallengeBlueprint = {
      ...blueprint,
      challenges: [...blueprint.challenges, blueprint.challenges[0]],
    } as const satisfies AssessmentBlueprint;

    expect(() =>
      evaluateAssessment(duplicateChallengeBlueprint, responses(passingAnswers)),
    ).toThrow(/duplicate challenge id/i);

    expect(() =>
      evaluateAssessment(blueprint, responses(passingAnswers, "99")),
    ).toThrow(/blueprint version mismatch/i);
  });

  it("ships valid V1 baseline probes for each mandatory triage competency", () => {
    const competencyIds = new Set(
      baselineAssessmentBlueprints.map((candidate) => candidate.competencyId),
    );

    for (const competencyId of [
      "programming-javascript",
      "programming-typescript",
      "web-platform-foundations",
      "testing-behavior",
      "http-api-engineering",
      "git-collaboration",
    ]) {
      expect(competencyIds).toContain(competencyId);
    }
    expect(baselineAssessmentBlueprints).toHaveLength(
      new Set(baselineAssessmentBlueprints.map((candidate) => candidate.id)).size,
    );
    for (const candidate of baselineAssessmentBlueprints) {
      expect(candidate.version).toBe("1");
      expect(() => validateAssessmentBlueprint(candidate)).not.toThrow();
    }
  });

  it("applies a local result immutably, appends history, and re-derives competency state from evidence", () => {
    const historicEvidence = {
      id: "evidence-existing",
      competencyId: "programming-typescript",
      class: "E0",
      sourceType: "self-report",
      trust: "user-claimed",
      observedAt: "2026-08-01T00:00:00.000Z",
      summary: "Existing user claim",
    } as const satisfies EvidenceRecord;
    const historicAssessment = {
      id: "assessment-existing",
      blueprintId: "older-typescript",
      blueprintVersion: "1",
      competencyId: "programming-typescript",
      level: "foundation",
      confidence: "low",
      evidenceIds: ["evidence-existing"],
      completedAt: "2026-08-01T00:00:00.000Z",
      trust: "user-claimed",
    } as const satisfies AssessmentRecord;
    const base = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      now: "2026-08-01T00:00:00.000Z",
    });
    const profile = {
      ...base,
      competencies: [
        {
          competencyId: "programming-typescript",
          level: "foundation",
          confidence: "low",
          evidenceIds: ["evidence-existing"],
          lastAssessedAt: "2026-08-01T00:00:00.000Z",
        },
      ],
      evidence: [historicEvidence],
      assessments: [historicAssessment],
    } satisfies CareerProfile;
    const result = evaluateAssessment(blueprint, responses(passingAnswers));

    const updated = applyAssessmentResult(profile, result);

    expect(updated).not.toBe(profile);
    expect(updated.evidence).not.toBe(profile.evidence);
    expect(updated.evidence[0]).toBe(historicEvidence);
    expect(updated.assessments).not.toBe(profile.assessments);
    expect(updated.assessments[0]).toBe(historicAssessment);
    expect(profile.evidence).toEqual([historicEvidence]);
    expect(profile.assessments).toEqual([historicAssessment]);

    expect(updated.assessments).toHaveLength(2);
    expect(updated.evidence).toHaveLength(6);
    expect(updated.assessments[1]).toEqual(
      expect.objectContaining({
        blueprintId: blueprint.id,
        blueprintVersion: "1",
        competencyId: "programming-typescript",
        level: "proficient",
        completedAt,
        trust: "local-deterministic",
      }),
    );
    expect(updated.updatedAt).toBe(completedAt);

    const competency = updated.competencies.find(
      (state) => state.competencyId === "programming-typescript",
    );
    expect(competency).toEqual(
      expect.objectContaining({
        level: "proficient",
        lastAssessedAt: completedAt,
      }),
    );
    expect(competency).not.toBe(profile.competencies[0]);
  });
});
