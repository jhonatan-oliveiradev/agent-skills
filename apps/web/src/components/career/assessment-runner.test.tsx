import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type {
  AssessmentBlueprint,
  AssessmentResultArtifact,
} from "@/lib/career/assessment";
import {
  baselineAssessmentBlueprints,
  getPublicAssessmentBlueprintForLocale,
} from "@/lib/career/assessment-blueprints";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import type { CareerProfile } from "@/lib/career/types";
import { AssessmentResult } from "./assessment-result";
import { AssessmentDetailSurface, AssessmentRunner } from "./assessment-runner";
import { CareerProfileProvider } from "./career-profile-provider";

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

function storageHarness(profile: CareerProfile) {
  const save = vi.fn().mockResolvedValue(undefined);
  const storage: CareerStorage = {
    load: vi.fn().mockResolvedValue(profile),
    save,
    clear: vi.fn().mockResolvedValue(undefined),
  };
  return { storage, save };
}

async function completeJavascriptAttempt(options: Readonly<{ incorrectFirst?: boolean }> = {}) {
  const canonical = baselineAssessmentBlueprints.find(
    (candidate) => candidate.id === "baseline-javascript",
  );
  if (!canonical) throw new Error("Expected JavaScript baseline blueprint");
  const localized = getPublicAssessmentBlueprintForLocale(canonical, "en");

  await screen.findByRole("status");

  for (const [index, challenge] of canonical.challenges.entries()) {
    const publicChallenge = localized.challenges[index];
    if (!publicChallenge) throw new Error("Expected localized challenge");

    const selectedIds = index === 0 && options.incorrectFirst
      ? [publicChallenge.options.find((option) => !challenge.correctOptionIds.includes(option.id))?.id]
          .filter((id): id is string => Boolean(id))
      : challenge.correctOptionIds;

    for (const optionId of selectedIds) {
      const option = publicChallenge.options.find((candidate) => candidate.id === optionId);
      if (!option) throw new Error("Expected selected option");
      const role = challenge.kind === "structured-ordering"
        ? "button"
        : challenge.kind === "multi-select"
          ? "checkbox"
          : "radio";
      fireEvent.click(screen.getByRole(role, { name: option.label }));
    }

    fireEvent.click(screen.getByRole("button", { name: /^answer$/i }));
    if (index < canonical.challenges.length - 1) {
      fireEvent.click(screen.getByRole("button", { name: /next challenge/i }));
    }
  }

  fireEvent.click(screen.getByRole("button", { name: /complete assessment/i }));
}

