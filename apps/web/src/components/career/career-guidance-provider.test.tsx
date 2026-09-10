import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type {
  CareerGuidanceState,
  CareerGuidanceStorage,
} from "@/lib/career/guidance-storage";
import type { CareerStorage } from "@/lib/career/storage";
import { CareerGuidanceProvider, useCareerGuidance } from "./career-guidance-provider";
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

function guidanceStorage(state: CareerGuidanceState): CareerGuidanceStorage {
  return {
    load: vi.fn().mockResolvedValue(state),
    save: vi.fn().mockResolvedValue(undefined),
  };
}

function GuidanceProbe() {
  const guidance = useCareerGuidance();
  return (
    <div>
      <p data-testid="guidance-state">
        {guidance.status}:{guidance.orientationStatus}:{guidance.isOrientationOpen ? "open" : "closed"}
      </p>
      <button type="button" onClick={guidance.openOrientation}>Open orientation</button>
      <button type="button" onClick={() => void guidance.completeOrientation()}>Complete orientation</button>
      <button type="button" onClick={() => void guidance.skipOrientation()}>Skip orientation</button>
      <button type="button" onClick={guidance.closeOrientation}>Close orientation</button>
    </div>
  );
}

function renderProvider(storage: CareerGuidanceStorage) {
  return render(
    <CareerProfileProvider storage={profileStorage()}>
      <CareerGuidanceProvider storage={storage}>
        <GuidanceProbe />
      </CareerGuidanceProvider>
    </CareerProfileProvider>,
  );
}

describe("CareerGuidanceProvider", () => {
  it("auto-opens once when a profile exists and guidance is unseen", async () => {
    renderProvider(guidanceStorage({ orientationStatus: "unseen" }));
    expect(await screen.findByTestId("guidance-state")).toHaveTextContent("ready:unseen:open");
  });

  it("does not auto-open when status is completed", async () => {
    renderProvider(guidanceStorage({ orientationStatus: "completed" }));
    expect(await screen.findByTestId("guidance-state")).toHaveTextContent("ready:completed:closed");
  });

  it("skip persists skipped", async () => {
    const storage = guidanceStorage({ orientationStatus: "unseen" });
    renderProvider(storage);
    await screen.findByText("ready:unseen:open");

    fireEvent.click(screen.getByRole("button", { name: "Skip orientation" }));

    await waitFor(() => expect(storage.save).toHaveBeenCalledWith({ orientationStatus: "skipped" }));
    expect(screen.getByTestId("guidance-state")).toHaveTextContent("ready:skipped:closed");
  });

  it("Guide can reopen orientation after completion", async () => {
    const storage = guidanceStorage({ orientationStatus: "completed" });
    renderProvider(storage);
    await screen.findByText("ready:completed:closed");

    fireEvent.click(screen.getByRole("button", { name: "Open orientation" }));

    expect(screen.getByTestId("guidance-state")).toHaveTextContent("ready:completed:open");
  });

  it("reopened orientation can close without changing a terminal status", async () => {
    const storage = guidanceStorage({ orientationStatus: "completed" });
    renderProvider(storage);
    await screen.findByText("ready:completed:closed");
    fireEvent.click(screen.getByRole("button", { name: "Open orientation" }));

    fireEvent.click(screen.getByRole("button", { name: "Close orientation" }));

    expect(screen.getByTestId("guidance-state")).toHaveTextContent("ready:completed:closed");
    expect(storage.save).not.toHaveBeenCalled();
  });
});
