import { describe, expect, it } from "vitest";
import {
  competencyDefinitions,
  competencyIds,
  deriveCompetencyState,
  programmingJavaScript,
  testingBehavior,
} from "./competencies";
import { deriveEvidenceConfidence, maxLevelAllowedByEvidence } from "./evidence";
import { roleMaps } from "./role-maps";
import type { EvidenceClass, EvidenceRecord, EvidenceTrust, ProficiencyLevel } from "./types";

function observation(input: {
  id: string;
  competencyId: string;
  evidenceClass: EvidenceClass;
  demonstratedLevel: ProficiencyLevel;
  criterionIds: readonly string[];
  observedAt?: string;
  trust?: EvidenceTrust;
}): EvidenceRecord {
  return {
    id: input.id,
    competencyId: input.competencyId,
    class: input.evidenceClass,
    sourceType: input.evidenceClass === "E0" ? "self-report" : "assessment",
    trust: input.trust ?? (input.evidenceClass === "E0" ? "user-claimed" : "local-deterministic"),
    observedAt: input.observedAt ?? new Date().toISOString(),
    summary: `${input.evidenceClass} observation for ${input.competencyId}`,
    demonstratedLevel: input.demonstratedLevel,
    criterionIds: input.criterionIds,
  };
}

function criterionIdsAtOrBelowEvidenceClass(
  definition: {
    readonly criteria: readonly {
      readonly id: string;
      readonly minimumEvidenceClass: EvidenceClass;
    }[];
  },
  maximumClass: EvidenceClass,
): readonly string[] {
  const rank: Record<EvidenceClass, number> = { E0: 0, E1: 1, E2: 2, E3: 3, E4: 4 };
  return definition.criteria
    .filter((criterion) => rank[criterion.minimumEvidenceClass] <= rank[maximumClass])
    .map((criterion) => criterion.id);
}

describe("competency evidence gates", () => {
  it("never promotes self-report alone to proficient", () => {
    const state = deriveCompetencyState(programmingJavaScript, [
      observation({
        id: "self-js",
        competencyId: "programming-javascript",
        evidenceClass: "E0",
        demonstratedLevel: "advanced",
        criterionIds: programmingJavaScript.criteria.map((criterion) => criterion.id),
      }),
    ]);

    expect(state.level).not.toBe("proficient");
    expect(state.level).not.toBe("advanced");
  });

  it("does not average away a failed blocking performance dimension", () => {
    const state = deriveCompetencyState(testingBehavior, [
      observation({
        id: "testing-knowledge",
        competencyId: "testing-behavior",
        evidenceClass: "E1",
        demonstratedLevel: "advanced",
        criterionIds: criterionIdsAtOrBelowEvidenceClass(testingBehavior, "E1"),
      }),
      observation({
        id: "testing-reasoning",
        competencyId: "testing-behavior",
        evidenceClass: "E2",
        demonstratedLevel: "advanced",
        criterionIds: criterionIdsAtOrBelowEvidenceClass(testingBehavior, "E2"),
      }),
      observation({
        id: "testing-performance",
        competencyId: "testing-behavior",
        evidenceClass: "E3",
        demonstratedLevel: "foundation",
        criterionIds: criterionIdsAtOrBelowEvidenceClass(testingBehavior, "E3"),
      }),
    ]);

    expect(state.level).toBe("developing");
  });

  it("reduces confidence for old evidence without erasing the demonstrated level", () => {
    const state = deriveCompetencyState(programmingJavaScript, [
      observation({
        id: "old-js-performance",
        competencyId: "programming-javascript",
        evidenceClass: "E3",
        demonstratedLevel: "proficient",
        criterionIds: criterionIdsAtOrBelowEvidenceClass(programmingJavaScript, "E3"),
        observedAt: "2020-01-01T00:00:00.000Z",
      }),
    ]);

    expect(state.level).toBe("proficient");
    expect(state.confidence).not.toBe("high");
  });

  it("caps confidence below high when external-unverified is the only performance evidence", () => {
    const records = [
      observation({
        id: "external-performance-1",
        competencyId: "programming-javascript",
        evidenceClass: "E3",
        demonstratedLevel: "proficient",
        criterionIds: criterionIdsAtOrBelowEvidenceClass(programmingJavaScript, "E3"),
        trust: "external-unverified",
      }),
      observation({
        id: "external-performance-2",
        competencyId: "programming-javascript",
        evidenceClass: "E4",
        demonstratedLevel: "advanced",
        criterionIds: programmingJavaScript.criteria.map((criterion) => criterion.id),
        trust: "external-unverified",
      }),
    ] as const;

    expect(deriveEvidenceConfidence(records)).not.toBe("high");
  });

  it("uses evidence classes only as a cap, not as an averaging score", () => {
    expect(
      maxLevelAllowedByEvidence([
        observation({
          id: "reasoning-only",
          competencyId: "programming-javascript",
          evidenceClass: "E2",
          demonstratedLevel: "advanced",
          criterionIds: criterionIdsAtOrBelowEvidenceClass(programmingJavaScript, "E2"),
        }),
      ]),
    ).toBe("developing");
  });

  it("lets performance evidence unlock the advanced cap while criteria remain authoritative", () => {
    expect(
      maxLevelAllowedByEvidence([
        observation({
          id: "performance-cap",
          competencyId: "programming-javascript",
          evidenceClass: "E3",
          demonstratedLevel: "proficient",
          criterionIds: criterionIdsAtOrBelowEvidenceClass(programmingJavaScript, "E3"),
        }),
      ]),
    ).toBe("advanced");
  });
});

