import { describe, expect, it } from "vitest";
import {
  getBuiltWithSkillsCaseBySlug,
  getBuiltWithSkillsCases,
  hasInspectableRealUseEvidence,
} from "./built-with-skills";

describe("built with skills records", () => {
  it.each(["en", "pt-BR"] as const)("publishes two localized cases for %s", (locale) => {
    const cases = getBuiltWithSkillsCases(locale);

    expect(cases).toHaveLength(2);
    expect(cases.map((item) => item.slug)).toEqual([
      "catalog-experience",
      "pack-experience",
    ]);
    expect(cases.every((item) => item.skills.length === 3)).toBe(true);
    expect(cases.every((item) => item.results.length > 0)).toBe(true);
  });

  it("classifies the existing self-hosted records as internal evidence", () => {
    const cases = getBuiltWithSkillsCases("en");

    for (const item of cases) {
      expect(item.evidenceClass).toBe("internal");
      expect(item.project).toEqual({
        id: "agent-skills-studio",
        name: "Agent Skills Studio",
        repository: "https://github.com/jhonatan-oliveiradev/agent-skills",
      });
    }
  });

  it("publishes explicit source evidence instead of inferring verification", () => {
    const cases = getBuiltWithSkillsCases("en");

    for (const item of cases) {
      expect(item.evidence).toHaveLength(1);
      expect(item.evidence[0]).toMatchObject({
        type: "source",
        label: "Source record",
      });
      expect(item.evidence[0]?.href).toBe(
        `https://github.com/jhonatan-oliveiradev/agent-skills/blob/main/${item.sourcePath}`,
      );
    }
  });

  it("requires inspectable project evidence before a case can count as real-use", () => {
    const internalCase = getBuiltWithSkillsCases("en")[0]!;
    const sourceOnlyRealUse = {
      ...internalCase,
      evidenceClass: "real-use" as const,
      project: { id: "example-project", name: "Example project" },
    };

    expect(hasInspectableRealUseEvidence(internalCase)).toBe(true);
    expect(hasInspectableRealUseEvidence(sourceOnlyRealUse)).toBe(false);
    expect(hasInspectableRealUseEvidence({
      ...sourceOnlyRealUse,
      evidence: [
        ...sourceOnlyRealUse.evidence,
        {
          type: "commit" as const,
          label: "Implementation commit",
          href: "https://github.com/example/project/commit/abc123",
        },
      ],
    })).toBe(true);
  });

  it("resolves a case by slug and rejects unknown slugs", () => {
    expect(getBuiltWithSkillsCaseBySlug("en", "catalog-experience")?.title).toBe(
      "Catalog experience",
    );
    expect(getBuiltWithSkillsCaseBySlug("en", "unknown")).toBeUndefined();
  });
});
