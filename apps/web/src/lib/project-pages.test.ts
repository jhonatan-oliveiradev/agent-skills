import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { getProjectPages } from "./project-pages";

describe("project page content", () => {
  it.each(["en", "pt-BR"] as const)("provides complete institutional content in %s", (locale) => {
    const content = getProjectPages(locale);

    expect(content.about.principles).toHaveLength(5);
    expect(content.contribute.paths).toHaveLength(4);
    expect(content.changelog.releases[0]).toMatchObject({
      version: "1.0.0-rc.2",
      date: "2026-09-02",
    });

    const releaseItems = content.changelog.releases[0].groups.flatMap((group) => group.items);
    const releaseText = releaseItems.join(" ");

    expect(releaseItems.length).toBeGreaterThanOrEqual(6);
    expect(releaseText).toMatch(/54/);
    expect(releaseText).toMatch(/11/);
    expect(releaseText).toMatch(/Codebase Intelligence/i);
  });
});
