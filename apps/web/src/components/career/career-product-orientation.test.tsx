import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerGuidanceStorage } from "@/lib/career/guidance-storage";
import type { CareerStorage } from "@/lib/career/storage";
import { CareerGuidanceProvider } from "./career-guidance-provider";
import { CareerProductOrientation } from "./career-product-orientation";
import { CareerProfileProvider } from "./career-profile-provider";

function profileStorage(): CareerStorage {
  return {
    load: vi.fn().mockResolvedValue(
      createEmptyCareerProfile({
        targetRole: "frontend-developer",
        targetMarket: "br",
        now: "2026-09-09T12:00:00.000Z",
      }),
    ),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
}

function guidanceStorage(): CareerGuidanceStorage {
  return {
    load: vi.fn().mockResolvedValue({ orientationStatus: "unseen" }),
    save: vi.fn().mockResolvedValue(undefined),
  };
}

describe("CareerProductOrientation", () => {
  it("renders an accessible five-stage product orientation with persistent terminal actions", async () => {
    const guidance = guidanceStorage();
    render(
      <CareerProfileProvider storage={profileStorage()}>
        <CareerGuidanceProvider storage={guidance}>
          <CareerProductOrientation locale="en" />
        </CareerGuidanceProvider>
      </CareerProfileProvider>,
    );

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getAllByTestId("career-orientation-stage")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Skip orientation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Complete orientation" })).toBeInTheDocument();
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    fireEvent.click(screen.getByRole("button", { name: "Complete orientation" }));
    await waitFor(() =>
      expect(guidance.save).toHaveBeenCalledWith({ orientationStatus: "completed" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Escape closes a transient orientation without mutating profile or guidance state", async () => {
    const profile = profileStorage();
    const guidance = guidanceStorage();
    render(
      <CareerProfileProvider storage={profile}>
        <CareerGuidanceProvider storage={guidance}>
          <CareerProductOrientation locale="pt-BR" />
        </CareerGuidanceProvider>
      </CareerProfileProvider>,
    );

    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(profile.save).not.toHaveBeenCalled();
    expect(profile.clear).not.toHaveBeenCalled();
    expect(guidance.save).not.toHaveBeenCalled();
  });
});
