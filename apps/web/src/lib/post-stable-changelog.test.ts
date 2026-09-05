import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getProjectPages } from "./project-pages";

const repositoryRoot = resolve(process.cwd(), "../..");

describe("post-Stable changelog", () => {
  it("publishes unreleased changes against the current development version", async () => {
    const [changelog, version] = await Promise.all([
      readFile(resolve(repositoryRoot, "CHANGELOG.md"), "utf8"),
      readFile(resolve(repositoryRoot, "VERSION"), "utf8"),
    ]);

    expect(version.trim()).toBe("1.1.0");
    expect(changelog).toMatch(/^## \[Unreleased\]/m);
    expect(changelog).toContain("ChatGPT-ready skill ZIP");
    expect(changelog).toContain("Method Archive");

    const en = getProjectPages("en").changelog;
    const pt = getProjectPages("pt-BR").changelog;
    const enUnreleased = en.releases[0];
    const ptUnreleased = pt.releases[0];

    expect(enUnreleased.version).toBe(en.unreleased);
    expect(enUnreleased.date).toBe(en.unreleased);
    expect(ptUnreleased.version).toBe(pt.unreleased);
    expect(ptUnreleased.date).toBe(pt.unreleased);

    expect(JSON.stringify(enUnreleased)).toContain("ChatGPT-ready skill ZIP");
    expect(JSON.stringify(enUnreleased)).toContain("Method Archive");
    expect(JSON.stringify(ptUnreleased)).toContain("ZIP");
    expect(JSON.stringify(ptUnreleased)).toContain("Method Archive");
  });
});
