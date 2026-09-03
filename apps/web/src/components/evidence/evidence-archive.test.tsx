import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import BuiltWithSkillsPage from "@/app/[locale]/built-with-skills/page";

describe("Evidence Archive", () => {
  it.each([
    [
      "en",
      "Inspect the work behind the claims.",
      "SOURCE / AVAILABLE",
      "Internal evidence",
      "Real-use evidence",
      "Inspect case evidence",
      "/en/built-with-skills/rocket-codebase-intelligence-cosmic-sdk-removal",
    ],
    [
      "pt-BR",
      "Inspecione o trabalho por trás das afirmações.",
      "FONTE / DISPONÍVEL",
      "Evidência interna",
      "Evidência de uso real",
      "Inspecionar evidências do case",
      "/pt-BR/built-with-skills/rocket-codebase-intelligence-cosmic-sdk-removal",
    ],
  ] as const)(
    "renders an evidence-first editorial archive for %s",
    async (locale, title, state, internalProvenance, realUseProvenance, inspectAction, leadingHref) => {
      const { container } = render(
        await BuiltWithSkillsPage({ params: Promise.resolve({ locale }) }),
      );

      expect(container.querySelector("[data-evidence-archive]")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
      expect(container.querySelectorAll("[data-evidence-feature]")).toHaveLength(9);
      expect(container.querySelector('[data-evidence-leading="true"]')).toBeInTheDocument();
      expect(screen.getAllByText(state)).toHaveLength(9);
      expect(screen.getAllByText(internalProvenance)).toHaveLength(2);
      expect(screen.getAllByText(realUseProvenance)).toHaveLength(7);
      expect(screen.getAllByText(inspectAction)).toHaveLength(9);
      expect(
        container.querySelector(
          `[data-evidence-leading="true"] a[href="${leadingHref}"]`,
        ),
      ).toBeInTheDocument();
      expect(container.querySelector(".built-case-card")).not.toBeInTheDocument();
    },
  );
});
