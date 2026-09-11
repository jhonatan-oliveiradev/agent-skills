import { describe, expect, it } from "vitest";
import {
  applyAssessmentResult,
  evaluateAssessment,
  validateAssessmentBlueprint,
  type AssessmentBlueprint,
} from "./assessment";
import {
  baselineAssessmentBlueprints,
  getPublicAssessmentBlueprintForLocale,
} from "./assessment-blueprints";
import { createEmptyCareerProfile } from "./profile";

const completedAt = "2026-09-11T12:00:00.000Z";

const gatedBlueprint = {
  id: "baseline-gate-cap-regression",
  version: "1",
  competencyId: "programming-javascript",
  targetLevel: "developing",
  dimensions: [{ id: "reasoning", label: "Reasoning", required: true }],
  challenges: [
    {
      id: "reasoning-pass",
      dimensionId: "reasoning",
      kind: "code-reading-choice",
      prompt: "Choose the sound state boundary.",
      options: [
        { id: "correct", label: "Keep ownership local" },
        { id: "wrong", label: "Use a mutable global" },
      ],
      correctOptionIds: ["correct"],
      evidenceClass: "E2",
      demonstratedLevel: "developing",
      criterionIds: [
        "programming-javascript.foundation",
        "programming-javascript.developing",
      ],
    },
    {
      id: "reasoning-fail",
      dimensionId: "reasoning",
      kind: "debugging-choice",
      prompt: "Choose the sound async fix.",
      options: [
        { id: "correct", label: "Guard the latest request" },
        { id: "wrong", label: "Ignore ordering" },
      ],
      correctOptionIds: ["correct"],
      evidenceClass: "E2",
      demonstratedLevel: "developing",
      criterionIds: [
        "programming-javascript.foundation",
        "programming-javascript.developing",
      ],
    },
  ],
  gates: [],
} as const satisfies AssessmentBlueprint;

describe("baseline assessment depth", () => {
  it("keeps each baseline short while providing multi-format diagnostic depth", () => {
    for (const blueprint of baselineAssessmentBlueprints) {
      expect(() => validateAssessmentBlueprint(blueprint)).not.toThrow();
      expect(blueprint.challenges, blueprint.id).toHaveLength(4);
      expect(new Set(blueprint.challenges.map((challenge) => challenge.kind)).size, blueprint.id)
        .toBeGreaterThanOrEqual(3);
      expect(
        blueprint.challenges.some((challenge) => challenge.kind === "multi-select"),
        blueprint.id,
      ).toBe(true);
      expect(
        blueprint.challenges.some((challenge) => challenge.kind === "structured-ordering"),
        blueprint.id,
      ).toBe(true);
      for (const challenge of blueprint.challenges) {
        expect(challenge.options.length, `${blueprint.id}:${challenge.id}`).toBeGreaterThanOrEqual(4);
      }
      expect(blueprint.gates, blueprint.id).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            minimumPassedChallenges: 3,
            requiredForLevel: "developing",
          }),
        ]),
      );
    }
  });

  it("localizes every baseline challenge and option set in PT-BR", () => {
    for (const blueprint of baselineAssessmentBlueprints) {
      const english = getPublicAssessmentBlueprintForLocale(blueprint, "en");
      const portuguese = getPublicAssessmentBlueprintForLocale(blueprint, "pt-BR");

      expect(portuguese.challenges).toHaveLength(english.challenges.length);
      for (const [index, challenge] of portuguese.challenges.entries()) {
        const englishChallenge = english.challenges[index];
        expect(challenge.prompt, `${blueprint.id}:${challenge.id}`).not.toBe(englishChallenge.prompt);
        expect(challenge.options).toHaveLength(englishChallenge.options.length);
        expect(
          challenge.options.some(
            (option, optionIndex) => option.label !== englishChallenge.options[optionIndex]?.label,
          ),
          `${blueprint.id}:${challenge.id}`,
        ).toBe(true);
      }
    }
  });

  it("does not let a passed observation bypass a failed required assessment gate", () => {
    const result = evaluateAssessment(gatedBlueprint, {
      blueprintId: gatedBlueprint.id,
      blueprintVersion: gatedBlueprint.version,
      completedAt,
      answers: {
        "reasoning-pass": ["correct"],
        "reasoning-fail": ["wrong"],
      },
    });
    expect(result.level).toBe("foundation");

    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      now: "2026-09-11T11:00:00.000Z",
    });
    const updated = applyAssessmentResult(profile, result);
    const state = updated.competencies.find(
      (candidate) => candidate.competencyId === gatedBlueprint.competencyId,
    );

    expect(state?.level).toBe("foundation");
  });
});
