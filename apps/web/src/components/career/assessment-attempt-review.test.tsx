import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  baselineAssessmentBlueprints,
  getPublicAssessmentBlueprintForLocale,
} from "@/lib/career/assessment-blueprints";
import { getAssessmentLearningFeedbackForLocale } from "@/lib/career/assessment-learning-feedback";
import type { AssessmentResponses } from "@/lib/career/assessment";
import { AssessmentAttemptReview } from "./assessment-attempt-review";

const blueprint = baselineAssessmentBlueprints.find(
  (candidate) => candidate.id === "baseline-typescript",
);
if (!blueprint) throw new Error("Expected TypeScript baseline blueprint");

const publicBlueprint = getPublicAssessmentBlueprintForLocale(blueprint, "en");
const feedback = getAssessmentLearningFeedbackForLocale(blueprint, "en");

const responses: AssessmentResponses = {
  blueprintId: blueprint.id,
  blueprintVersion: blueprint.version,
  completedAt: "2026-09-12T12:00:00.000Z",
  answers: {
    "baseline-typescript-question": ["unsound"],
    "baseline-typescript-debugging": ["narrow"],
    "baseline-typescript-multi-select": ["unknown-first", "exhaustive"],
    "baseline-typescript-ordering": ["receive", "validate", "narrow-variant", "use"],
  },
};

describe("AssessmentAttemptReview", () => {
  it("renders the completed attempt read-only with selected answers, semantic correctness, and explanations", () => {
    render(
      <AssessmentAttemptReview
        blueprint={publicBlueprint}
        responses={responses}
        learningFeedback={feedback}
        locale="en"
        onBack={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Review challenges" })).toBeInTheDocument();
    expect(screen.getAllByText("Incorrect").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Correct").length).toBeGreaterThan(0);
    expect(screen.getByText("A non-null assertion")).toBeInTheDocument();
    expect(
      screen.getByText(/discriminated unions model the exact valid application states/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/type State =/i)).toBeInTheDocument();

    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /receive the value as unknown/i })).not.toBeInTheDocument();
  });

  it("returns to the result through one explicit read-only review action", () => {
    const onBack = vi.fn();
    render(
      <AssessmentAttemptReview
        blueprint={publicBlueprint}
        responses={responses}
        learningFeedback={feedback}
        locale="en"
        onBack={onBack}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Back to result" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
