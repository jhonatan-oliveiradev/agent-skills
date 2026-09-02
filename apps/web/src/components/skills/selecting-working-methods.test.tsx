import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import SkillDetailPage from "@/app/[locale]/skills/[slug]/page";
import SkillsPage from "@/app/[locale]/skills/page";

describe("Selecting Working Methods product integration", () => {
  it.each([
    ["en", "Selecting Working Methods"],
    ["pt-BR", "Seleção de Métodos de Trabalho"],
  ] as const)("publishes the meta router in the localized archive for %s", async (locale, displayName) => {
    const { container } = render(
      <NuqsTestingAdapter>
        {await SkillsPage({ params: Promise.resolve({ locale }) })}
      </NuqsTestingAdapter>,
    );

    expect(screen.getByRole("button", { name: "Meta" })).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-method-row] a[href="/${locale}/skills/selecting-working-methods"]`,
      ),
    ).toHaveTextContent(displayName);
  });

  it.each([
    ["en", "Selecting Working Methods"],
    ["pt-BR", "Seleção de Métodos de Trabalho"],
  ] as const)("renders the localized meta-router dossier for %s", async (locale, displayName) => {
    const { container } = render(
      await SkillDetailPage({
        params: Promise.resolve({ locale, slug: "selecting-working-methods" }),
      }),
    );

    expect(screen.getByRole("heading", { level: 1, name: displayName })).toBeInTheDocument();
    expect(container).toHaveTextContent("./install.sh --skill selecting-working-methods");
    expect(container).toHaveTextContent("turning-techniques-into-skills");
  });
});
