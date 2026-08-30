import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => motionState.reduced };
});

import { MethodEngine } from "./method-engine";

describe("editorial Home motion", () => {
  afterEach(() => {
    motionState.reduced = false;
    vi.restoreAllMocks();
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
