import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import RoadmapPage from "@/app/[locale]/roadmap/page";

describe("Roadmap Living Program", () => {
  it.each([
    [
      "en",
      "LIVING PROGRAM",
      "Program index",
      "Open GitHub Issues",
      "Current release",
      "Post-Stable work",
    ],
    [
      "pt-BR",
      "PROGRAMA VIVO",
      "Índice do programa",
      "Abrir Issues no GitHub",
      "Release atual",
      "Trabalho pós-Stable",
    ],
  ] as const)(
    "renders the localized seven-stage editorial program for %s",
    async (locale, publicationLabel, indexLabel, contributeAction, releaseLabel, postStableLabel) => {
      const { container } = render(await RoadmapPage({ params: Promise.resolve({ locale }) }));

      expect(container.querySelector("[data-living-program]")).toBeInTheDocument();
      expect(screen.getByText(publicationLabel)).toBeInTheDocument();
      expect(screen.getByText(indexLabel)).toBeInTheDocument();

      const releaseState = container.querySelector<HTMLElement>("[data-release-state]");
      expect(releaseState).toBeInTheDocument();
      expect(within(releaseState!).getByText(releaseLabel)).toBeInTheDocument();
      expect(within(releaseState!).getByText("Stable 1.0.0")).toBeInTheDocument();
      expect(within(releaseState!).getByText(postStableLabel)).toBeInTheDocument();

      const stages = Array.from(container.querySelectorAll("[data-program-stage]")).map((stage) =>
        stage.getAttribute("data-program-stage"),
      );
      expect(stages).toEqual([
        "proposal",
        "research",
        "development",
        "experimental",
        "beta",
        "stable",
        "deprecated",
      ]);

      expect(container.querySelector("[data-program-index]")).toBeInTheDocument();
      expect(container.querySelectorAll("[data-program-stage][data-empty='true']")).toHaveLength(6);
      expect(container.querySelector('[data-program-stage="beta"]')).toHaveAttribute("data-empty", "true");
      expect(container.querySelector('[data-program-stage="stable"]')).toHaveAttribute("data-empty", "false");

      const relatedLinks = container.querySelectorAll(
        '[data-program-record] a[data-interaction="connect"]',
      );
      expect(relatedLinks.length).toBeGreaterThan(0);

      expect(screen.getByRole("link", { name: contributeAction })).toHaveAttribute(
        "data-interaction",
        "navigate",
      );
    },
  );
});
