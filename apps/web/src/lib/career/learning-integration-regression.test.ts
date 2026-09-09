import { describe, expect, it } from "vitest";
import { completeLearningUnit } from "./learning";
import { createEmptyCareerProfile } from "./profile";

describe("career learning integration regressions", () => {
  it("derives the active roadmap before recording learning progress on first interaction", () => {
    const profile = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now: "2026-09-08T18:00:00.000Z",
    });

    const next = completeLearningUnit(
      profile,
      "programming-foundations",
      "async-js-control-flow",
      "2026-09-08T18:05:00.000Z",
    );

    expect(next.roadmap.milestoneIds).toContain("programming-foundations");
    expect(next.roadmap.currentFocusMilestoneId).toBe("programming-foundations");
    expect(next.roadmap.supportingActivityId).toBe(
      "learning:programming-foundations:async-js-control-flow:completed",
    );
    expect(next.evidence).toEqual(profile.evidence);
    expect(next.competencies).toEqual(profile.competencies);
  });
});
