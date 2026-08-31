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

  it.each(["en", "pt-BR"] as const)("renders methods and packs as scroll-reactive editorial systems for %s", async (locale) => {
    const { container } = render(await HomePage({ params: Promise.resolve({ locale }) }));

    const methods = container.querySelector('[data-home-section="methods"]');
    const packs = container.querySelector('[data-home-section="packs"]');

    expect(methods).toHaveAttribute("data-scroll-choreography", "staggered");
    expect(packs).toHaveAttribute("data-scroll-choreography", "staged");
    expect(container.querySelectorAll("[data-method-stage]")).toHaveLength(3);
    expect(container.querySelectorAll(".home-pack-dossier")).toHaveLength(3);
    expect(container.querySelectorAll("[data-pack-stage]")).toHaveLength(3);
    expect(container.querySelectorAll(".home-pack-dossier__skills")).toHaveLength(3);
  });

  it("connects the four workflow movements with a scrubbed Evidence Thread", async () => {
    const { container } = render(await HomePage({ params: Promise.resolve({ locale: "en" }) }));
    const workflow = container.querySelector('[data-home-section="workflow"]');

    expect(workflow).toHaveAttribute("data-scroll-choreography", "scrubbed");
    expect(container.querySelectorAll("[data-workflow-stage]")).toHaveLength(4);
    expect(workflow?.querySelector('[data-evidence-thread-mode="workflow"]')).toBeInTheDocument();
    expect(workflow?.querySelector("canvas")).not.toBeInTheDocument();
  });

  it("renders Case 001 as one scrubbed four-checkpoint scene when motion is enabled", () => {
    const { container } = render(<HomeCaseStudyStory {...caseStudyProps} />);

    const story = container.querySelector('[data-case-mode="sticky"]');
    expect(story).toBeInTheDocument();
    expect(story).toHaveAttribute("data-scroll-choreography", "scrubbed");
    expect(container.querySelector('[data-case-sticky="true"]')).toBeInTheDocument();
    expect(container.querySelectorAll("[data-case-artifact]")).toHaveLength(1);
    expect(container.querySelectorAll("[data-case-stage]")).toHaveLength(4);
    expect(container.querySelectorAll("[data-case-checkpoint]")).toHaveLength(4);
  });

  it("renders Case 001 in linear document flow when reduced motion is enabled", () => {
    motionState.reduced = true;
    const { container } = render(<HomeCaseStudyStory {...caseStudyProps} />);

    expect(container.querySelector('[data-case-mode="linear"]')).toBeInTheDocument();
    expect(container.querySelector('[data-scroll-choreography="static"]')).toBeInTheDocument();
    expect(container.querySelector('[data-case-sticky="true"]')).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-case-artifact]")).toHaveLength(1);
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
