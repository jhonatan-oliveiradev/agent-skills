import { describe, expect, it, vi } from "vitest";
import {
  CAREER_GUIDANCE_STORAGE_KEY,
  createBrowserCareerGuidanceStorage,
} from "./guidance-storage";

function makeStorage(initial: string | null = null) {
  let value = initial;
  return {
    getItem: vi.fn((key: string) => (key === CAREER_GUIDANCE_STORAGE_KEY ? value : null)),
    setItem: vi.fn((key: string, next: string) => {
      if (key === CAREER_GUIDANCE_STORAGE_KEY) value = next;
    }),
  };
}

describe("Career Lab guidance storage", () => {
  it("returns unseen when the versioned guidance key is missing", async () => {
    const storage = makeStorage();
    const subject = createBrowserCareerGuidanceStorage(storage);

    await expect(subject.load()).resolves.toEqual({ orientationStatus: "unseen" });
  });

  it("loads each valid terminal orientation state", async () => {
    for (const orientationStatus of ["completed", "skipped"] as const) {
      const storage = makeStorage(JSON.stringify({ orientationStatus }));
      const subject = createBrowserCareerGuidanceStorage(storage);
      await expect(subject.load()).resolves.toEqual({ orientationStatus });
    }
  });

  it("falls back to unseen for invalid JSON or unsupported state", async () => {
    await expect(createBrowserCareerGuidanceStorage(makeStorage("not-json")).load()).resolves.toEqual({
      orientationStatus: "unseen",
    });
    await expect(
      createBrowserCareerGuidanceStorage(
        makeStorage(JSON.stringify({ orientationStatus: "dismissed" })),
      ).load(),
    ).resolves.toEqual({ orientationStatus: "unseen" });
  });

  it("saves to the exact versioned key", async () => {
    const storage = makeStorage();
    const subject = createBrowserCareerGuidanceStorage(storage);

    await subject.save({ orientationStatus: "skipped" });

    expect(CAREER_GUIDANCE_STORAGE_KEY).toBe("career-lab:guidance:v1");
    expect(storage.setItem).toHaveBeenCalledWith(
      "career-lab:guidance:v1",
      JSON.stringify({ orientationStatus: "skipped" }),
    );
  });
});
