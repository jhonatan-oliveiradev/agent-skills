import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => motionState.reduced };
});

import { EditorialHeroMotion } from "./editorial-hero-motion";
import { ProceduralLightCanvas } from "./procedural-light-canvas";

describe("editorial Home motion", () => {
  beforeEach(() => {
    motionState.reduced = false;
    vi.stubGlobal("ResizeObserver", class {
      observe() {}
      disconnect() {}
    });
    vi.stubGlobal("IntersectionObserver", class {
      constructor(private readonly callback: IntersectionObserverCallback) {}
      observe(target: Element) {
        this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      unobserve() {}
      disconnect() {}
    });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("keeps the manifesto readable when motion is disabled", () => {
    motionState.reduced = true;

    const { container } = render(
      <EditorialHeroMotion
        eyebrow="Agent Skills Studio"
        title={<>Skills are not prompts.<br />{" "}They are working methods.</>}
        summary="Open workflows for capable agents."
      />,
    );

    expect(screen.getByRole("heading", { name: "Skills are not prompts. They are working methods." })).toBeVisible();
    expect(screen.getByText("Open workflows for capable agents.")).toBeVisible();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
    expect(container.querySelector('[data-motion="static"]')).toBeInTheDocument();
  });

  it("cancels its animation frame when the procedural canvas unmounts", () => {
    let frame = 0;
    const cancel = vi.fn();
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => ++frame));
    vi.stubGlobal("cancelAnimationFrame", cancel);

    const { unmount } = render(<ProceduralLightCanvas />);
    act(() => unmount());

    expect(cancel).toHaveBeenCalledWith(1);
  });

  it("pauses the procedural loop outside the viewport and resumes on return", () => {
    let intersectionCallback: IntersectionObserverCallback | undefined;
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: IntersectionObserverCallback) { intersectionCallback = callback; }
      observe() {}
      unobserve() {}
      disconnect() {}
    });
    const request = vi.fn(() => 7);
    const cancel = vi.fn();
    vi.stubGlobal("requestAnimationFrame", request);
    vi.stubGlobal("cancelAnimationFrame", cancel);

    render(<ProceduralLightCanvas />);
    expect(intersectionCallback).toBeTypeOf("function");

    act(() => intersectionCallback?.([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(cancel).toHaveBeenCalledWith(7);

    act(() => intersectionCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(request).toHaveBeenCalledTimes(2);
  });
});
