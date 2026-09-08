// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("GET /install", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns an executable textual Bash bootstrap with the deployment SHA pinned", async () => {
    const revision = "f".repeat(40);
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", revision);

    const response = GET();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/text\/(x-shellscript|plain)/i);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(body).toMatch(/^#!\/usr\/bin\/env bash\n/);
    expect(body).toContain("set -euo pipefail");
    expect(body).toContain(revision);
    expect(body).toContain('bash "$installer" "$@"');
  });

  it("falls back to the canonical main ref rather than accepting an unsafe revision", async () => {
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "../../payload");

    const response = GET();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain("/archive/main.tar.gz");
    expect(body).not.toContain("../../payload");
  });
});