describe("Assessment surfaces", () => {
  it("uses native, accessible, focusable controls while preserving answers and completing with collected responses", () => {
    const onComplete = vi.fn();
    render(<AssessmentRunner blueprint={runnerBlueprint} onComplete={onComplete} />);

    const progress = screen.getByRole("status");
    expect(progress).toHaveAttribute("aria-live", "polite");
    expect(progress).toHaveTextContent("Challenge 1 of 2");

    const firstAnswer = screen.getByRole("radio", {
      name: /the component that owns the interaction/i,
    });
    expect(firstAnswer.tagName).toBe("INPUT");
    expect(firstAnswer).toHaveAttribute("type", "radio");
    expect(firstAnswer).not.toHaveAttribute("tabindex", "-1");
    firstAnswer.focus();
    expect(document.activeElement).toBe(firstAnswer);
    fireEvent.click(firstAnswer);

    const next = screen.getByRole("button", { name: /next challenge/i });
    expect(next.tagName).toBe("BUTTON");
    expect(next).toHaveAttribute("type", "button");
    expect(next).not.toBeDisabled();
    expect(next).not.toHaveAttribute("tabindex", "-1");
    next.focus();
    expect(document.activeElement).toBe(next);
    fireEvent.click(next);
    expect(screen.getByRole("status")).toHaveTextContent("Challenge 2 of 2");

    const secondAnswer = screen.getByRole("radio", {
      name: /an explicit empty result/i,
    });
    expect(secondAnswer.tagName).toBe("INPUT");
    expect(secondAnswer).toHaveAttribute("type", "radio");
    secondAnswer.focus();
    expect(document.activeElement).toBe(secondAnswer);
    fireEvent.click(secondAnswer);

    const previous = screen.getByRole("button", { name: /previous challenge/i });
    expect(previous.tagName).toBe("BUTTON");
    expect(previous).toHaveAttribute("type", "button");
    expect(previous).not.toBeDisabled();
    fireEvent.click(previous);
    const returnedFirstAnswer = screen.getByRole("radio", {
      name: /the component that owns the interaction/i,
    });
    expect(returnedFirstAnswer).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: /next challenge/i }));
    const complete = screen.getByRole("button", { name: /complete assessment/i });
    expect(complete.tagName).toBe("BUTTON");
    expect(complete).toHaveAttribute("type", "button");
    expect(complete).not.toBeDisabled();
    fireEvent.click(complete);

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

  it("exposes a stable editorial structure and selected state for assessment styling", () => {
    const { container } = render(
      <AssessmentRunner blueprint={runnerBlueprint} onComplete={vi.fn()} />,
    );

    expect(container.querySelector(".career-assessment-runner__header")).toBeInTheDocument();
    expect(container.querySelector(".career-assessment-runner__options")).toBeInTheDocument();
    expect(container.querySelector(".career-assessment-runner__actions")).toBeInTheDocument();

    const radio = screen.getByRole("radio", {
      name: /the component that owns the interaction/i,
    });
    const option = radio.closest("label");
    expect(option).toHaveClass("career-assessment-runner__option");
    expect(option).toHaveAttribute("data-selected", "false");

    fireEvent.click(radio);
    expect(option).toHaveAttribute("data-selected", "true");
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
    const { container } = render(<AssessmentResult result={result} />);

    expect(screen.getByText(/developing/i)).toBeInTheDocument();
    expect(screen.getByText(/low confidence/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /demonstrated/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /strengthen next/i })).toBeInTheDocument();
    expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument();
    expect(container.querySelector(".career-assessment-result__summary")).toBeInTheDocument();
  });

  it("Review challenges is same-session read-only and Back to result does not save again", async () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      now: "2026-09-12T12:00:00.000Z",
    });
    const { storage, save } = storageHarness(profile);
    render(
      <CareerProfileProvider storage={storage}>
        <AssessmentDetailSurface locale="en" blueprintId="baseline-javascript" />
      </CareerProfileProvider>,
    );

    await completeJavascriptAttempt({ incorrectFirst: true });
    expect(await screen.findByRole("heading", { name: "Diagnosis" })).toBeInTheDocument();
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole("button", { name: "Review challenges" }));
    expect(screen.getByRole("heading", { name: "Review challenges" })).toBeInTheDocument();
    expect(save).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Back to result" }));
    expect(screen.getByRole("heading", { name: "Diagnosis" })).toBeInTheDocument();
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("Try again returns to challenge 1 with a fresh runner while preserving the completed AssessmentRecord", async () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      now: "2026-09-12T12:00:00.000Z",
    });
    const { storage, save } = storageHarness(profile);
    const random = vi.spyOn(Math, "random").mockReturnValue(0);

    try {
      render(
        <CareerProfileProvider storage={storage}>
          <AssessmentDetailSurface locale="en" blueprintId="baseline-javascript" />
        </CareerProfileProvider>,
      );

      await completeJavascriptAttempt();
      expect(await screen.findByRole("heading", { name: "Diagnosis" })).toBeInTheDocument();
      await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
      const randomCallsBeforeRetry = random.mock.calls.length;
      const persisted = save.mock.calls[0]?.[0] as CareerProfile | undefined;
      expect(persisted?.assessments).toHaveLength(1);

      fireEvent.click(screen.getByRole("button", { name: "Try again" }));

      expect(await screen.findByRole("status")).toHaveTextContent("Challenge 1 of 4");
      expect(random.mock.calls.length).toBeGreaterThan(randomCallsBeforeRetry);
      expect(save).toHaveBeenCalledTimes(1);
      expect((save.mock.calls[0]?.[0] as CareerProfile).assessments).toHaveLength(1);
    } finally {
      random.mockRestore();
    }
  });
});
