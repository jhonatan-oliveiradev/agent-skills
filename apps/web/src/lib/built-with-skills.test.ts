import { describe, expect, it } from "vitest";
import {
  getBuiltWithSkillsCaseBySlug,
  getBuiltWithSkillsCases,
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

  it("resolves a case by slug and rejects unknown slugs", () => {
    expect(getBuiltWithSkillsCaseBySlug("en", "catalog-experience")?.title).toBe(
      "Catalog experience",
    );
    expect(getBuiltWithSkillsCaseBySlug("en", "unknown")).toBeUndefined();
  });
});
