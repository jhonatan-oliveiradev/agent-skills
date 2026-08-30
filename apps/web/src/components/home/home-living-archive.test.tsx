import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { motionValue } from "motion/react";

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not found");
  },
}));
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => motionState.reduced };
});

import HomePage from "@/app/[locale]/page";
import { HomeCaseStudyStory } from "./home-case-study-story";
import { HomeEvidenceThread } from "./home-evidence-thread";

const caseStudyProps = {
  eyebrow: "Built with Skills / Case 001",
  title: "This Home was built with Skills.",
  summary: "Method in, verifiable outcome out.",
  stages: [
    { id: "problem" as const, eyebrow: "01 / Problem", title: "Problem", summary: "A real problem." },
    { id: "method" as const, eyebrow: "02 / Method", title: "Method", summary: "A repeatable process." },
    { id: "transformation" as const, eyebrow: "03 / Transformation", title: "Transformation", summary: "A deliberate change." },
    { id: "evidence" as const, eyebrow: "04 / Evidence", title: "Evidence", summary: "An inspectable result." },
  ],
  evidenceLinks: [
    { label: "PR #22", href: "https://github.com/jhonatan-oliveiradev/agent-skills/pull/22", external: true },
  ],
};

describe("Living Research Archive Home", () => {
  afterEach(() => {
    motionState.reduced = false;
  });

  it.each([
    ["en", "From a problem to an outcome."],
    ["pt-BR", "Do problema ao resultado."],
  ] as const)("renders three acts without a standalone transformation section for %s", async (locale, oldTransformationHeading) => {
    const { container } = render(await HomePage({ params: Promise.resolve({ locale }) }));

    expect(container.querySelectorAll("[data-home-act]")).toHaveLength(3);
    expect(screen.queryByRole("heading", { name: oldTransformationHeading })).not.toBeInTheDocument();
  });

  it("renders Case 001 as a four-stage sticky story when motion is enabled", () => {
    const { container } = render(<HomeCaseStudyStory {...caseStudyProps} />);

    expect(container.querySelector('[data-case-mode="sticky"]')).toBeInTheDocument();
    expect(container.querySelector('[data-case-sticky="true"]')).toBeInTheDocument();
    expect(container.querySelectorAll("[data-case-stage]")).toHaveLength(4);
  });

  it("renders Case 001 in linear document flow when reduced motion is enabled", () => {
    motionState.reduced = true;
    const { container } = render(<HomeCaseStudyStory {...caseStudyProps} />);

    expect(container.querySelector('[data-case-mode="linear"]')).toBeInTheDocument();
    expect(container.querySelector('[data-case-sticky="true"]')).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-case-stage]")).toHaveLength(4);
  });

  it("renders the Evidence Thread as decorative SVG geometry without a canvas", () => {
    const { container } = render(<HomeEvidenceThread progress={motionValue(0.5)} mode="case" />);
    const thread = screen.getByTestId("evidence-thread");

    expect(thread).toHaveAttribute("aria-hidden", "true");
    expect(thread.querySelector("svg")).toBeInTheDocument();
    expect(thread.querySelector("canvas")).not.toBeInTheDocument();
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
  });
});
