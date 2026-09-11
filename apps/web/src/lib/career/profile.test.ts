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
});
