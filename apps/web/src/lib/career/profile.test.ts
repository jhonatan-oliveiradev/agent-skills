import { describe, expect, it } from "vitest";
import { CAREER_PROFILE_SCHEMA_VERSION, createEmptyCareerProfile } from "./profile";

describe("createEmptyCareerProfile", () => {
  it("creates a minimal profile with explicit empty collections and no roadmap focus", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now: "2026-09-04T23:45:00.000Z",
    });

    expect(profile).toMatchObject({
      schemaVersion: CAREER_PROFILE_SCHEMA_VERSION,
      targetRoles: ["frontend-developer"],
      targetMarkets: ["br"],
      weeklyStudyHours: 8,
      competencies: [],
      assessments: [],
      evidence: [],
      marketSamples: [],
      decisionRecords: [],
      roadmap: {
        milestoneIds: [],
        currentFocusMilestoneId: null,
        supportingActivityId: null,
      },
      createdAt: "2026-09-04T23:45:00.000Z",
      updatedAt: "2026-09-04T23:45:00.000Z",
    });
  });

  it("keeps weekly study capacity nullable when the user has not supplied it", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "backend-developer",
      targetMarket: "remote-international",
      now: "2026-09-04T23:45:00.000Z",
    });

    expect(profile.weeklyStudyHours).toBeNull();
  });
});
