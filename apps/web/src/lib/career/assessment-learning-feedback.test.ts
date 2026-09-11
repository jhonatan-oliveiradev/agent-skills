import { describe, expect, it } from "vitest";
import type { Locale } from "@/lib/locales";
import * as assessmentBlueprintModule from "./assessment-blueprints";
import { baselineAssessmentBlueprints } from "./assessment-blueprints";

type LearningFeedback = Readonly<{
  challengeId: string;
  correctOptionIds: readonly string[];
  rationale: string;
  optionExplanations: Readonly<Record<string, string>>;
  codeExample?: Readonly<{ language: string; code: string }>;
}>;

type LearningFeedbackResolver = (
  blueprint: (typeof baselineAssessmentBlueprints)[number],
  locale: Locale,
) => readonly LearningFeedback[];

function getResolver(): LearningFeedbackResolver {
  const candidate = (
    assessmentBlueprintModule as unknown as Record<string, unknown>
  ).getAssessmentLearningFeedbackForLocale;

  expect(candidate).toBeTypeOf("function");
  return candidate as LearningFeedbackResolver;
}

describe("Career Lab assessment learning feedback", () => {
  it("publishes a localized, complete pedagogical answer key for all 24 baseline challenges", () => {
    const resolveFeedback = getResolver();
    let challengeCount = 0;

    for (const blueprint of baselineAssessmentBlueprints) {
      for (const locale of ["en", "pt-BR"] as const) {
        const feedback = resolveFeedback(blueprint, locale);
        expect(feedback, `${blueprint.id}:${locale}`).toHaveLength(blueprint.challenges.length);

        for (const challenge of blueprint.challenges) {
          challengeCount += locale === "en" ? 1 : 0;
          const review = feedback.find((candidate) => candidate.challengeId === challenge.id);
          expect(review, `${blueprint.id}:${challenge.id}:${locale}`).toBeDefined();
          expect(review?.correctOptionIds).toEqual(challenge.correctOptionIds);
          expect(review?.rationale.trim().length).toBeGreaterThan(40);

          for (const option of challenge.options) {
            expect(
              review?.optionExplanations[option.id]?.trim().length,
              `${blueprint.id}:${challenge.id}:${option.id}:${locale}`,
            ).toBeGreaterThan(20);
          }
        }
      }
    }

    expect(challengeCount).toBe(24);
  });

  it("uses the canonical TypeScript answer ids while providing the approved discriminated-union teaching explanation", () => {
    const resolveFeedback = getResolver();
    const blueprint = baselineAssessmentBlueprints.find(
      (candidate) => candidate.id === "baseline-typescript",
    );
    expect(blueprint).toBeDefined();
    if (!blueprint) return;

    const challenge = blueprint.challenges[0];
    const review = resolveFeedback(blueprint, "pt-BR").find(
      (candidate) => candidate.challengeId === challenge.id,
    );

    expect(review?.correctOptionIds).toEqual(challenge.correctOptionIds);
    expect(review?.rationale).toMatch(/uni(ões|oes) discriminadas/i);
    expect(review?.codeExample?.language).toBe("typescript");
    expect(review?.codeExample?.code).toContain('status: "carregando"');
    expect(review?.optionExplanations.unsound).toMatch(/non-null/i);
    expect(review?.optionExplanations["any-state"]).toMatch(/any/i);
  });
});
