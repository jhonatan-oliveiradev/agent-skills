import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

vi.mock("server-only", () => ({}));

import SkillsPage from "@/app/[locale]/skills/page";

describe("Brand Design methods", () => {
  it.each([
    ["en", "Brand design"],
    ["pt-BR", "Design de marca"],
  ] as const)("publishes the localized brand-design domain for %s", async (locale, label) => {
    render(
      <NuqsTestingAdapter>
        {await SkillsPage({ params: Promise.resolve({ locale }) })}
      </NuqsTestingAdapter>,
    );

    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
  });
});
