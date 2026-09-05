import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AssessmentBlueprint } from "@/lib/career/assessment";
import {
  AssessmentDetailRoute,
} from "@/app/[locale]/career-lab/assessments/[id]/page";
import {
  AssessmentListPage,
} from "@/app/[locale]/career-lab/assessments/page";
import { CareerOnboarding } from "./career-onboarding";

const baselineBlueprint = {
  id: "baseline-javascript",
  version: "1",
  competencyId: "programming-javascript",
  targetLevel: "developing",
  dimensions: [{ id: "reasoning", label: "Code reasoning", required: true }],
  challenges: [
    {
      id: "baseline-question",
      dimensionId: "reasoning",
      kind: "single-choice",
      prompt: "Pick the explicit branch.",
      options: [
        { id: "safe-answer", label: "The explicit branch" },
        { id: "unsafe-answer", label: "The implicit branch" },
      ],
      correctOptionIds: ["safe-answer"],
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

describe("Assessment discovery, routes, and baseline handoff", () => {
  it("renders the list route with blueprint links", () => {
    render(<AssessmentListPage locale="en" blueprints={[baselineBlueprint]} />);

    expect(
      screen.getByRole("heading", { name: /baseline assessment/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /javascript/i }),
    ).toHaveAttribute(
      "href",
      "/en/career-lab/assessments/baseline-javascript",
    );
  });

  it("renders the detail route with its blueprint runner and a result after completion", () => {
    render(<AssessmentDetailRoute locale="en" blueprint={baselineBlueprint} />);

    fireEvent.click(
      screen.getByRole("radio", { name: /the explicit branch/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /complete assessment/i }));

    expect(screen.getByText(/developing/i)).toBeInTheDocument();
    expect(screen.getByText(/confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/next evidence/i)).toBeInTheDocument();
  });

  it("hands the final onboarding stage to the baseline assessment route", () => {
    render(<CareerOnboarding locale="en" onComplete={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/current context/i), {
      target: { value: "I am ready to establish a baseline." },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    fireEvent.click(screen.getByLabelText(/frontend developer/i));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      screen.getByRole("link", { name: /start baseline assessment/i }),
    ).toHaveAttribute(
      "href",
      "/en/career-lab/assessments/baseline-javascript",
    );
  });
});
