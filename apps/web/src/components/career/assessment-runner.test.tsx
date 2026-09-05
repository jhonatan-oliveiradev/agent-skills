import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type {
  AssessmentBlueprint,
  AssessmentResultArtifact,
} from "@/lib/career/assessment";
import { AssessmentResult } from "./assessment-result";
import { AssessmentRunner } from "./assessment-runner";

const completedAt = "2026-09-05T16:30:00.000Z";

const runnerBlueprint = {
  id: "baseline-javascript",
  version: "1",
  competencyId: "programming-javascript",
  targetLevel: "developing",
  dimensions: [{ id: "reasoning", label: "Code reasoning", required: true }],
  challenges: [
    {
      id: "challenge-one",
      dimensionId: "reasoning",
      kind: "single-choice",
      prompt: "Which boundary keeps this state local?",
      options: [
        { id: "answer-one-correct", label: "The component that owns the interaction" },
        { id: "answer-one-wrong", label: "A global variable" },
      ],
      correctOptionIds: ["answer-one-correct"],
      evidenceClass: "E2",
      demonstratedLevel: "developing",
      criterionIds: [
        "programming-javascript.foundation",
        "programming-javascript.developing",
      ],
    },
    {
      id: "challenge-two",
      dimensionId: "reasoning",
      kind: "code-reading-choice",
      prompt: "What should the function return when the input is absent?",
      options: [
        { id: "answer-two-correct", label: "An explicit empty result" },
        { id: "answer-two-wrong", label: "An untyped exception" },
      ],
      correctOptionIds: ["answer-two-correct"],
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

const result = {
  schemaVersion: "1",
  artifactType: "assessment-result",
  blueprintId: runnerBlueprint.id,
  blueprintVersion: "1",
  competencyId: "programming-javascript",
  completedAt,
  level: "developing",
  confidence: "low",
  dimensions: [
    {
      dimensionId: "reasoning",
      passed: true,
      passedChallengeIds: ["challenge-one"],
      failedChallengeIds: ["challenge-two"],
      observedSignals: ["Identified a local ownership boundary"],
    },
  ],
  evidence: [],
  gaps: ["Needs a debugging performance observation"],
  strongSignals: ["Identified a local ownership boundary"],
  weakSignals: ["No performance evidence yet"],
  recommendedNextEvidence: "Complete a deterministic debugging challenge.",
  provenance: { trust: "local-deterministic" },
} as const satisfies AssessmentResultArtifact;

describe("Assessment surfaces", () => {
  it("announces progress, preserves answers, supports keyboard events, and completes with collected responses", () => {
    const onComplete = vi.fn();
    render(<AssessmentRunner blueprint={runnerBlueprint} onComplete={onComplete} />);

    const progress = screen.getByRole("status");
    expect(progress).toHaveAttribute("aria-live", "polite");
    expect(progress).toHaveTextContent("Challenge 1 of 2");

    const firstAnswer = screen.getByRole("radio", {
      name: /the component that owns the interaction/i,
    });
    firstAnswer.focus();
    expect(document.activeElement).toBe(firstAnswer);
    fireEvent.keyDown(firstAnswer, { key: " ", code: "Space" });
    fireEvent.keyUp(firstAnswer, { key: " ", code: "Space" });
    expect(firstAnswer).toBeChecked();

    const next = screen.getByRole("button", { name: /next challenge/i });
    next.focus();
    fireEvent.keyDown(next, { key: "Enter", code: "Enter" });
    fireEvent.keyUp(next, { key: "Enter", code: "Enter" });
    expect(screen.getByRole("status")).toHaveTextContent("Challenge 2 of 2");

    const secondAnswer = screen.getByRole("radio", {
      name: /an explicit empty result/i,
    });
    fireEvent.keyDown(secondAnswer, { key: " ", code: "Space" });
    fireEvent.keyUp(secondAnswer, { key: " ", code: "Space" });

    fireEvent.click(screen.getByRole("button", { name: /previous challenge/i }));
    const returnedFirstAnswer = screen.getByRole("radio", {
      name: /the component that owns the interaction/i,
    });
    expect(returnedFirstAnswer).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: /next challenge/i }));
    fireEvent.click(screen.getByRole("button", { name: /complete assessment/i }));

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        blueprintId: runnerBlueprint.id,
        blueprintVersion: "1",
        answers: {
          "challenge-one": ["answer-one-correct"],
          "challenge-two": ["answer-two-correct"],
        },
      }),
    );
  });

  it("never serializes scoring keys or correct answer identifiers into the runner DOM", () => {
    const { container } = render(
      <AssessmentRunner blueprint={runnerBlueprint} onComplete={vi.fn()} />,
    );

    expect(container.innerHTML).not.toMatch(
      /correctOptionIds|answer-one-correct|answer-two-correct|evidenceClass/i,
    );
    expect(container.querySelector("[data-correct-option-ids]")).toBeNull();
    expect(container.querySelector("[data-answer-id]")).toBeNull();
  });

  it("presents level, confidence, signals, and next evidence without a celebratory percentage", () => {
    render(<AssessmentResult result={result} />);

    expect(screen.getByText(/developing/i)).toBeInTheDocument();
    expect(screen.getByText(/low confidence/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /strong signals/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /weak signals/i })).toBeInTheDocument();
    expect(
      screen.getByText(/complete a deterministic debugging challenge/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument();
  });
});
