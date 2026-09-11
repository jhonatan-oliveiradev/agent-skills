import { describe, expect, it } from "vitest";
import { evaluateAssessment } from "./assessment";
import { applyCareerAssessmentResult } from "./assessment-application";
import { baselineAssessmentBlueprints } from "./assessment-blueprints";
import { createEmptyCareerProfile } from "./profile";
import { buildRoadmap } from "./roadmap-engine";
import { getRoleMap } from "./role-maps";

function correctAssessmentResult() {
  const blueprint = baselineAssessmentBlueprints[0];

  return evaluateAssessment(blueprint, {
    blueprintId: blueprint.id,
    blueprintVersion: blueprint.version,
    completedAt: "2026-09-08T12:00:00.000Z",
    answers: Object.fromEntries(
      blueprint.challenges.map((challenge) => [challenge.id, challenge.correctOptionIds]),
    ),
  });
}

describe("assessment -> roadmap integration", () => {
  it("recalculates roadmap and records a material assessment-driven change", () => {
    const empty = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "br",
      weeklyStudyHours: 8,
      now: "2026-09-08T11:00:00.000Z",
    });
    const profile = {
      ...empty,
      roadmap: buildRoadmap(empty, getRoleMap("frontend-developer")),
    };
    const previousFocus = profile.roadmap.currentFocusMilestoneId;

    const next = applyCareerAssessmentResult(profile, correctAssessmentResult());

    expect(previousFocus).toBe("programming-foundations");
    expect(next.roadmap.currentFocusMilestoneId).not.toBe(previousFocus);
    expect(next.decisionRecords.at(-1)).toEqual(
      expect.objectContaining({
        kind: "roadmap-recalculation",
        reason: "assessment",
        beforeMilestoneIds: profile.roadmap.milestoneIds,
        afterMilestoneIds: next.roadmap.milestoneIds,
      }),
    );
    expect(next.evidence.length).toBeGreaterThan(profile.evidence.length);
  });
});
