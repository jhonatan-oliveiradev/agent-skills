import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import RoadmapPage from "@/app/[locale]/roadmap/page";

describe("Roadmap Living Program", () => {
  it.each([
    ["en", "LIVING PROGRAM", "Program index", "Open an issue"],
    ["pt-BR", "PROGRAMA VIVO", "Índice do programa", "Abrir uma issue"],
  ] as const)(
    "renders the localized seven-stage editorial program for %s",
    async (locale, publicationLabel, indexLabel, contributeAction) => {
      const { container } = render(await RoadmapPage({ params: Promise.resolve({ locale }) }));

      expect(container.querySelector("[data-living-program]")).toBeInTheDocument();
      expect(screen.getByText(publicationLabel)).toBeInTheDocument();
      expect(screen.getByText(indexLabel)).toBeInTheDocument();

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
      expect(container.querySelectorAll("[data-program-stage][data-empty='true']")).toHaveLength(4);

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
