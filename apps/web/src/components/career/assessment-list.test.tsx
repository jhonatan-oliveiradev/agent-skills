import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AssessmentBlueprint } from "@/lib/career/assessment";
import { CareerOnboarding } from "./career-onboarding";
import { AssessmentList } from "./assessment-list";

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

describe("Assessment discovery and baseline handoff", () => {
  it("lists the baseline assessment and links to its detail route", () => {
    render(<AssessmentList locale="en" blueprints={[baselineBlueprint]} />);

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

  it("keeps list and detail assessment route modules available", async () => {
    const [listRoute, detailRoute] = await Promise.all([
      import("@/app/[locale]/career-lab/assessments/page"),
      import("@/app/[locale]/career-lab/assessments/[id]/page"),
    ]);

    expect(listRoute.default).toBeTypeOf("function");
    expect(detailRoute.default).toBeTypeOf("function");
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