describe("canonical competency and role-map contracts", () => {
  it("defines exactly the canonical V1 competency IDs", () => {
    expect(competencyIds).toEqual([
      "programming-javascript",
      "programming-typescript",
      "web-platform-foundations",
      "ui-component-modeling",
      "state-data-flow",
      "web-accessibility",
      "http-api-engineering",
      "node-runtime-foundations",
      "relational-data-modeling",
      "testing-behavior",
      "git-collaboration",
      "application-security-foundations",
      "architecture-boundaries",
      "professional-evidence",
    ]);
  });

  it("defines observable criteria for every proficiency level", () => {
    const levels = ["foundation", "developing", "proficient", "advanced"] as const;

    for (const definition of competencyDefinitions) {
      for (const level of levels) {
        expect(
          definition.criteria.some((criterion) => criterion.level === level),
          `${definition.id} missing ${level} criteria`,
        ).toBe(true);
      }
    }
  });

  it("has exactly three role maps and every requirement uses a canonical competency ID", () => {
    expect(roleMaps.map((role) => role.roleId)).toEqual([
      "frontend-developer",
      "backend-developer",
      "fullstack-developer",
    ]);

    const canonical = new Set<string>(competencyIds);
    for (const role of roleMaps) {
      for (const requirement of role.requirements) {
        expect(canonical.has(requirement.competencyId)).toBe(true);
      }
    }
  });

  it("keeps competency prerequisites acyclic", () => {
    const definitions = new Map<string, (typeof competencyDefinitions)[number]>(
      competencyDefinitions.map((definition) => [definition.id, definition]),
    );
    const visiting = new Set<string>();
    const visited = new Set<string>();

    const visit = (id: string): void => {
      if (visiting.has(id)) throw new Error(`prerequisite cycle at ${id}`);
      if (visited.has(id)) return;

      visiting.add(id);
      for (const prerequisite of definitions.get(id)?.prerequisites ?? []) visit(prerequisite);
      visiting.delete(id);
      visited.add(id);
    };

    for (const id of competencyIds) visit(id);
    expect(visited.size).toBe(competencyIds.length);
  });

  it("specializes Frontend, Backend, and Full-stack around stable capability families", () => {
    const frontend = roleMaps.find((role) => role.roleId === "frontend-developer");
    const backend = roleMaps.find((role) => role.roleId === "backend-developer");
    const fullstack = roleMaps.find((role) => role.roleId === "fullstack-developer");

    expect(frontend).toBeDefined();
    expect(backend).toBeDefined();
    expect(fullstack).toBeDefined();
    if (!frontend || !backend || !fullstack) throw new Error("missing V1 role map");

    const ids = (role: (typeof roleMaps)[number]) =>
      new Set<string>(role.requirements.map((requirement) => requirement.competencyId));

    for (const competencyId of ["ui-component-modeling", "state-data-flow", "web-accessibility"]) {
      expect(ids(frontend).has(competencyId)).toBe(true);
      expect(ids(fullstack).has(competencyId)).toBe(true);
    }
    for (const competencyId of [
      "http-api-engineering",
      "node-runtime-foundations",
      "relational-data-modeling",
    ]) {
      expect(ids(backend).has(competencyId)).toBe(true);
      expect(ids(fullstack).has(competencyId)).toBe(true);
    }
  });

  it("does not bake framework or cloud-vendor names into stable role baselines", () => {
    const serialized = JSON.stringify(roleMaps).toLowerCase();
    for (const trendName of ["react", "next.js", "nextjs", "playwright", "aws", "azure", "gcp"]) {
      expect(serialized).not.toContain(trendName);
    }
  });
});
