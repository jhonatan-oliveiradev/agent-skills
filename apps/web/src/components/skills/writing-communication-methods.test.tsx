import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

vi.mock("server-only", () => ({}));

import SkillsPage from "@/app/[locale]/skills/page";

describe("Writing & Communication methods", () => {
  it.each([
    ["en", "Writing & communication"],
    ["pt-BR", "Escrita & comunicação"],
  ] as const)("publishes the localized writing-communication domain for %s", async (locale, label) => {
    render(
      <NuqsTestingAdapter>
        {await SkillsPage({ params: Promise.resolve({ locale }) })}
      </NuqsTestingAdapter>,
    );

    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
  });
});
