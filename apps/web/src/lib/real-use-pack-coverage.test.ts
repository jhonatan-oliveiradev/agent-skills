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
        "codebase-intelligence",
        "frontend-product",
        "quality-testing",
        "writing-communication",
      ],
      uncoveredPackSlugs: [
        "architecture-engineering",
        "backend-data",
        "design-brand",
        "engineering-workflow",
        "game-development",
        "motion",
      ],
      coveredCount: 5,
      totalActivePacks: 11,
    });
  });

  it("keeps the Stable readiness observed pack count aligned with derived evidence", async () => {
    const readiness = JSON.parse(
      await readFile(resolve(repositoryRoot, "release/stable-readiness.json"), "utf8"),
    );

    expect(readiness.observed.activePacksRepresented).toBe(
      getRealUsePackCoverage().coveredCount,
    );
  });
});
