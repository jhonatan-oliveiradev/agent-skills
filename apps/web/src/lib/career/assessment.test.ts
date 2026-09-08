import { describe, expect, it } from "vitest";
import { deriveEvidenceConfidence } from "./evidence";
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

function dimensionFor(
  result: ReturnType<typeof evaluateAssessment>,
  dimensionId: string,
) {
  return result.dimensions.find((dimension) => dimension.dimensionId === dimensionId);
}

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
    expect(dimensionFor(failedPerformance, "performance")).toEqual(
      expect.objectContaining({
        passed: false,
        failedChallengeIds: ["performance-debugging"],
      }),
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

  it("produces a complete, traceable local deterministic Assessment Result Artifact", () => {
    const result = evaluateAssessment(blueprint, responses(passingAnswers));

    expect(result).toEqual(
      expect.objectContaining({
        schemaVersion: "1",
        artifactType: "assessment-result",
        blueprintId: blueprint.id,
        blueprintVersion: blueprint.version,
        competencyId: blueprint.competencyId,
        completedAt,
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
    for (const record of result.evidence) {
      expect(record).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          competencyId: blueprint.competencyId,
          sourceType: "assessment",
          trust: "local-deterministic",
          observedAt: completedAt,
          summary: expect.any(String),
          demonstratedLevel: expect.any(String),
          criterionIds: expect.any(Array),
        }),
      );
      expect(record.criterionIds).not.toHaveLength(0);
    }
  });

  it("accepts multi-select answers in a different order but keeps structured ordering order-sensitive", () => {
    const reorderedMultiSelect = evaluateAssessment(
      blueprint,
      responses({
        ...passingAnswers,
        "theory-multi-select": ["multi-second-correct", "multi-first-correct"],
      }),
    );
    const reorderedSteps = evaluateAssessment(
      blueprint,
      responses({
        ...passingAnswers,
        "reasoning-structured-ordering": [
          "ordering-second",
          "ordering-first",
          "ordering-third",
        ],
      }),
    );

    expect(dimensionFor(reorderedMultiSelect, "theory")).toEqual(
      expect.objectContaining({
        passedChallengeIds: expect.arrayContaining(["theory-multi-select"]),
      }),
    );
    expect(dimensionFor(reorderedSteps, "reasoning")).toEqual(
      expect.objectContaining({
        failedChallengeIds: expect.arrayContaining(["reasoning-structured-ordering"]),
      }),
    );
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

  it("rejects an omitted response, then separately rejects an empty or invalid response", () => {
    const withoutPerformance: Record<string, readonly string[]> = {
      ...passingAnswers,
    };
    delete withoutPerformance["performance-debugging"];

    expect(() =>
      evaluateAssessment(blueprint, responses(withoutPerformance)),
    ).toThrow(/missing response.*performance-debugging/i);

    expect(() =>
      evaluateAssessment(
        blueprint,
        responses({ ...passingAnswers, "performance-debugging": [] }),
      ),
    ).toThrow(/empty response.*performance-debugging/i);

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

  it("fails closed for invalid blueprint relationships and evidence requirements", () => {
    const invalidChallengeDimension = {
      ...blueprint,
      challenges: [
        { ...blueprint.challenges[0], dimensionId: "missing-dimension" },
        ...blueprint.challenges.slice(1),
      ],
    } as const satisfies AssessmentBlueprint;
    const invalidGateDimension = {
      ...blueprint,
      gates: [{ ...blueprint.gates[0], dimensionId: "missing-dimension" }],
    } as const satisfies AssessmentBlueprint;
    const invalidCorrectOption = {
      ...blueprint,
      challenges: [
        { ...blueprint.challenges[0], correctOptionIds: ["outside-options"] },
        ...blueprint.challenges.slice(1),
      ],
    } as const satisfies AssessmentBlueprint;
    const invalidEvidenceRequirement = {
      ...blueprint,
      challenges: [
        { ...blueprint.challenges[0], criterionIds: [] },
        ...blueprint.challenges.slice(1),
      ],
    } as const satisfies AssessmentBlueprint;

    expect(() => validateAssessmentBlueprint(invalidChallengeDimension)).toThrow(
      /dimension.*missing|unknown dimension/i,
    );
    expect(() => validateAssessmentBlueprint(invalidGateDimension)).toThrow(
      /gate.*dimension|unknown dimension/i,
    );
    expect(() => validateAssessmentBlueprint(invalidCorrectOption)).toThrow(
      /correct option.*outside|option.*not found/i,
    );
    expect(() => validateAssessmentBlueprint(invalidEvidenceRequirement)).toThrow(
      /criterion.*non-empty|evidence requirement/i,
    );
  });

  it("rejects duplicate challenge IDs and response submissions for another blueprint version", () => {
    const duplicateChallengeBlueprint = {
      ...blueprint,
      challenges: [...blueprint.challenges, blueprint.challenges[0]],
    } as const satisfies AssessmentBlueprint;

    expect(() => validateAssessmentBlueprint(duplicateChallengeBlueprint)).toThrow(
      /duplicate challenge id/i,
    );
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

  it("applies result evidence append-only and derives state/confidence from that evidence", () => {
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
    const historicEvidenceSnapshot = structuredClone(profile.evidence);
    const historicAssessmentSnapshot = structuredClone(profile.assessments);
    const historicCompetencySnapshot = structuredClone(profile.competencies);
    const result = evaluateAssessment(blueprint, responses(passingAnswers));
    const resultWithCopiedConfidence = {
      ...result,
      confidence: "high",
    } satisfies typeof result;

    const updated = applyAssessmentResult(profile, resultWithCopiedConfidence);
    const appendedEvidence = updated.evidence.slice(profile.evidence.length);
    const appendedEvidenceIds = result.evidence.map((record) => record.id);
    const expectedConfidence = deriveEvidenceConfidence(
      [...profile.evidence, ...result.evidence],
      new Date(completedAt),
    );

    expect(profile.evidence).toEqual(historicEvidenceSnapshot);
    expect(profile.assessments).toEqual(historicAssessmentSnapshot);
    expect(profile.competencies).toEqual(historicCompetencySnapshot);
    expect(updated.evidence).not.toBe(profile.evidence);
    expect(updated.evidence[0]).toBe(historicEvidence);
    expect(updated.assessments).not.toBe(profile.assessments);
    expect(updated.assessments[0]).toBe(historicAssessment);

    expect(appendedEvidence).toEqual(result.evidence);
    for (const record of appendedEvidence) {
      expect(record).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          class: expect.any(String),
          trust: "local-deterministic",
          sourceType: "assessment",
          summary: expect.any(String),
          demonstratedLevel: expect.any(String),
          criterionIds: expect.any(Array),
        }),
      );
    }
    expect(updated.assessments[1]).toEqual(
      expect.objectContaining({
        blueprintId: blueprint.id,
        blueprintVersion: "1",
        competencyId: "programming-typescript",
        level: "proficient",
        completedAt,
        trust: "local-deterministic",
        evidenceIds: appendedEvidenceIds,
      }),
    );
    expect(updated.updatedAt).toBe(completedAt);

    const competency = updated.competencies.find(
      (state) => state.competencyId === "programming-typescript",
    );
    expect(competency).toEqual(
      expect.objectContaining({
        level: "proficient",
        confidence: expectedConfidence,
        evidenceIds: ["evidence-existing", ...appendedEvidenceIds],
        lastAssessedAt: completedAt,
      }),
    );
    expect(competency?.confidence).not.toBe(resultWithCopiedConfidence.confidence);
    expect(competency).not.toBe(profile.competencies[0]);
  });
});
