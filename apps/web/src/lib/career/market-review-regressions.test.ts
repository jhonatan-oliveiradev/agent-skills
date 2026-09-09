import { describe, expect, it } from "vitest";
import { buildMarketSample, applyMarketSample, normalizeJobPosting, parseMarketAnalysisArtifact } from "./market";
import { createEmptyCareerProfile } from "./profile";
import { buildRoadmap } from "./roadmap-engine";
import { getRoleMap } from "./role-maps";
import { parseCareerProfile } from "./schema";
import type { CareerProfile, CompetencyState } from "./types";

function competency(
  competencyId: string,
  level: CompetencyState["level"],
  confidence: CompetencyState["confidence"] = "low",
): CompetencyState {
  return {
    competencyId,
    level,
    confidence,
    evidenceIds: [],
    lastAssessedAt: level ? "2026-09-08T12:00:00.000Z" : null,
  };
}

function frontendProfile(): CareerProfile {
  const empty = createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "Brazil",
    weeklyStudyHours: 8,
    now: "2026-09-08T12:00:00.000Z",
  });
  const profile: CareerProfile = {
    ...empty,
    competencies: [
      competency("programming-javascript", "foundation"),
      competency("programming-typescript", null),
      competency("testing-behavior", null),
    ],
  };
  return {
    ...profile,
    roadmap: buildRoadmap(profile, getRoleMap("frontend-developer")),
  };
}

describe("market review regressions", () => {
  it("fails closed on malformed imported posting fields instead of coercing them", () => {
    const artifact = (posting: Record<string, unknown>) => ({
      schemaVersion: "1",
      artifactType: "market-analysis",
      provenance: { trust: "external-unverified" },
      postings: [
        {
          title: "Frontend Engineer",
          company: "Example Co",
          capturedAt: "2026-09-08T18:00:00.000Z",
          rawSnapshot: "React and TypeScript role.",
          ...posting,
        },
      ],
    });

    expect(() => parseMarketAnalysisArtifact(artifact({ rawSnapshot: 123 }))).toThrow(/rawSnapshot/i);
    expect(() =>
      parseMarketAnalysisArtifact(
        artifact({
          inferredSignals: [
            {
              competencyId: "ui-component-modeling",
              label: 123,
              provenance: "inferred",
            },
          ],
        }),
      ),
    ).toThrow(/label/i);
    expect(() => parseMarketAnalysisArtifact(artifact({ workMode: "teleport" }))).toThrow(/workMode/i);
  });

  it("does not let a market sample for another target role reorder the current roadmap", () => {
    const profile = frontendProfile();
    const posting = normalizeJobPosting({
      title: "Backend Engineer",
      company: "Demand Co",
      source: { type: "pasted", capturedAt: "2026-09-08T20:00:00.000Z" },
      rawSnapshot: "Vitest and Playwright are mandatory.",
    });
    const sample = buildMarketSample([posting], {
      targetRole: "backend-developer",
      targetMarket: "Brazil",
      capturedAt: "2026-09-08T20:00:00.000Z",
    });

    const updated = applyMarketSample(profile, sample);

    expect(updated.roadmap.milestoneIds.indexOf("typed-application-modeling")).toBeLessThan(
      updated.roadmap.milestoneIds.indexOf("testing-real-behavior"),
    );
  });

  it("rejects non-HTTP market source URLs when importing a Career Profile", () => {
    const profile = frontendProfile();
    const posting = normalizeJobPosting({
      title: "Frontend Engineer",
      company: "Example Co",
      source: { type: "pasted", capturedAt: "2026-09-08T18:00:00.000Z" },
      rawSnapshot: "React and TypeScript role.",
    });
    const sample = buildMarketSample([posting], {
      targetRole: "frontend-developer",
      targetMarket: "Brazil",
      capturedAt: "2026-09-08T18:00:00.000Z",
    });
    const unsafe = {
      ...sample,
      postings: sample.postings?.map((candidate) => ({
        ...candidate,
        source: {
          ...candidate.source,
          url: "javascript:alert(1)",
        },
      })),
    };

    expect(() => parseCareerProfile({ ...profile, marketSamples: [unsafe] })).toThrow(/url/i);
  });
});
