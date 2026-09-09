import { describe, expect, it } from "vitest";
import { competencyDefinitions } from "./competencies";
import {
  completeLearningUnit,
  getLearningUnitsForMilestone,
  isLearningUnitCompleted,
} from "./learning";
import { learningUnitCatalog } from "./learning-catalog";
import {
  addEvidence,
  buildPortfolioEvidenceContract,
  createPortfolioEvidenceRecords,
} from "./portfolio-evidence";
import { createEmptyCareerProfile } from "./profile";
import { buildRoadmap, getRoadmapMilestoneViews } from "./roadmap-engine";
import { getRoleMap } from "./role-maps";
import type { CareerProfile } from "./types";

function profileWithRoadmap(): CareerProfile {
  const profile = createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    weeklyStudyHours: 8,
    now: "2026-09-08T18:00:00.000Z",
  });
  return {
    ...profile,
    roadmap: buildRoadmap(profile, getRoleMap("frontend-developer")),
  };
}

describe("targeted career learning", () => {
  it("publishes the six source-controlled V1 microlearning units with bilingual content", () => {
    expect(learningUnitCatalog).toHaveLength(6);
    expect(learningUnitCatalog.map((unit) => unit.competencyId)).toEqual([
      "programming-javascript",
      "programming-typescript",
      "testing-behavior",
      "http-api-engineering",
      "git-collaboration",
      "web-accessibility",
    ]);

    for (const unit of learningUnitCatalog) {
      expect(unit.title.en).toBeTruthy();
      expect(unit.title["pt-BR"]).toBeTruthy();
      expect(unit.objective.en).toBeTruthy();
      expect(unit.objective["pt-BR"]).toBeTruthy();
      expect(unit.explanation.en).toBeTruthy();
      expect(unit.practice.map((prompt) => prompt.kind)).toEqual([
        "example",
        "problem",
        "practice",
        "checkpoint",
        "handoff",
      ]);
      expect(unit.estimatedMinutes).toBeGreaterThan(0);
    }
  });

  it("selects gap-targeted units for a roadmap milestone", () => {
    expect(getLearningUnitsForMilestone("programming-foundations").map((unit) => unit.id)).toContain(
      "async-js-control-flow",
    );
    expect(getLearningUnitsForMilestone("typed-application-modeling").map((unit) => unit.id)).toEqual([
      "typescript-application-modeling",
    ]);
  });

  it("records learning completion only as supporting progress and never as proficiency evidence", () => {
    const profile = profileWithRoadmap();
    const beforeCompetencies = profile.competencies;
    const beforeEvidence = profile.evidence;

    const next = completeLearningUnit(
      profile,
      "programming-foundations",
      "async-js-control-flow",
      "2026-09-08T18:10:00.000Z",
    );

    expect(next.competencies).toEqual(beforeCompetencies);
    expect(next.evidence).toEqual(beforeEvidence);
    expect(next.roadmap.supportingActivityId).toBe(
      "learning:programming-foundations:async-js-control-flow:completed",
    );
    expect(
      isLearningUnitCompleted(next, "programming-foundations", "async-js-control-flow"),
    ).toBe(true);

    const views = getRoadmapMilestoneViews(
      next,
      getRoleMap("frontend-developer"),
      next.roadmap,
    );
    expect(views.find((milestone) => milestone.id === "programming-foundations")?.status).not.toBe(
      "completed",
    );
  });
});

describe("portfolio evidence contracts", () => {
  it("maps one project contract to multiple capabilities without mutating the Career Profile", () => {
    const profile = profileWithRoadmap();
    const before = structuredClone(profile);

    const contract = buildPortfolioEvidenceContract(profile, "ui-state-and-data-flow");

    expect(contract.capabilities.map((claim) => claim.competencyId)).toEqual([
      "ui-component-modeling",
      "state-data-flow",
    ]);
    expect(contract.acceptanceChecklist.length).toBeGreaterThan(2);
    expect(contract.suggestedVerification.length).toBeGreaterThan(0);
    expect(profile).toEqual(before);
    expect(profile.evidence).toHaveLength(0);
  });

  it("adds traceable portfolio evidence through the competency engine and recalibrates the roadmap", () => {
    const profile = profileWithRoadmap();
    const contract = buildPortfolioEvidenceContract(profile, "programming-foundations");
    const records = createPortfolioEvidenceRecords(contract, {
      summary: "Repository demonstrates JavaScript control flow and failure handling.",
      repositoryUrl: "https://github.com/example/project",
      completedChecklistIds: contract.acceptanceChecklist.map((item) => item.id),
      observedAt: "2026-09-08T18:20:00.000Z",
    });

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      competencyId: "programming-javascript",
      class: "E4",
      sourceType: "portfolio",
      trust: "external-unverified",
      demonstratedLevel: "foundation",
      criterionIds: ["programming-javascript.foundation"],
    });

    const next = addEvidence(profile, records[0]!);
    const state = next.competencies.find(
      (candidate) => candidate.competencyId === "programming-javascript",
    );

    expect(state?.level).toBe("foundation");
    expect(state?.confidence).not.toBe("high");
    expect(state?.evidenceIds).toContain(records[0]!.id);
    expect(next.roadmap.currentFocusMilestoneId).not.toBe("programming-foundations");
    expect(next.decisionRecords.at(-1)?.reason).toBe("portfolio-evidence");
  });

  it("fails closed for duplicate ids, unknown competencies, forged criteria and elevated trust", () => {
    const profile = profileWithRoadmap();
    const contract = buildPortfolioEvidenceContract(profile, "programming-foundations");
    const [record] = createPortfolioEvidenceRecords(contract, {
      summary: "A real project artifact.",
      completedChecklistIds: contract.acceptanceChecklist.map((item) => item.id),
      observedAt: "2026-09-08T18:30:00.000Z",
    });
    if (!record) throw new Error("Expected portfolio evidence");

    const next = addEvidence(profile, record);
    expect(() => addEvidence(next, record)).toThrow(/duplicate evidence id/i);

    expect(() =>
      addEvidence(profile, { ...record, id: "evidence:unknown", competencyId: "not-real" }),
    ).toThrow(/unknown competency/i);

    expect(() =>
      addEvidence(profile, {
        ...record,
        id: "evidence:forged-criterion",
        criterionIds: ["programming-typescript.foundation"],
      }),
    ).toThrow(/criterion is not valid/i);

    expect(() =>
      addEvidence(profile, {
        ...record,
        id: "evidence:elevated-trust",
        trust: "local-deterministic",
      }),
    ).toThrow(/external-unverified/i);

    expect(competencyDefinitions.some((definition) => definition.id === record.competencyId)).toBe(
      true,
    );
  });
});
