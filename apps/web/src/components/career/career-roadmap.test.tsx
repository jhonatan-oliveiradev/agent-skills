import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RoadmapPage from "@/app/[locale]/career-lab/roadmap/page";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import { buildRoadmap } from "@/lib/career/roadmap-engine";
import { getRoleMap } from "@/lib/career/role-maps";
import type { CareerStorage } from "@/lib/career/storage";
import type { CareerProfile } from "@/lib/career/types";
import { CareerLabShell } from "./career-lab-shell";
import { CareerProfileProvider } from "./career-profile-provider";
import { CareerRoadmap, CareerRoadmapSurface } from "./career-roadmap";

function profileWithEmptyRoadmap(): CareerProfile {
  return createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    weeklyStudyHours: 8,
    now: "2026-09-07T14:30:00.000Z",
  });
}

function storageWith(profile: CareerProfile): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

describe("Career Roadmap", () => {
  it("renders NOW, NEXT and MAP as separate scales with one primary current focus", () => {
    const profile = profileWithEmptyRoadmap();
    const expected = buildRoadmap(profile, getRoleMap("frontend-developer"));
    render(<CareerRoadmap locale="en" profile={profile} />);

    const now = screen.getByRole("region", { name: /^now$/i });
    const next = screen.getByRole("region", { name: /^next$/i });
    const map = screen.getByRole("region", { name: /^map$/i });

    expect(within(now).getByRole("heading", { name: /programming foundations/i })).toBeInTheDocument();
    expect(within(now).getAllByText(/in progress/i)).toHaveLength(1);
    expect(within(next).getByText(/next available milestones/i)).toBeInTheDocument();
    expect(within(map).getAllByRole("article")).toHaveLength(expected.milestoneIds.length);
  });

  it("explains why the current milestone matters, its gaps, evidence gate and effort", () => {
    render(<CareerRoadmap locale="en" profile={profileWithEmptyRoadmap()} />);

    const now = screen.getByRole("region", { name: /^now$/i });
    expect(within(now).getByRole("heading", { name: /why now/i })).toBeInTheDocument();
    expect(within(now).getByText(/programming-javascript/i)).toBeInTheDocument();
    expect(within(now).getByText(/e1/i)).toBeInTheDocument();
    expect(within(now).getByText(/4–8 h/i)).toBeInTheDocument();
  });

  it("uses explicit localized status text instead of color-only roadmap state", () => {
    render(<CareerRoadmap locale="pt-BR" profile={profileWithEmptyRoadmap()} />);

    expect(screen.getByRole("region", { name: /^agora$/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /^próximos$/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /^mapa$/i })).toBeInTheDocument();
    expect(screen.getAllByText(/em andamento/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/bloqueado/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: /por que agora/i })).toBeInTheDocument();
  });

  it("persists the first derived roadmap through the existing Career Profile storage boundary", async () => {
    const profile = profileWithEmptyRoadmap();
    const storage = storageWith(profile);

    render(
      <CareerProfileProvider storage={storage}>
        <CareerRoadmapSurface locale="en" />
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("region", { name: /^now$/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(storage.save).toHaveBeenCalledWith(
        expect.objectContaining({
          roadmap: expect.objectContaining({
            currentFocusMilestoneId: "programming-foundations",
          }),
        }),
      );
    });
  });

  it("publishes the localized roadmap route and enables Roadmap in Career Lab navigation", async () => {
    const profile = profileWithEmptyRoadmap();
    const page = await RoadmapPage({ params: Promise.resolve({ locale: "en" }) });
    const storage = storageWith(profile);

    render(
      <CareerProfileProvider storage={storage}>
        <CareerLabShell locale="en">{page}</CareerLabShell>
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("link", { name: /roadmap/i })).toHaveAttribute(
      "href",
      "/en/career-lab/roadmap",
    );
    expect(screen.getByRole("region", { name: /^now$/i })).toBeInTheDocument();
  });
});
