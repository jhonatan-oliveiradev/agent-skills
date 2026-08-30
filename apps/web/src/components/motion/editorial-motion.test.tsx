import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => motionState.reduced };
});

import { EditorialHeroMotion } from "./editorial-hero-motion";
import { DarkVeil } from "./dark-veil";
import { MethodEngine } from "./method-engine";

describe("editorial Home motion", () => {
  afterEach(() => {
    motionState.reduced = false;
    vi.restoreAllMocks();
  });

  it("gives the manifesto a dominant 7/5 desktop hero composition", () => {
    const { container } = render(
      <EditorialHeroMotion
        eyebrow="Agent Skills Studio"
        title="Skills are methods."
        summary="Open workflows for capable agents."
        engine={<div>Method Engine</div>}
      />,
    );

    expect(container.querySelector('[data-layout="manifesto-dominant"]')).toBeInTheDocument();

    const copyRegion = container.querySelector('[data-hero-copy="true"]');
    const engineRegion = container.querySelector('[data-hero-engine="true"]');
    expect(copyRegion).toHaveClass("lg:col-span-7");
    expect(engineRegion).toHaveClass("lg:col-span-5");

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass("max-w-[15ch]");
    expect(screen.getByText("Method Engine")).toBeInTheDocument();
  });

  it("renders a static React Bits Dark Veil atmosphere without WebGL for reduced motion", () => {
    motionState.reduced = true;

    const { container } = render(<DarkVeil />);

    const atmosphere = container.querySelector('[data-dark-veil="static"]');
    expect(atmosphere).toBeInTheDocument();
    expect(container.querySelector('[data-veil-profile="react-bits"]')).toBeInTheDocument();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });

  it("shows the complete method when motion is disabled", () => {
    motionState.reduced = true;

    const { container } = render(
      <MethodEngine
        copy={{
          label: "Method Engine",
          promptLabel: "Natural request",
          prompt: "Create a premium experience for this collection.",
          stages: ["Context", "Method", "Evidence"],
          resultLabel: "Verified outcome",
          result: "Implemented · responsive · accessible · validated",
        }}
        metrics={["18 skills", "6 packs", "2 locales"]}
      />,
    );

    const region = screen.getByRole("region", { name: "Method Engine" });
    expect(within(region).getByText(/Create a premium experience for this collection\./)).toBeVisible();
    expect(within(region).getByText("Context")).toBeVisible();
    expect(within(region).getByText("Method")).toBeVisible();
    expect(within(region).getByText("Evidence")).toBeVisible();
    expect(within(region).getByText("designing-ui-systems")).toBeVisible();
    expect(within(region).getByText("building-premium-nextjs-interfaces")).toBeVisible();
    expect(within(region).getByText("craft-premium-motion")).toBeVisible();
    expect(within(region).getByText("Implemented · responsive · accessible · validated")).toBeVisible();
    expect(within(region).getByText("18 skills")).toBeVisible();
    expect(container.querySelector('[data-motion="static"]')).toBeInTheDocument();
  });
});
