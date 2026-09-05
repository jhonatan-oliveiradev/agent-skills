import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type {
  AssessmentBlueprint,
  AssessmentResultArtifact,
} from "@/lib/career/assessment";
import { AssessmentResult } from "./assessment-result";
import { AssessmentRunner } from "./assessment-runner";

const runnerBlueprint = {
  id: "javascript-baseline",
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
    },
  ],
  gates: [],
} as AssessmentBlueprint;

const result = {
  schemaVersion: "1",
  artifactType: "assessment-result",
  blueprintId: runnerBlueprint.id,
  blueprintVersion: "1",
  competencyId: "programming-javascript",
  level: "developing",
  confidence: "low",
  dimensions: [
    {
      dimensionId: "reasoning",
      passed: true,
      observedSignals: ["Identified a local ownership boundary"],
    },
  ],
  evidence: [],
  gaps: ["Needs a debugging performance observation"],
  strongSignals: ["Identified a local ownership boundary"],
  weakSignals: ["No performance evidence yet"],
  recommendedNextEvidence: "Complete a deterministic debugging challenge.",
  provenance: { trust: "local-deterministic" },
} as AssessmentResultArtifact;

describe("Assessment surfaces", () => {
  it("announces progress semantically, preserves answers between challenges, and uses keyboard-reachable controls", () => {
    render(<AssessmentRunner blueprint={runnerBlueprint} onComplete={vi.fn()} />);

    const progress = screen.getByRole("status");
    expect(progress).toHaveAttribute("aria-live", "polite");
    expect(progress).toHaveTextContent("Challenge 1 of 2");

    const firstAnswer = screen.getByRole("radio", {
      name: /the component that owns the interaction/i,
    });
    expect(firstAnswer).toHaveAttribute("type", "radio");
    firstAnswer.focus();
    expect(document.activeElement).toBe(firstAnswer);
    fireEvent.click(firstAnswer);

    fireEvent.click(screen.getByRole("button", { name: /next challenge/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Challenge 2 of 2");

    fireEvent.click(
      screen.getByRole("radio", { name: /an explicit empty result/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /previous challenge/i }));

    expect(firstAnswer).toBeChecked();
  });

  it("never renders hidden scoring keys or correct-answer identifiers", () => {
    render(<AssessmentRunner blueprint={runnerBlueprint} onComplete={vi.fn()} />);

    expect(screen.queryByText(/answer-one-correct|answer-two-correct/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/correctOptionIds|evidenceClass/i)).not.toBeInTheDocument();
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
