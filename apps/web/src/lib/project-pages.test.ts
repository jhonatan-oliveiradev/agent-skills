import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { getProjectPages } from "./project-pages";

describe("project page content", () => {
  it.each(["en", "pt-BR"] as const)("provides complete institutional content in %s", (locale) => {
    const content = getProjectPages(locale);

    expect(content.about.principles).toHaveLength(5);
    expect(content.contribute.paths).toHaveLength(4);
    expect(content.changelog.releases[0]).toMatchObject({ version: "1.0.0-beta.1" });
    expect(content.changelog.releases[0].groups.flatMap((group) => group.items).length).toBeGreaterThanOrEqual(6);
  });
});
