import { describe, expect, it } from "vitest";
import { migrateCareerProfile } from "./migrations";
import { CAREER_PROFILE_SCHEMA_VERSION, createEmptyCareerProfile } from "./profile";

describe("createEmptyCareerProfile", () => {
  it("creates a v2 profile with explicit empty learning progress and no roadmap focus", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now: "2026-09-04T23:45:00.000Z",
    });

    expect(profile).toMatchObject({
      schemaVersion: "2",
      targetRoles: ["frontend-developer"],
      targetMarkets: ["br"],
      weeklyStudyHours: 8,
      competencies: [],
      assessments: [],
      evidence: [],
      marketSamples: [],
      decisionRecords: [],
      learningProgress: [],
      roadmap: {
        milestoneIds: [],
        currentFocusMilestoneId: null,
        supportingActivityId: null,
      },
      createdAt: "2026-09-04T23:45:00.000Z",
      updatedAt: "2026-09-04T23:45:00.000Z",
    });
    expect(CAREER_PROFILE_SCHEMA_VERSION).toBe("2");
  });

  it("keeps weekly study capacity nullable when the user has not supplied it", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "backend-developer",
      targetMarket: "remote-international",
      now: "2026-09-04T23:45:00.000Z",
    });

    expect(profile.weeklyStudyHours).toBeNull();
  });

  it("migrates a valid v1 profile to v2 without changing professional state", () => {
    const v1 = {
      schemaVersion: "1",
      targetRoles: ["frontend-developer"],
      targetMarkets: ["br"],
      weeklyStudyHours: 8,
      competencies: [],
      assessments: [],
      roadmap: {
        milestoneIds: [],
        currentFocusMilestoneId: null,
        supportingActivityId: null,
      },
      evidence: [],
      marketSamples: [],
      decisionRecords: [],
      createdAt: "2026-09-01T12:00:00.000Z",
      updatedAt: "2026-09-01T12:00:00.000Z",
    };

    expect(migrateCareerProfile(v1)).toEqual({
      ...v1,
      schemaVersion: "2",
      learningProgress: [],
    });
  });

  it("copies only known v1 fields during migration", () => {
    const v1 = {
      schemaVersion: "1",
      targetRoles: ["frontend-developer"],
      targetMarkets: ["br"],
      weeklyStudyHours: 8,
      competencies: [],
      assessments: [],
      roadmap: {
        milestoneIds: [],
        currentFocusMilestoneId: null,
        supportingActivityId: null,
      },
      evidence: [],
      marketSamples: [],
      decisionRecords: [],
      createdAt: "2026-09-01T12:00:00.000Z",
      updatedAt: "2026-09-01T12:00:00.000Z",
      staleLegacyField: "must-not-survive",
    };

    expect(migrateCareerProfile(v1)).toEqual({
      schemaVersion: "2",
      targetRoles: v1.targetRoles,
      targetMarkets: v1.targetMarkets,
      weeklyStudyHours: v1.weeklyStudyHours,
      competencies: v1.competencies,
      assessments: v1.assessments,
      roadmap: v1.roadmap,
      learningProgress: [],
      evidence: v1.evidence,
      marketSamples: v1.marketSamples,
      decisionRecords: v1.decisionRecords,
      createdAt: v1.createdAt,
      updatedAt: v1.updatedAt,
    });
  });

  it("rejects v2 learning progress whose note is absent from the curated catalog", () => {
    const profile = {
      ...createEmptyCareerProfile({
        targetRole: "frontend-developer",
        targetMarket: "br",
        now: "2026-09-11T12:00:00.000Z",
      }),
      learningProgress: [
        {
          noteId: "unknown-note",
          startedAt: "2026-09-11T12:00:00.000Z",
          updatedAt: "2026-09-11T12:10:00.000Z",
          currentModuleId: null,
          completedModuleIds: [],
          completedPracticeIds: [],
          completedAt: null,
        },
      ],
    };

    expect(() => migrateCareerProfile(profile)).toThrow(/unknown learning note/i);
  });
});
