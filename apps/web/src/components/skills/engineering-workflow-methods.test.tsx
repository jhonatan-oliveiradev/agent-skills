import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

vi.mock("server-only", () => ({}));

import SkillsPage from "@/app/[locale]/skills/page";

describe("Engineering Workflow methods", () => {
  it.each([
    ["en", "Engineering workflow"],
    ["pt-BR", "Fluxo de engenharia"],
  ] as const)("publishes the localized engineering-workflow domain for %s", async (locale, label) => {
    render(
      <NuqsTestingAdapter>
        {await SkillsPage({ params: Promise.resolve({ locale }) })}
      </NuqsTestingAdapter>,
    );

    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
  });
});
