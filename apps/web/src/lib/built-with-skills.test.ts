import { describe, expect, it } from "vitest";
import {
  getBuiltWithSkillsCaseBySlug,
  getBuiltWithSkillsCases,
  hasInspectableRealUseEvidence,
} from "./built-with-skills";

describe("built with skills records", () => {
  it.each(["en", "pt-BR"] as const)("publishes seven localized cases for %s", (locale) => {
    const cases = getBuiltWithSkillsCases(locale);

    expect(cases).toHaveLength(7);
    expect(cases.map((item) => item.slug)).toEqual([
      "rocket-codebase-intelligence-cosmic-sdk-removal",
      "rocket-editorial-error-boundary",
      "ping-space-voice-membership-authorization",
      "portfolio-translation-hardening",
      "portfolio-project-isr-engineering-workflow",
      "catalog-experience",
      "pack-experience",
    ]);
    expect(cases.every((item) => item.skills.length > 0)).toBe(true);
    expect(cases.every((item) => item.results.length > 0)).toBe(true);
  });

  it("classifies the existing self-hosted records as internal evidence", () => {
    const cases = getBuiltWithSkillsCases("en").filter(
      (item) => item.project.id === "agent-skills-studio",
    );

    expect(cases).toHaveLength(2);
    for (const item of cases) {
      expect(item.evidenceClass).toBe("internal");
      expect(item.project).toEqual({
        id: "agent-skills-studio",
        name: "Agent Skills Studio",
        repository: "https://github.com/jhonatan-oliveiradev/agent-skills",
      });
    }
  });

  it("publishes explicit source evidence for the internal records", () => {
    const cases = getBuiltWithSkillsCases("en").filter(
      (item) => item.evidenceClass === "internal",
    );

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

  it("publishes Rocket Codebase Intelligence as full-pack public-safe real-use evidence", () => {
    const item = getBuiltWithSkillsCaseBySlug(
      "en",
      "rocket-codebase-intelligence-cosmic-sdk-removal",
    );

    expect(item).toBeDefined();
    expect(item?.evidenceClass).toBe("real-use");
    expect(item?.project).toEqual({
      id: "rocket-unesp",
      name: "Rocket UNESP",
    });
    expect(item?.skills).toEqual([
      "mapping-existing-codebase-structure",
      "investigating-codebase-semantically",
      "tracing-code-execution-paths",
      "analyzing-change-blast-radius",
      "planning-codebase-changes-with-evidence",
    ]);
    expect(item?.evidence.map((entry) => entry.type)).toEqual(["source", "qa"]);
    expect(
      item?.evidence.every((entry) =>
        entry.href.startsWith(
          "https://github.com/jhonatan-oliveiradev/agent-skills/",
        ),
      ),
    ).toBe(true);
    expect(item?.evidence.some((entry) => entry.href.includes("/rocket-inst/"))).toBe(false);
    expect(item && hasInspectableRealUseEvidence(item)).toBe(true);
  });

  it("publishes Rocket as inspectable public-safe real-use evidence", () => {
    const item = getBuiltWithSkillsCaseBySlug("en", "rocket-editorial-error-boundary");

    expect(item).toBeDefined();
    expect(item?.evidenceClass).toBe("real-use");
    expect(item?.project).toEqual({
      id: "rocket-unesp",
      name: "Rocket UNESP",
    });
    expect(item?.skills).toEqual([
      "building-premium-nextjs-interfaces",
      "writing-product-and-ux-copy",
    ]);
    expect(item?.evidence.map((entry) => entry.type)).toEqual(["source", "qa"]);
    expect(
      item?.evidence.every((entry) =>
        entry.href.startsWith(
          "https://github.com/jhonatan-oliveiradev/agent-skills/",
        ),
      ),
    ).toBe(true);
    expect(item?.evidence.some((entry) => entry.href.includes("/rocket-inst/"))).toBe(false);
    expect(item && hasInspectableRealUseEvidence(item)).toBe(true);
  });

  it("publishes PING as inspectable public-safe real-use evidence", () => {
    const item = getBuiltWithSkillsCaseBySlug(
      "en",
      "ping-space-voice-membership-authorization",
    );

    expect(item).toBeDefined();
    expect(item?.evidenceClass).toBe("real-use");
    expect(item?.project).toEqual({
      id: "ping",
      name: "PING",
    });
    expect(item?.skills).toEqual([
      "selecting-working-methods",
      "reviewing-api-security",
      "building-regression-tests",
      "testing-integration-boundaries",
      "shipping-github-vercel-changes",
    ]);
    expect(item?.evidence.map((entry) => entry.type)).toEqual(["source", "qa"]);
    expect(
      item?.evidence.every((entry) =>
        entry.href.startsWith(
          "https://github.com/jhonatan-oliveiradev/agent-skills/",
        ),
      ),
    ).toBe(true);
    expect(item?.evidence.some((entry) => entry.href.includes("/ping/"))).toBe(false);
    expect(item && hasInspectableRealUseEvidence(item)).toBe(true);
  });

  it("publishes Portfolio 2025 translation hardening as inspectable public-safe real-use evidence", () => {
    const item = getBuiltWithSkillsCaseBySlug("en", "portfolio-translation-hardening");

    expect(item).toBeDefined();
    expect(item?.evidenceClass).toBe("real-use");
    expect(item?.project).toEqual({
      id: "portfolio-2025",
      name: "Portfolio 2025",
    });
    expect(item?.skills).toEqual([
      "selecting-working-methods",
      "building-regression-tests",
      "testing-integration-boundaries",
      "shipping-github-vercel-changes",
    ]);
    expect(item?.evidence.map((entry) => entry.type)).toEqual(["source", "qa"]);
    expect(
      item?.evidence.every((entry) =>
        entry.href.startsWith(
          "https://github.com/jhonatan-oliveiradev/agent-skills/",
        ),
      ),
    ).toBe(true);
    expect(item && hasInspectableRealUseEvidence(item)).toBe(true);
  });

  it("publishes Portfolio 2025 Engineering Workflow as full-pack public-safe real-use evidence", () => {
    const item = getBuiltWithSkillsCaseBySlug(
      "en",
      "portfolio-project-isr-engineering-workflow",
    );

    expect(item).toBeDefined();
    expect(item?.evidenceClass).toBe("real-use");
    expect(item?.project).toEqual({
      id: "portfolio-2025",
      name: "Portfolio 2025",
    });
    expect(item?.skills).toEqual([
      "planning-engineering-work",
      "managing-implementation-slices",
      "reviewing-pull-requests",
      "writing-effective-technical-handoffs",
    ]);
    expect(item?.evidence.map((entry) => entry.type)).toEqual(["source", "qa"]);
    expect(
      item?.evidence.every((entry) =>
        entry.href.startsWith(
          "https://github.com/jhonatan-oliveiradev/agent-skills/",
        ),
      ),
    ).toBe(true);
    expect(item?.evidence.some((entry) => entry.href.includes("/portfolio-2025/"))).toBe(false);
    expect(item && hasInspectableRealUseEvidence(item)).toBe(true);
  });

  it("requires inspectable project evidence before a case can count as real-use", () => {
    const internalCase = getBuiltWithSkillsCases("en").find(
      (item) => item.evidenceClass === "internal",
    )!;
    const sourceOnlyRealUse = {
      ...internalCase,
      evidenceClass: "real-use" as const,
      project: { id: "example-project", name: "Example project" },
    };

    expect(hasInspectableRealUseEvidence(internalCase)).toBe(true);
    expect(hasInspectableRealUseEvidence(sourceOnlyRealUse)).toBe(false);
    expect(
      hasInspectableRealUseEvidence({
        ...sourceOnlyRealUse,
        evidence: [
          ...sourceOnlyRealUse.evidence,
          {
            type: "commit" as const,
            label: "Implementation commit",
            href: "https://github.com/example/project/commit/abc123",
          },
        ],
      }),
    ).toBe(true);
  });

  it("resolves a case by slug and rejects unknown slugs", () => {
    expect(getBuiltWithSkillsCaseBySlug("en", "catalog-experience")?.title).toBe(
      "Catalog experience",
    );
    expect(getBuiltWithSkillsCaseBySlug("en", "unknown")).toBeUndefined();
  });
});
