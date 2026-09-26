import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AssessmentResultArtifact } from "@/lib/career/assessment";
import type { LearningRecommendation } from "@/lib/career/learning-recommendations";
import { AssessmentResult } from "./assessment-result";

const result: AssessmentResultArtifact = {
  schemaVersion: "1",
  artifactType: "assessment-result",
  blueprintId: "baseline-typescript",
  blueprintVersion: "1",
  competencyId: "programming-typescript",
  completedAt: "2026-09-12T12:00:00.000Z",
  level: "foundation",
  confidence: "low",
  dimensions: [
    {
      dimensionId: "reasoning",
      passed: false,
      passedChallengeIds: [],
      failedChallengeIds: ["baseline-typescript-question"],
      observedSignals: [],
    },
  ],
  evidence: [],
  gaps: ["opaque gap text that must not drive the UI"],
  strongSignals: ["Preserved an explicit runtime boundary"],
  weakSignals: ["Needs stronger state modeling"],
  recommendedNextEvidence: "Retake a focused deterministic challenge.",
  provenance: { trust: "local-deterministic" },
};

function renderResult(
  recommendation?: LearningRecommendation | null,
  locale: "en" | "pt-BR" = "en",
) {
  return render(
    <AssessmentResult
      result={result}
      locale={locale}
      recommendation={recommendation}
      onReview={vi.fn()}
      onRetry={vi.fn()}
    />,
  );
}

describe("AssessmentResult v2", () => {
  it("shows Diagnosis, Demonstrated, Strengthen next, and Your next step in that order", () => {
    const { container } = renderResult(null);
    const headings = Array.from(
      container.querySelectorAll(".career-assessment-result__section > h2"),
      (node) => node.textContent,
    );

    expect(headings.slice(0, 4)).toEqual([
      "Diagnosis",
      "Demonstrated",
      "Strengthen next",
      "Your next step",
    ]);
    expect(screen.getByText(/foundation/i)).toBeInTheDocument();
    expect(screen.getByText(/low confidence/i)).toBeInTheDocument();
    expect(
      screen.getByText(/uses structural types, unions, narrowing, and function contracts safely/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("programming-typescript.foundation")).not.toBeInTheDocument();
  });

  it("uses Study now as the primary CTA when the assessment recommendation maps to reviewed learning", () => {
    renderResult(undefined);

    const nextStep = screen.getByRole("region", { name: "Your next step" });
    const study = within(nextStep).getByRole("link", { name: "Study now" });
    expect(study).toHaveAttribute(
      "href",
      "/en/career-lab/learning/typescript-application-modeling#programming-typescript-foundation",
    );
    expect(study).toHaveClass("career-assessment-result__primary-action");
  });

  it("shows a proof CTA instead of restudy when the recommendation kind is prove", () => {
    renderResult({
      kind: "prove",
      competencyId: "programming-typescript",
      criterionId: "programming-typescript.foundation",
      reason: "studied-not-proved",
      priority: 400,
      destination: "assessment",
    });

    const nextStep = screen.getByRole("region", { name: "Your next step" });
    expect(within(nextStep).queryByRole("link", { name: "Study now" })).not.toBeInTheDocument();
    expect(within(nextStep).getByRole("link", { name: "Prove with assessment" })).toHaveAttribute(
      "href",
      "/en/career-lab/assessments",
    );
  });

  it("links Back to assessments directly to the locale assessment index", () => {
    renderResult(null, "pt-BR");

    expect(screen.getByRole("link", { name: "Voltar para avaliações" })).toHaveAttribute(
      "href",
      "/pt-BR/career-lab/assessments",
    );
  });
});
