import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import { careerLabCopy } from "@/lib/career/copy";
import { CareerLabShell } from "./career-lab-shell";
import { CareerProfileProvider } from "./career-profile-provider";

function storageWith(profile: Awaited<ReturnType<CareerStorage["load"]>>): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

describe("Career Lab shell", () => {
  it("renders without a profile and offers onboarding instead of requiring login", async () => {
    render(
      <CareerProfileProvider storage={storageWith(null)}>
        <CareerLabShell locale="en" />
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("link", { name: /start onboarding/i })).toHaveAttribute(
      "href",
      "/en/career-lab/onboarding",
    );
    expect(screen.queryByText(/sign in|log in/i)).not.toBeInTheDocument();
  });

  it("renders hydrated role readiness and current-focus placeholders from domain state", async () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now: "2026-09-05T12:00:00.000Z",
    });

    render(
      <CareerProfileProvider storage={storageWith(profile)}>
        <CareerLabShell locale="en" />
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("heading", { name: /frontend developer/i })).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();
    expect(screen.getByText(/no current focus yet/i)).toBeInTheDocument();
    expect(screen.getByText(/programming-javascript/i)).toBeInTheDocument();
  });

  it("owns complete EN and PT-BR navigation copy locally", () => {
    expect(careerLabCopy.en.navigation).toEqual([
      "Overview",
      "Roadmap",
      "Assessments",
      "Evidence",
      "Market",
    ]);
    expect(careerLabCopy["pt-BR"].navigation).toEqual([
      "Visão geral",
      "Roadmap",
      "Avaliações",
      "Evidências",
      "Mercado",
    ]);
  });
});
