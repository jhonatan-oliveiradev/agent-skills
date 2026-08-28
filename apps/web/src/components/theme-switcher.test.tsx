import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";
import { ThemeSwitcher } from "./theme-switcher";

describe("ThemeSwitcher", () => {
  it("offers system, light, and dark choices with an accessible name", () => {
    render(
      <ThemeProvider attribute="class">
        <ThemeSwitcher locale="en" />
      </ThemeProvider>,
    );

    const control = screen.getByRole("combobox", { name: "Theme" });
    expect(control).toHaveValue("system");
    expect(screen.getByRole("option", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Dark" })).toBeInTheDocument();
    fireEvent.change(control, { target: { value: "dark" } });
    expect(control).toHaveValue("dark");
  });
});
