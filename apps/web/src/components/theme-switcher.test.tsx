import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeTransitionToggle } from "./theme-switcher";

const themeState = vi.hoisted(() => ({
  reducedMotion: false,
  resolvedTheme: "light" as "light" | "dark" | undefined,
  setTheme: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: themeState.resolvedTheme,
    setTheme: themeState.setTheme,
  }),
}));

vi.mock("motion/react", async (importOriginal) => {
  const motion = await importOriginal<typeof import("motion/react")>();
  return { ...motion, useReducedMotion: () => themeState.reducedMotion };
});

function installViewTransition() {
  const startViewTransition = vi.fn((update: () => void) => {
    update();
    return {
      finished: Promise.resolve(),
      ready: Promise.resolve(),
      skipTransition: vi.fn(),
      updateCallbackDone: Promise.resolve(),
    };
  });

  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: startViewTransition,
  });

  return startViewTransition;
}

describe("ThemeTransitionToggle", () => {
  beforeEach(() => {
    themeState.reducedMotion = false;
    themeState.resolvedTheme = "light";
    themeState.setTheme.mockReset();
  });

  afterEach(() => {
    Reflect.deleteProperty(document, "startViewTransition");
    delete document.documentElement.dataset.themeTransition;
    delete document.documentElement.dataset.themeTransitionBlur;
  });

  it("switches from the resolved system theme without requiring View Transitions", () => {
    render(<ThemeTransitionToggle locale="en" />);

    fireEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));

    expect(themeState.setTheme).toHaveBeenCalledWith("dark");
  });

  it("reveals the light theme from the bottom when View Transitions are available", () => {
    themeState.resolvedTheme = "dark";
    const startViewTransition = installViewTransition();

    render(<ThemeTransitionToggle locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));

    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(themeState.setTheme).toHaveBeenCalledWith("light");
    expect(document.documentElement.dataset.themeTransition).toBe("bottom-up");
    expect(document.documentElement.dataset.themeTransitionBlur).toBe("false");
  });

  it("bypasses View Transitions when reduced motion is requested", () => {
    themeState.reducedMotion = true;
    const startViewTransition = installViewTransition();

    render(<ThemeTransitionToggle locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));

    expect(startViewTransition).not.toHaveBeenCalled();
    expect(themeState.setTheme).toHaveBeenCalledWith("dark");
  });

  it("provides an equivalent localized accessible name", () => {
    render(<ThemeTransitionToggle locale="pt-BR" />);

    expect(
      screen.getByRole("button", { name: "Mudar para tema escuro" }),
    ).toBeVisible();
  });
});
