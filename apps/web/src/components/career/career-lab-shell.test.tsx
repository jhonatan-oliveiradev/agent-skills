import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { careerLabCopy } from "@/lib/career/copy";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
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
  it("renders product-owned chrome and provided route content without inferring route state", async () => {
    render(
      <CareerProfileProvider storage={storageWith(null)}>
        <CareerLabShell locale="en">
          <p>Root route content</p>
        </CareerLabShell>
      </CareerProfileProvider>,
    );

    expect(await screen.findByText("Root route content")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("navigation", { name: "Career Lab" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Developer Career Pack" })).toHaveAttribute(
      "href",
      "/en/packs/developer-career",
    );
    expect(screen.getByRole("link", { name: "Agent Skills Studio ↗" })).toHaveAttribute(
      "href",
      "/en",
    );
    expect(screen.getByRole("link", { name: "Methods ↗" })).toHaveAttribute(
      "href",
      "/en/packs/developer-career",
    );
    expect(screen.queryByText(/methods only matter|métodos só têm valor/i)).not.toBeInTheDocument();
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
