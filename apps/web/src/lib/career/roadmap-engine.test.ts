import { describe, expect, it } from "vitest";
import { createEmptyCareerProfile } from "./profile";
import { getRoleMap } from "./role-maps";
import {
  buildRoadmap,
  completeMilestoneIfEligible,
  getRoadmapMilestoneViews,
  recalculateRoadmap,
} from "./roadmap-engine";
import {
  getRoadmapMilestone,
  roadmapMilestoneCatalog,
} from "./roadmap-catalog";
import type {
  CareerProfile,
  CompetencyState,
  EvidenceClass,
  EvidenceRecord,
  ProficiencyLevel,
} from "./types";

function baseProfile(role: "frontend-developer" | "backend-developer" | "fullstack-developer") {
  return createEmptyCareerProfile({
    targetRole: role,
    targetMarket: "br",
    weeklyStudyHours: 8,
    now: "2026-09-07T14:00:00.000Z",
  });
}

function withDemonstratedCompetency(
  profile: CareerProfile,
  competencyId: string,
  level: ProficiencyLevel,
  evidenceClass: EvidenceClass,
): CareerProfile {
  const evidenceId = `evidence:${competencyId}:${level}:${evidenceClass}`;
  const evidence: EvidenceRecord = {
    id: evidenceId,
    competencyId,
    class: evidenceClass,
    sourceType: "assessment",
    trust: "local-deterministic",
    observedAt: "2026-09-07T14:10:00.000Z",
    summary: `Demonstrated ${competencyId} at ${level}`,
    demonstratedLevel: level,
    criterionIds: [`${competencyId}.${level}`],
  };
  const state: CompetencyState = {
    competencyId,
    level,
    confidence: "medium",
    evidenceIds: [evidenceId],
    lastAssessedAt: evidence.observedAt,
  };

  return {
    ...profile,
    competencies: [
      ...profile.competencies.filter((candidate) => candidate.competencyId !== competencyId),
      state,
    ],
    evidence: [
      ...profile.evidence.filter((candidate) => candidate.id !== evidenceId),
      evidence,
    ],
  };
}

