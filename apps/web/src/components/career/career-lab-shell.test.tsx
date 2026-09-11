import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({ pathname: "/en/career-lab" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

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
  it("renders product-owned chrome and provided route content", async () => {
    navigation.pathname = "/en/career-lab";
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

  it("marks Guide as an unnumbered current utility route in PT-BR", async () => {
    navigation.pathname = "/pt-BR/career-lab/guide";
    render(
      <CareerProfileProvider storage={storageWith(null)}>
        <CareerLabShell locale="pt-BR">
          <p>Guide route content</p>
        </CareerLabShell>
      </CareerProfileProvider>,
    );

    expect(await screen.findByText("Guide route content")).toBeInTheDocument();
    const workflow = screen.getByRole("navigation", { name: "Career Lab" });
    expect(workflow.querySelectorAll("ol > li")).toHaveLength(6);
    expect(screen.getByRole("link", { name: "Guia" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Local-first")).toBeInTheDocument();
  });

  it("marks Learning as the third numbered workflow route", async () => {
    navigation.pathname = "/pt-BR/career-lab/learning";
    render(
      <CareerProfileProvider storage={storageWith(null)}>
        <CareerLabShell locale="pt-BR">
          <p>Learning route content</p>
        </CareerLabShell>
      </CareerProfileProvider>,
    );

    expect(await screen.findByText("Learning route content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /03\s*Aprendizado/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Guia" })).not.toHaveAttribute("aria-current");
  });

  it("marks Roadmap as the fourth numbered workflow route", async () => {
    navigation.pathname = "/pt-BR/career-lab/roadmap";
    render(
      <CareerProfileProvider storage={storageWith(null)}>
        <CareerLabShell locale="pt-BR">
          <p>Roadmap route content</p>
        </CareerLabShell>
      </CareerProfileProvider>,
    );

    expect(await screen.findByText("Roadmap route content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /04\s*Roadmap/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Guia" })).not.toHaveAttribute("aria-current");
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

  it("owns the exact six-step EN and PT-BR navigation copy locally", () => {
    expect(careerLabCopy.en.navigation).toEqual([
      "Overview",
      "Assessments",
      "Learning",
      "Roadmap",
      "Evidence",
      "Market",
    ]);
    expect(careerLabCopy["pt-BR"].navigation).toEqual([
      "Visão geral",
      "Avaliações",
      "Aprendizado",
      "Roadmap",
      "Evidências",
      "Mercado",
    ]);
  });
});
