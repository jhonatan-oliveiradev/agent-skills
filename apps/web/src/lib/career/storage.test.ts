import { describe, expect, it } from "vitest";
import { createEmptyCareerProfile } from "./profile";
import { createMemoryCareerStorage } from "./storage";

describe("CareerStorage", () => {
  it("saves and loads a validated Career Profile", async () => {
    const storage = createMemoryCareerStorage();
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now: "2026-09-04T23:50:00.000Z",
    });

    await storage.save(profile);

    expect(await storage.load()).toEqual(profile);
  });

  it("rejects unresolved learning progress before replacing local state", async () => {
    const storage = createMemoryCareerStorage();
    const valid = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      now: "2026-09-11T12:00:00.000Z",
    });
    await storage.save(valid);

    const invalid = {
      ...valid,
      learningProgress: [
        {
          noteId: "unknown-note",
          startedAt: "2026-09-11T12:00:00.000Z",
          updatedAt: "2026-09-11T12:10:00.000Z",
          currentModuleId: null,
          completedModuleIds: [],
          completedPracticeIds: [],
          completedAt: null,
        },
      ],
    };

    await expect(storage.save(invalid)).rejects.toThrow(/unknown learning note/i);
    expect(await storage.load()).toEqual(valid);
  });

  it("clears only the active Career Profile value", async () => {
    const storage = createMemoryCareerStorage();
    const profile = createEmptyCareerProfile({
      targetRole: "backend-developer",
      targetMarket: "br",
      now: "2026-09-04T23:50:00.000Z",
    });

    await storage.save(profile);
    await storage.clear();

    expect(await storage.load()).toBeNull();
  });

  it("validates before save and leaves the previous profile unchanged on failure", async () => {
    const storage = createMemoryCareerStorage();
    const profile = createEmptyCareerProfile({
      targetRole: "fullstack-developer",
      targetMarket: "remote-international",
      now: "2026-09-04T23:50:00.000Z",
    });

    await storage.save(profile);

    await expect(
      storage.save({ ...profile, weeklyStudyHours: "8" } as never),
    ).rejects.toThrow(/weeklyStudyHours/i);
    expect(await storage.load()).toEqual(profile);
  });

  it("returns defensive snapshots instead of exposing mutable storage state", async () => {
    const storage = createMemoryCareerStorage();
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      now: "2026-09-04T23:50:00.000Z",
    });

    await storage.save(profile);
    const first = await storage.load();
    const second = await storage.load();

    expect(first).toEqual(profile);
    expect(second).toEqual(profile);
    expect(first).not.toBe(second);
  });
});
