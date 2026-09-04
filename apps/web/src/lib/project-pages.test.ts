import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { getProjectPages } from "./project-pages";

describe("project page content", () => {
  it.each(["en", "pt-BR"] as const)("provides complete institutional content in %s", (locale) => {
    const content = getProjectPages(locale);

    expect(content.about.principles).toHaveLength(5);
    expect(content.contribute.paths).toHaveLength(4);
    expect(content.changelog.releases[0]).toMatchObject({
      version: content.changelog.unreleased,
      date: content.changelog.unreleased,
    });
    expect(content.changelog.releases[1]).toMatchObject({
      version: "1.0.0",
      date: "2026-09-02",
    });
    expect(content.changelog.releases[2]).toMatchObject({
      version: "1.0.0-rc.2",
      date: "2026-09-02",
    });

    const releaseItems = content.changelog.releases[1].groups.flatMap((group) => group.items);
    const releaseText = releaseItems.join(" ");

    expect(releaseItems.length).toBeGreaterThanOrEqual(6);
    expect(releaseText).toMatch(/54/);
    expect(releaseText).toMatch(/11/);
    expect(releaseText).toMatch(/Codebase Intelligence/i);
    expect(releaseText).toMatch(/stable|estável/i);
  });

  it.each(["en", "pt-BR"] as const)("keeps About, Contribute, and Changelog on distinct editorial jobs for %s", (locale) => {
    const content = getProjectPages(locale);

    expect(content.about.purpose.length).toBeGreaterThan(40);
    expect(content.about.principles.length).toBeGreaterThan(0);
    expect(content.contribute.paths.some((path) => path.href.endsWith("/issues/new"))).toBe(true);
    expect(content.contribute.paths.some((path) => path.href.endsWith("/compare"))).toBe(true);
    expect(content.contribute.expectations.length).toBeGreaterThan(0);
    expect(content.changelog.releases.every((release) => release.groups.length > 0)).toBe(true);

    const institutionalSummaries = [
      content.about.summary,
      content.contribute.summary,
      content.changelog.summary,
    ];
    expect(new Set(institutionalSummaries).size).toBe(3);
    expect(institutionalSummaries.join(" ")).not.toMatch(/Skills are not prompts|Skills não são prompts/);
  });

  it.each([
    [
      "en",
      "working methods",
      "Contribute a focused improvement.",
      "Prepare a pull request",
      "Published releases and unreleased changes",
      "Inspect source changelog",
    ],
    [
      "pt-BR",
      "métodos de trabalho",
      "Contribua com uma melhoria focada.",
      "Preparar um pull request",
      "Releases publicadas e mudanças não lançadas",
      "Inspecionar changelog na fonte",
    ],
  ] as const)(
    "keeps institutional language factual and action-specific for %s",
    (locale, methodTerm, contributeTitle, pullRequestAction, releasesLabel, sourceAction) => {
      const content = getProjectPages(locale);

      expect(content.about.summary).toContain(methodTerm);
      expect(`${content.about.summary} ${content.about.purpose}`).not.toMatch(
        /proven working practices|práticas comprovadas/i,
      );
      expect(content.contribute.title).toBe(contributeTitle);
      expect(content.contribute.paths[2].action).toBe(pullRequestAction);
      expect(content.changelog.releasesLabel).toBe(releasesLabel);
      expect(content.changelog.sourceAction).toBe(sourceAction);
      expect(content.changelog.releases[0]).toMatchObject({
        version: content.changelog.unreleased,
        date: content.changelog.unreleased,
      });
    },
  );
});
