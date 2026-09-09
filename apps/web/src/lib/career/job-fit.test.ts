import { describe, expect, it } from "vitest";
import { createEmptyCareerProfile } from "./profile";
import type { CareerProfile, CompetencyState, EvidenceRecord } from "./types";

type Posting = {
  readonly explicitSignals: readonly { competencyId: string; provenance: string; label: string }[];
  readonly inferredSignals?: readonly { competencyId: string; provenance: string; label: string }[];
  readonly structuralRequirements: readonly {
    kind: string;
    label: string;
    hard: boolean;
    status: "met" | "unmet" | "unknown";
  }[];
};

type MarketModule = {
  normalizeJobPosting(input: Record<string, unknown>): Posting;
};

type FitModule = {
  analyzeJobFit(
    profile: CareerProfile,
    posting: Posting,
  ): {
    verdict: "strong-target" | "stretch-target" | "low-relevance" | "blocked";
    readinessPercentage: number;
    matches: readonly unknown[];
    capabilityGaps: readonly unknown[];
    evidenceGaps: readonly unknown[];
    structuralGaps: readonly unknown[];
    hardConstraints: readonly unknown[];
  };
};

async function loadModule<T>(path: string): Promise<T> {
  try {
    return (await import(path)) as T;
  } catch (error) {
    expect(error, `expected ${path} to load after implementation`).toBeUndefined();
    return null as T;
  }
}

function state(
  competencyId: string,
  level: CompetencyState["level"],
  confidence: CompetencyState["confidence"],
  evidenceIds: readonly string[] = [],
): CompetencyState {
  return {
    competencyId,
    level,
    confidence,
    evidenceIds,
    lastAssessedAt: level ? "2026-09-08T12:00:00.000Z" : null,
  };
}

function evidence(id: string, competencyId: string): EvidenceRecord {
  return {
    id,
    competencyId,
    class: "E3",
    sourceType: "assessment",
    trust: "local-deterministic",
    observedAt: "2026-09-08T12:00:00.000Z",
    summary: "Verified performance evidence",
    demonstratedLevel: "proficient",
    criterionIds: [`${competencyId}.proficient`],
  };
}

describe("Career job fit", () => {
  it("keeps capability, evidence, structural, and hard-constraint gaps separate", async () => {
    const market = await loadModule<MarketModule>("./market");
    const fit = await loadModule<FitModule>("./job-fit");
    const base = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "Brazil",
      now: "2026-09-08T12:00:00.000Z",
    });
    const tsEvidence = evidence("evidence:ts", "programming-typescript");
    const profile: CareerProfile = {
      ...base,
      competencies: [
        state("programming-typescript", "proficient", "high", [tsEvidence.id]),
        state("ui-component-modeling", "proficient", "low", []),
      ],
      evidence: [tsEvidence],
    };
    const posting = market.normalizeJobPosting({
      title: "Frontend Engineer",
      company: "Example Co",
      source: { type: "pasted", capturedAt: "2026-09-08T18:00:00.000Z" },
      rawSnapshot: "React, TypeScript and Vitest. 5+ years of product experience.",
      structuralRequirements: [
        {
          kind: "experience",
          label: "5+ years of product experience",
          hard: false,
          status: "unknown",
        },
      ],
    });

    const analysis = fit.analyzeJobFit(profile, posting);

    expect(analysis.matches).toEqual(
      expect.arrayContaining([expect.objectContaining({ competencyId: "programming-typescript" })]),
    );
    expect(analysis.evidenceGaps).toEqual(
      expect.arrayContaining([expect.objectContaining({ competencyId: "ui-component-modeling" })]),
    );
    expect(analysis.capabilityGaps).toEqual(
      expect.arrayContaining([expect.objectContaining({ competencyId: "testing-behavior" })]),
    );
    expect(analysis.structuralGaps).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "experience" })]),
    );
    expect(analysis.hardConstraints).toHaveLength(0);
  });

  it("returns blocked when an explicitly unmet hard constraint exists regardless of capability match", async () => {
    const market = await loadModule<MarketModule>("./market");
    const fit = await loadModule<FitModule>("./job-fit");
    const base = createEmptyCareerProfile({
      targetRole: "frontend-developer",
      targetMarket: "Brazil",
      now: "2026-09-08T12:00:00.000Z",
    });
    const tsEvidence = evidence("evidence:ts", "programming-typescript");
    const uiEvidence = evidence("evidence:ui", "ui-component-modeling");
    const profile: CareerProfile = {
      ...base,
      competencies: [
        state("programming-typescript", "proficient", "high", [tsEvidence.id]),
        state("ui-component-modeling", "proficient", "high", [uiEvidence.id]),
      ],
      evidence: [tsEvidence, uiEvidence],
    };
    const posting = market.normalizeJobPosting({
      title: "Frontend Engineer",
      company: "Example Co",
      source: { type: "pasted", capturedAt: "2026-09-08T18:00:00.000Z" },
      rawSnapshot: "React and TypeScript are required.",
      structuralRequirements: [
        {
          kind: "work-authorization",
          label: "Must already be authorized to work in the United States",
          hard: true,
          status: "unmet",
        },
      ],
    });

    const analysis = fit.analyzeJobFit(profile, posting);

    expect(analysis.readinessPercentage).toBe(100);
    expect(analysis.verdict).toBe("blocked");
    expect(analysis.hardConstraints).toEqual([
      expect.objectContaining({ kind: "work-authorization", status: "unmet" }),
    ]);
  });
});
