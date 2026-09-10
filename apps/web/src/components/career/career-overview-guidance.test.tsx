import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import type { CareerProfile } from "@/lib/career/types";
import { CareerOverview } from "./career-overview";
import { CareerProfileProvider } from "./career-profile-provider";

function storageWith(profile: CareerProfile): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

function frontendProfile(): CareerProfile {
  return createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    weeklyStudyHours: 8,
    now: "2026-09-10T12:00:00.000Z",
  });
}

describe("CareerOverview capability ledger", () => {
  it("uses human competency labels while keeping technical ids secondary", async () => {
    render(
      <CareerProfileProvider storage={storageWith(frontendProfile())}>
        <CareerOverview locale="pt-BR" />
      </CareerProfileProvider>,
    );

    await screen.findByRole("heading", { name: "Desenvolvedor Frontend" });
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("programming-javascript", { selector: "code" })).toBeInTheDocument();
  });

  it("consolidates competency state and blocking gap context into one operational ledger", async () => {
    const { container } = render(
      <CareerProfileProvider storage={storageWith(frontendProfile())}>
        <CareerOverview locale="pt-BR" />
      </CareerProfileProvider>,
    );

    await screen.findByRole("heading", { name: "Desenvolvedor Frontend" });
    const ledger = screen.getByRole("region", { name: "Mapa de capacidades" });
    expect(container.querySelectorAll(".career-overview__capability-ledger")).toHaveLength(1);
    expect(container.querySelector(".career-overview__gaps")).toBeNull();

    const javascriptRow = within(ledger).getByText("JavaScript").closest("li");
    expect(javascriptRow).not.toBeNull();
    expect(within(javascriptRow!).getByText(/desconhecido · baixa confiança/i)).toBeInTheDocument();
    expect(within(javascriptRow!).getByText(/^capacidade$/i)).toBeInTheDocument();
  });
});