describe("adaptive roadmap engine", () => {
  it("publishes the stable capability milestone catalog without framework-specific milestones", () => {
    expect(roadmapMilestoneCatalog.map((milestone) => milestone.id)).toEqual([
      "programming-foundations",
      "async-application-control-flow",
      "typed-application-modeling",
      "web-interface-foundations",
      "ui-state-and-data-flow",
      "testing-real-behavior",
      "accessible-web-interfaces",
      "http-api-boundaries",
      "node-runtime-services",
      "relational-data-foundations",
      "application-security-basics",
      "architecture-boundaries",
      "portfolio-proof",
    ]);

    expect(JSON.stringify(roadmapMilestoneCatalog)).not.toMatch(/react|next\.js|playwright|aws|vercel/i);
  });

  it("keeps real prerequisites ahead of children even when market activity is high", () => {
    const profile: CareerProfile = {
      ...baseProfile("frontend-developer"),
      marketSamples: [
        {
          id: "market-1",
          targetRole: "frontend-developer",
          targetMarket: "br",
          capturedAt: "2026-09-07T14:15:00.000Z",
          postingCount: 500,
          distinctCompanyCount: 300,
          distinctSourceCount: 8,
        },
      ],
    };

    const roadmap = buildRoadmap(profile, getRoleMap("frontend-developer"));

    expect(roadmap.milestoneIds.indexOf("programming-foundations")).toBeLessThan(
      roadmap.milestoneIds.indexOf("typed-application-modeling"),
    );
    expect(roadmap.currentFocusMilestoneId).toBe("programming-foundations");
    expect(
      getRoadmapMilestoneViews(profile, getRoleMap("frontend-developer"), roadmap).find(
        (milestone) => milestone.id === "typed-application-modeling",
      )?.status,
    ).toBe("locked");
  });

  it("unlocks dependents only after prerequisite capability and evidence gates are satisfied", () => {
    let profile = baseProfile("frontend-developer");
    const roadmap = buildRoadmap(profile, getRoleMap("frontend-developer"));

    profile = withDemonstratedCompetency(
      profile,
      "programming-javascript",
      "foundation",
      "E1",
    );

    const completed = completeMilestoneIfEligible(
      { ...profile, roadmap },
      "programming-foundations",
    );
    const views = getRoadmapMilestoneViews(
      { ...profile, roadmap: completed },
      getRoleMap("frontend-developer"),
      completed,
    );

    expect(views.find((milestone) => milestone.id === "programming-foundations")?.status).toBe(
      "completed",
    );
    expect(views.find((milestone) => milestone.id === "typed-application-modeling")?.status).not.toBe(
      "locked",
    );
  });

  it("does not complete a milestone when activity exists but the mandatory evidence gate is missing", () => {
    const profile = withDemonstratedCompetency(
      baseProfile("frontend-developer"),
      "programming-javascript",
      "foundation",
      "E0",
    );
    const roadmap = buildRoadmap(profile, getRoleMap("frontend-developer"));
    const next = completeMilestoneIfEligible(
      { ...profile, roadmap, roadmap: { ...roadmap, supportingActivityId: "learning:programming-foundations" } },
      "programming-foundations",
    );

    expect(next.currentFocusMilestoneId).toBe("programming-foundations");
    expect(
      getRoadmapMilestoneViews(
        { ...profile, roadmap: next },
        getRoleMap("frontend-developer"),
        next,
      ).find((milestone) => milestone.id === "programming-foundations")?.status,
    ).not.toBe("completed");
  });

  it("selects at most one primary current focus", () => {
    const profile = baseProfile("fullstack-developer");
    const roadmap = buildRoadmap(profile, getRoleMap("fullstack-developer"));
    const views = getRoadmapMilestoneViews(profile, getRoleMap("fullstack-developer"), roadmap);

    expect(views.filter((milestone) => milestone.status === "in-progress")).toHaveLength(1);
    expect(views.filter((milestone) => milestone.id === roadmap.currentFocusMilestoneId)).toHaveLength(1);
  });

  it("recalculates for a target change without mutating demonstrated competencies or evidence", () => {
    const demonstrated = withDemonstratedCompetency(
      baseProfile("frontend-developer"),
      "programming-javascript",
      "developing",
      "E2",
    );
    const frontendRoadmap = buildRoadmap(demonstrated, getRoleMap("frontend-developer"));
    const changed: CareerProfile = {
      ...demonstrated,
      targetRoles: ["backend-developer"],
      roadmap: frontendRoadmap,
    };

    const result = recalculateRoadmap(changed, "target-change");

    expect(changed.competencies).toEqual(demonstrated.competencies);
    expect(changed.evidence).toEqual(demonstrated.evidence);
    expect(result.roadmap.milestoneIds).not.toEqual(frontendRoadmap.milestoneIds);
    expect(result.decisionRecord?.reason).toBe("target-change");
    expect(result.decisionRecord?.beforeMilestoneIds).toEqual(frontendRoadmap.milestoneIds);
    expect(result.decisionRecord?.afterMilestoneIds).toEqual(result.roadmap.milestoneIds);
  });

  it("emits no decision record when recalculation does not meaningfully change roadmap ordering or focus", () => {
    const profile = baseProfile("frontend-developer");
    const roadmap = buildRoadmap(profile, getRoleMap("frontend-developer"));
    const result = recalculateRoadmap({ ...profile, roadmap }, "assessment");

    expect(result.roadmap).toEqual(roadmap);
    expect(result.decisionRecord).toBeNull();
  });

  it("fails closed for unknown milestone ids", () => {
    expect(() => getRoadmapMilestone("not-a-milestone")).toThrow(/unknown roadmap milestone/i);
  });
});
