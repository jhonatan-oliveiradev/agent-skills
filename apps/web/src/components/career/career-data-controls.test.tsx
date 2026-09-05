import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createEmptyCareerProfile } from "@/lib/career/profile";
import type { CareerStorage } from "@/lib/career/storage";
import { CareerProfileProvider } from "./career-profile-provider";
import {
  CareerDataControls,
  getCareerProfileExportFilename,
  serializeCareerProfile,
} from "./career-data-controls";

function makeProfile() {
  return createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    weeklyStudyHours: 8,
    now: "2026-09-05T12:00:00.000Z",
  });
}

function makeStorage(profile = makeProfile()) {
  const storage: CareerStorage = {
    load: vi.fn().mockResolvedValue(profile),
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  };
  return storage;
}

describe("Career Lab data controls", () => {
  it("serializes the exact current Career Profile contract for export", () => {
    const profile = makeProfile();
    expect(serializeCareerProfile(profile)).toBe(`${JSON.stringify(profile, null, 2)}\n`);
    expect(getCareerProfileExportFilename(new Date("2026-09-05T12:00:00.000Z"))).toBe(
      "agent-skills-career-profile-2026-09-05.json",
    );
  });

  it("rejects invalid imports without replacing the hydrated profile", async () => {
    const storage = makeStorage();
    render(
      <CareerProfileProvider storage={storage}>
        <CareerDataControls locale="en" />
      </CareerProfileProvider>,
    );

    expect(await screen.findByRole("button", { name: /export profile/i })).toBeInTheDocument();

    const file = new File(["not-json"], "invalid.json", { type: "application/json" });
    Object.defineProperty(file, "text", {
      value: vi.fn().mockResolvedValue("not-json"),
    });
    fireEvent.change(screen.getByLabelText(/import profile/i), { target: { files: [file] } });

    expect(await screen.findByRole("status")).toHaveTextContent(/import failed/i);
    expect(storage.save).not.toHaveBeenCalled();
  });

  it("requires confirmation before resetting local Career Lab data", async () => {
    const storage = makeStorage();
    render(
      <CareerProfileProvider storage={storage}>
        <CareerDataControls locale="en" />
      </CareerProfileProvider>,
    );

    await screen.findByRole("button", { name: /reset profile/i });
    fireEvent.click(screen.getByRole("button", { name: /reset profile/i }));
    expect(storage.clear).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /confirm reset/i }));
    await waitFor(() => expect(storage.clear).toHaveBeenCalledTimes(1));
  });
});
