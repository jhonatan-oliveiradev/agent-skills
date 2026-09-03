import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getRealUsePackCoverage } from "./real-use-pack-coverage";

const repositoryRoot = resolve(process.cwd(), "../..");

describe("real-use pack coverage", () => {
  it("derives current active-pack coverage from inspectable real-use cases", () => {
    expect(getRealUsePackCoverage()).toEqual({
      coveredPackSlugs: [
        "application-security",
        "architecture-engineering",
        "codebase-intelligence",
        "engineering-workflow",
        "frontend-product",
        "game-development",
        "motion",
        "quality-testing",
        "writing-communication",
      ],
      uncoveredPackSlugs: ["backend-data", "design-brand"],
      coveredCount: 9,
      totalActivePacks: 11,
    });
  });

  it("keeps current evidence from regressing below the Stable 1.0.0 snapshot", async () => {
    const readiness = JSON.parse(
      await readFile(resolve(repositoryRoot, "release/stable-readiness.json"), "utf8"),
    );
    const currentCoverage = getRealUsePackCoverage();

    expect(readiness.observed.activePacksRepresented).toBe(5);
    expect(currentCoverage.coveredCount).toBeGreaterThanOrEqual(
      readiness.observed.activePacksRepresented,
    );
  });
});
