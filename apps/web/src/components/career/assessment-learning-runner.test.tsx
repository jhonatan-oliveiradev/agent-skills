import type { ComponentProps, ComponentType } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PublicAssessmentBlueprint } from "@/lib/career/assessment";
import { AssessmentRunner } from "./assessment-runner";

type LearningFeedback = Readonly<{
  challengeId: string;
  correctOptionIds: readonly string[];
  rationale: string;
  optionExplanations: Readonly<Record<string, string>>;
  codeExample?: Readonly<{ language: string; code: string }>;
}>;

type LearningRunnerProps = ComponentProps<typeof AssessmentRunner> & Readonly<{
  learningFeedback: readonly LearningFeedback[];
}>;

const LearningRunner = AssessmentRunner as unknown as ComponentType<LearningRunnerProps>;

function blueprintWith(
  kind: PublicAssessmentBlueprint["challenges"][number]["kind"],
  options: readonly { id: string; label: string }[],
  requiredSelectionCount?: number,
): PublicAssessmentBlueprint {
  return {
    id: `baseline-test-${kind}`,
    version: "1",
    competencyId: "programming-typescript",
    targetLevel: "developing",
    dimensions: [{ id: "reasoning", label: "Reasoning", required: true }],
    challenges: [
      {
        id: `challenge-${kind}`,
        dimensionId: "reasoning",
        kind,
        prompt: kind === "multi-select" ? "Which practices are sound?" : "Choose the sound answer.",
        options,
        ...(requiredSelectionCount === undefined ? {} : { requiredSelectionCount }),
      } as PublicAssessmentBlueprint["challenges"][number],
    ],
  };
}

const choiceOptions = [
  { id: "correct", label: "A discriminated union" },
  { id: "wrong-non-null", label: "A non-null assertion" },
  { id: "wrong-any", label: "An any object" },
  { id: "wrong-optional", label: "An all-optional interface" },
] as const;

const singleFeedback = [
  {
    challengeId: "challenge-code-reading-choice",
    correctOptionIds: ["correct"],
    rationale: "Discriminated unions model the exact valid states and make impossible combinations unrepresentable.",
    optionExplanations: {
      correct: "The discriminant narrows the exact fields that are valid for each state.",
      "wrong-non-null": "A non-null assertion only suppresses a nullability check; it does not model valid states.",
      "wrong-any": "Using any disables the type guarantees that this boundary needs.",
      "wrong-optional": "Making everything optional permits contradictory or incomplete combinations.",
    },
    codeExample: {
      language: "typescript",
      code: 'type State =\n  | { status: "loading" }\n  | { status: "success"; data: string };',
    },
  },
] as const;

describe("AssessmentRunner learning flow", () => {
  it("locks the submitted answer, gives immediate semantic correctness feedback, and keeps the explanation out of the DOM until reveal", () => {
    const blueprint = blueprintWith("code-reading-choice", choiceOptions);
    const { container } = render(
      <LearningRunner
        blueprint={blueprint}
        learningFeedback={singleFeedback}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.queryByText(/discriminated unions model the exact valid states/i)).toBeNull();
    fireEvent.click(screen.getByRole("radio", { name: /non-null assertion/i }));

    const submit = screen.getByRole("button", { name: /answer|respond/i });
    fireEvent.click(submit);

    expect(screen.getByRole("status", { name: /answer feedback/i })).toHaveTextContent(
      /incorrect|incorreta/i,
    );
    expect(container.querySelector('[data-feedback="incorrect"]')).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /non-null assertion/i })).toBeDisabled();
    expect(screen.getByRole("radio", { name: /discriminated union/i })).toBeDisabled();
    expect(screen.queryByText(/discriminated unions model the exact valid states/i)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /reveal answer|revelar resposta/i }));
    expect(screen.getByText(/discriminated unions model the exact valid states/i)).toBeInTheDocument();
    expect(screen.getByText(/type State =/i)).toBeInTheDocument();
    expect(container.querySelector('[data-answer-state="correct"]')).toBeInTheDocument();
    expect(container.querySelector('[data-answer-state="incorrect"]')).toBeInTheDocument();
  });

  it("makes multiple-answer requirements explicit before submission", () => {
    const blueprint = blueprintWith(
      "multi-select",
      [
        { id: "a", label: "Validate unknown input" },
        { id: "b", label: "Handle variants exhaustively" },
        { id: "c", label: "Cast everything" },
        { id: "d", label: "Use any" },
      ],
      2,
    );

    render(
      <LearningRunner
        blueprint={blueprint}
        learningFeedback={[
          {
            challengeId: "challenge-multi-select",
            correctOptionIds: ["a", "b"],
            rationale: "Both validation and exhaustive handling preserve the typed boundary.",
            optionExplanations: {
              a: "Validation converts untrusted input into a checked value.",
              b: "Exhaustive handling covers every known discriminated variant.",
              c: "A cast asserts a type without proving the runtime shape.",
              d: "Any removes the guarantees that the boundary is meant to provide.",
            },
          },
        ]}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByText(/select 2 answers|selecione 2 respostas/i)).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
  });

  it("shuffles presentation order once per attempt, including structured ordering, without reshuffling on rerender", () => {
    const orderingOptions = [
      { id: "one", label: "Receive as unknown" },
      { id: "two", label: "Validate shape" },
      { id: "three", label: "Narrow variant" },
      { id: "four", label: "Use typed fields" },
    ] as const;
    const blueprint = blueprintWith("structured-ordering", orderingOptions);
    const props: LearningRunnerProps = {
      blueprint,
      learningFeedback: [
        {
          challengeId: "challenge-structured-ordering",
          correctOptionIds: ["one", "two", "three", "four"],
          rationale: "The safe flow validates unknown data before typed use.",
          optionExplanations: {
            one: "Unknown is the honest type at an untrusted boundary.",
            two: "Runtime validation proves the required shape.",
            three: "Narrowing selects the relevant validated variant.",
            four: "Typed fields are safe to use only after the prior checks.",
          },
        },
      ],
      onComplete: vi.fn(),
    };

    const { container, rerender } = render(<LearningRunner {...props} />);
    const displayed = Array.from(
      container.querySelectorAll(".career-assessment-runner__option-copy"),
      (node) => node.textContent,
    );
    expect(displayed).not.toEqual(orderingOptions.map((option) => option.label));

    rerender(<LearningRunner {...props} />);
    const displayedAgain = Array.from(
      container.querySelectorAll(".career-assessment-runner__option-copy"),
      (node) => node.textContent,
    );
    expect(displayedAgain).toEqual(displayed);
  });
});
