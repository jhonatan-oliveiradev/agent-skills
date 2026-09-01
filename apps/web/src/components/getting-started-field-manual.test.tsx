import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import GettingStartedPage from "@/app/[locale]/getting-started/page";

describe("Getting Started Field Manual", () => {
  it.each([
    ["en", "FIELD MANUAL", "05 stages", "First setup", "Explore skills", "View packs", "Claude Code · personal"],
    ["pt-BR", "MANUAL DE CAMPO", "05 etapas", "Primeira configuração", "Explorar skills", "Ver pacotes", "Claude Code · pessoal"],
  ] as const)(
    "renders the localized five-stage manual architecture for %s",
    async (locale, manualLabel, stagesLabel, setupLabel, skillsAction, packsAction, claudeLabel) => {
      const { container } = render(
        await GettingStartedPage({ params: Promise.resolve({ locale }) }),
      );

      const manual = container.querySelector("[data-field-manual]");
      expect(manual).toBeInTheDocument();
      expect(screen.getByText(manualLabel)).toBeInTheDocument();
      expect(screen.getByText(stagesLabel)).toBeInTheDocument();
      expect(screen.getByText("Bash + PowerShell")).toBeInTheDocument();
      expect(screen.getByText(setupLabel)).toBeInTheDocument();

      const stages = Array.from(container.querySelectorAll("[data-field-manual-stage]")).map(
        (stage) => stage.getAttribute("data-field-manual-stage"),
      );
      expect(stages).toEqual(["orientation", "install", "verify", "maintain", "continue"]);

      expect(container.querySelector("[data-terminal-demo]")).toBeInTheDocument();
      expect(container.querySelector("[data-field-manual-index]")).toBeInTheDocument();
      expect(screen.getByText(claudeLabel)).toBeInTheDocument();
      expect(screen.getByText("bash install.sh --target claude-code")).toBeInTheDocument();
      expect(screen.getByText("./install.ps1 --target claude-code")).toBeInTheDocument();

      expect(screen.getByRole("link", { name: skillsAction })).toHaveAttribute(
        "data-interaction",
        "navigate",
      );
      expect(screen.getByRole("link", { name: packsAction })).toHaveAttribute(
        "data-interaction",
        "navigate",
      );
    },
  );
});
