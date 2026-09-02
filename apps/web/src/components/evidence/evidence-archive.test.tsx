import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import BuiltWithSkillsPage from "@/app/[locale]/built-with-skills/page";

describe("Evidence Archive", () => {
  it.each([
    ["en", "Don't trust the description. Inspect the result.", "SOURCE / AVAILABLE", "Internal evidence", "/en/built-with-skills/catalog-experience"],
    ["pt-BR", "Não confie na descrição. Inspecione o resultado.", "FONTE / DISPONÍVEL", "Evidência interna", "/pt-BR/built-with-skills/catalog-experience"],
  ] as const)("renders an evidence-first editorial archive for %s", async (locale, title, state, provenance, leadingHref) => {
    const { container } = render(
      await BuiltWithSkillsPage({ params: Promise.resolve({ locale }) }),
    );

    expect(container.querySelector("[data-evidence-archive]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-evidence-feature]")).toHaveLength(2);
    expect(container.querySelector('[data-evidence-leading="true"]')).toBeInTheDocument();
    expect(screen.getAllByText(state)).toHaveLength(2);
    expect(screen.getAllByText(provenance)).toHaveLength(2);
    expect(container.querySelector(`[data-evidence-leading="true"] a[href="${leadingHref}"]`)).toBeInTheDocument();
    expect(container.querySelector(".built-case-card")).not.toBeInTheDocument();
  });
});
