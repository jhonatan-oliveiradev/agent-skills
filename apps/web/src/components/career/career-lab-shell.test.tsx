import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import { careerLabCopy } from "@/lib/career/copy";
import { CareerLabShell } from "./career-lab-shell";
import { CareerProfileProvider, useCareerProfile } from "./career-profile-provider";

function storageWith(profile: Awaited<ReturnType<CareerStorage["load"]>>): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

function ProviderProbe() {
  const { status, updateProfile } = useCareerProfile();
  return (
    <button
      type="button"
      onClick={() => void updateProfile((profile) => ({ ...profile, weeklyStudyHours: 12 }))}
    >
      {status}
    </button>
  );
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

  it("exposes hydrating -> ready state and persists profile updater mutations", async () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now: "2026-09-05T12:00:00.000Z",
    });
    const storage = storageWith(profile);

    render(
      <CareerProfileProvider storage={storage}>
        <ProviderProbe />
      </CareerProfileProvider>,
    );

    expect(screen.getByRole("button", { name: "hydrating" })).toBeInTheDocument();
    const ready = await screen.findByRole("button", { name: "ready" });
    fireEvent.click(ready);

    await waitFor(() => expect(storage.save).toHaveBeenCalledTimes(1));
    expect(storage.save).toHaveBeenCalledWith(expect.objectContaining({ weeklyStudyHours: 12 }));
  });

  it("renders hydrated role, market, readiness, competency state, roadmap and current focus", async () => {
    const base = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now: "2026-09-05T12:00:00.000Z",
    });
    const profile = {
      ...base,
      competencies: [
        {
          competencyId: "programming-javascript",
          level: null,
          confidence: "low" as const,
          evidenceIds: [],
          lastAssessedAt: null,
        },
      ],
    };

    render(
      <CareerProfileProvider storage={storageWith(profile)}>
        <CareerLabShell locale="en" />
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("heading", { name: /frontend developer/i })).toBeInTheDocument();
    expect(screen.getByText(/target market: br/i)).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();
    expect(screen.getByText(/no current focus yet/i)).toBeInTheDocument();
    expect(screen.getAllByText(/programming-javascript/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/unknown · low confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/0 \/ 0 milestones/i)).toBeInTheDocument();
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
