import { describe, expect, it } from "vitest";
import { createEmptyCareerProfile } from "./profile";
import { calculateRoleReadiness } from "./readiness";
import { getRoleMap } from "./role-maps";
import type { CareerProfile, CompetencyState, EvidenceRecord, ProficiencyLevel } from "./types";

function satisfiedProfile(roleId: "frontend-developer" | "backend-developer" | "fullstack-developer") {
  const roleMap = getRoleMap(roleId);
  const base = createEmptyCareerProfile({
    targetRole: roleId,
    targetMarket: "br",
    now: "2026-09-04T12:00:00.000Z",
  });

  const competencies: CompetencyState[] = [];
  const evidence: EvidenceRecord[] = [];

  for (const requirement of roleMap.requirements) {
    const evidenceId = `ev-${requirement.competencyId}`;
    competencies.push({
      competencyId: requirement.competencyId,
      level: requirement.requiredLevel,
      confidence: "high",
      evidenceIds: [evidenceId],
      lastAssessedAt: "2026-09-04T12:00:00.000Z",
    });
    evidence.push({
      id: evidenceId,
      competencyId: requirement.competencyId,
      class: "E4",
      sourceType: "portfolio",
      trust: "local-deterministic",
      observedAt: "2026-09-04T12:00:00.000Z",
      summary: `Verified evidence for ${requirement.competencyId}`,
      demonstratedLevel: requirement.requiredLevel,
      criterionIds: [],
    });
  }

  return {
    profile: { ...base, competencies, evidence } satisfies CareerProfile,
    roleMap,
  };
}

function replaceCompetencyLevel(
  profile: CareerProfile,
  competencyId: string,
  level: ProficiencyLevel,
  confidence: "low" | "medium" | "high" = "high",
): CareerProfile {
  return {
    ...profile,
    competencies: profile.competencies.map((state) =>
      state.competencyId === competencyId ? { ...state, level, confidence } : state,
    ),
  };
}

describe("role readiness", () => {
  it("returns explainable capability, evidence, and blocking gaps", () => {
    const { profile: satisfied, roleMap } = satisfiedProfile("frontend-developer");
    let profile = replaceCompetencyLevel(satisfied, "web-accessibility", "foundation", "low");
    profile = replaceCompetencyLevel(profile, "ui-component-modeling", "proficient", "low");
    profile = {
      ...profile,
      evidence: profile.evidence.map((record) =>
        record.competencyId === "ui-component-modeling"
          ? { ...record, class: "E3", trust: "external-unverified" }
          : record,
      ),
    };

    const readiness = calculateRoleReadiness(profile, roleMap);

    expect(readiness.capabilityGaps).toContain("web-accessibility");
    expect(readiness.evidenceGaps).toContain("ui-component-modeling");
    expect(readiness.blockingGaps).toContain("web-accessibility");
    expect(readiness.blockingGaps).toContain("ui-component-modeling");
    expect(readiness.demonstrated).toContain("programming-javascript");
    expect(readiness.percentage).toBeLessThan(100);
  });

  it("does not let a high secondary percentage hide a required blocker", () => {
    const { profile: satisfied, roleMap } = satisfiedProfile("frontend-developer");
    const profile = replaceCompetencyLevel(satisfied, "web-accessibility", "foundation", "high");

    const readiness = calculateRoleReadiness(profile, roleMap);

    expect(readiness.percentage).toBeGreaterThan(80);
    expect(readiness.blockingGaps).toContain("web-accessibility");
    expect(readiness.capabilityGaps).toContain("web-accessibility");
  });

  it("reports a fully evidenced baseline as demonstrated without named gaps", () => {
    const { profile, roleMap } = satisfiedProfile("backend-developer");

    const readiness = calculateRoleReadiness(profile, roleMap);

    expect(readiness.percentage).toBe(100);
    expect(readiness.demonstrated).toHaveLength(roleMap.requirements.length);
    expect(readiness.capabilityGaps).toEqual([]);
    expect(readiness.evidenceGaps).toEqual([]);
    expect(readiness.blockingGaps).toEqual([]);
  });
});
