import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CareerStorage } from "@/lib/career/storage";
import { CareerProfileProvider } from "./career-profile-provider";
import { MarketIntelligenceSurface } from "./market-analysis";

function emptyStorage(): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(null),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

describe("MarketIntelligenceSurface UI states", () => {
  it("renders a deliberate localized empty surface when there is no Career Profile", async () => {
    const { container } = render(
      <CareerProfileProvider storage={emptyStorage()}>
        <MarketIntelligenceSurface locale="pt-BR" />
      </CareerProfileProvider>,
    );

    expect(
      await screen.findByRole("heading", { name: "Inteligência de mercado" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Crie um Career Profile antes de analisar a demanda de mercado.",
    );
    expect(container.querySelector(".career-market-workspace--empty")).toBeInTheDocument();
  });
});
