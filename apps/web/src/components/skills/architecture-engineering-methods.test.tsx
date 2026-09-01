import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import SkillsPage from "@/app/[locale]/skills/page";

describe("Architecture & Engineering method archive integration", () => {
  it.each([
    ["en", "Architecture & engineering"],
    ["pt-BR", "Arquitetura e engenharia"],
  ] as const)("publishes the localized architecture-engineering domain for %s", async (locale, label) => {
    const { unmount } = render(
      <NuqsTestingAdapter>
        {await SkillsPage({ params: Promise.resolve({ locale }) })}
      </NuqsTestingAdapter>,
    );

    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    unmount();
  });
});
