import { describe, expect, it } from "vitest";
import {
  evaluateAssessment,
  type AssessmentBlueprint,
} from "./assessment";

const blueprint = {
  id: "typescript-baseline",
  version: "1",
  competencyId: "programming-typescript",
  targetLevel: "proficient",
  dimensions: [
    {
      id: "theory",
      label: "Concept knowledge",
      required: false,
    },
    {
      id: "performance",
      label: "Debugging performance",
      required: true,
    },
  ],
  challenges: [
    {
      id: "theory-narrowing",
      dimensionId: "theory",
      kind: "single-choice",
      prompt: "Which TypeScript construct narrows a discriminated union?",
      options: [
        { id: "theory-correct", label: "A discriminant check" },
        { id: "theory-wrong", label: "A type assertion" },
      ],
      correctOptionIds: ["theory-correct"],
      evidenceClass: "E1",
    },
    {
      id: "performance-bug",
      dimensionId: "performance",
      kind: "debugging-choice",
      prompt: "Choose the change that fixes the unsafe property access.",
      options: [
        { id: "performance-correct", label: "Narrow before accessing the property" },
        { id: "performance-wrong", label: "Cast the value to any" },
      ],
      correctOptionIds: ["performance-correct"],
      evidenceClass: "E3",
    },
  ],
  gates: [
    {
      dimensionId: "performance",
      minimumPassedChallenges: 1,
      requiredForLevel: "proficient",
    },
  ],
} as AssessmentBlueprint;

function responses(
  answers: Record<string, readonly string[]>,
  blueprintVersion = "1",
) {
  return {
    blueprintId: blueprint.id,
    blueprintVersion,
    answers,
  };
}

describe("evidence-gated assessment evaluation", () => {
  it("cannot reach proficient by averaging high theory over failed required performance", () => {
    const result = evaluateAssessment(
      blueprint,
      responses({
        "theory-narrowing": ["theory-correct"],
        "performance-bug": ["performance-wrong"],
      }),
    );

    expect(result.level).toBe("developing");
    expect(result.dimensions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ dimensionId: "theory", passed: true }),
        expect.objectContaining({ dimensionId: "performance", passed: false }),
      ]),
    );
  });

  it("keeps level and confidence separate for a sparse passing assessment", () => {
    const sparseBlueprint = {
      ...blueprint,
      challenges: [blueprint.challenges[1]],
      dimensions: [blueprint.dimensions[1]],
    } as AssessmentBlueprint;

    const result = evaluateAssessment(
      sparseBlueprint,
      {
        blueprintId: sparseBlueprint.id,
        blueprintVersion: "1",
        answers: { "performance-bug": ["performance-correct"] },
      },
    );

    expect(result.level).toBe("proficient");
    expect(result.confidence).toBe("low");
  });

  it("rejects a missing or invalid challenge response instead of inventing evidence", () => {
    expect(() =>
      evaluateAssessment(
        blueprint,
        responses({ "theory-narrowing": ["theory-correct"] }),
      ),
    ).toThrow(/missing response.*performance-bug/i);

    expect(() =>
      evaluateAssessment(
        blueprint,
        responses({
          "theory-narrowing": ["not-an-option"],
          "performance-bug": ["performance-correct"],
        }),
      ),
    ).toThrow(/invalid response.*theory-narrowing/i);
  });

  it("rejects results submitted against a different blueprint version", () => {
    expect(() =>
      evaluateAssessment(
        blueprint,
        responses(
          {
            "theory-narrowing": ["theory-correct"],
            "performance-bug": ["performance-correct"],
          },
          "99",
        ),
      ),
    ).toThrow(/blueprint version mismatch/i);
  });
});
