import type {
  CareerProfile,
  JobCapabilitySignal,
  NormalizedJobPosting,
  StructuralRequirement,
} from "./types";

export type JobFitVerdict =
  | "strong-target"
  | "stretch-target"
  | "low-relevance"
  | "blocked";

export interface JobFitCapabilitySignal {
  readonly competencyId: string;
  readonly label: string;
  readonly provenance: "explicit" | "inferred";
}

export interface JobFitAnalysis {
  readonly verdict: JobFitVerdict;
  readonly readinessPercentage: number;
  readonly matches: readonly JobFitCapabilitySignal[];
  readonly capabilityGaps: readonly JobFitCapabilitySignal[];
  readonly evidenceGaps: readonly JobFitCapabilitySignal[];
  readonly structuralGaps: readonly StructuralRequirement[];
  readonly hardConstraints: readonly StructuralRequirement[];
}

function postingCapabilitySignals(
  posting: NormalizedJobPosting,
): readonly JobFitCapabilitySignal[] {
  const byCompetency = new Map<string, JobCapabilitySignal>();
  for (const signal of posting.explicitSignals) {
    byCompetency.set(signal.competencyId, signal);
  }
  for (const signal of posting.inferredSignals) {
    if (!byCompetency.has(signal.competencyId)) {
      byCompetency.set(signal.competencyId, signal);
    }
  }
  return [...byCompetency.values()];
}

function hasInspectableEvidence(profile: CareerProfile, competencyId: string): boolean {
  const state = profile.competencies.find((candidate) => candidate.competencyId === competencyId);
  if (!state) return false;
  const evidenceIds = new Set(state.evidenceIds);
  return profile.evidence.some(
    (record) =>
      record.competencyId === competencyId &&
      evidenceIds.has(record.id) &&
      record.trust !== "user-claimed",
  );
}

function verdictFor(
  readinessPercentage: number,
  capabilityGaps: readonly JobFitCapabilitySignal[],
  evidenceGaps: readonly JobFitCapabilitySignal[],
  structuralGaps: readonly StructuralRequirement[],
  hardConstraints: readonly StructuralRequirement[],
): JobFitVerdict {
  if (hardConstraints.length > 0) return "blocked";
  if (
    readinessPercentage >= 80 &&
    capabilityGaps.length === 0 &&
    evidenceGaps.length === 0 &&
    structuralGaps.length === 0
  ) {
    return "strong-target";
  }
  if (readinessPercentage >= 50 || evidenceGaps.length > 0) return "stretch-target";
  return "low-relevance";
}

export function analyzeJobFit(
  profile: CareerProfile,
  posting: NormalizedJobPosting,
): JobFitAnalysis {
  const signals = postingCapabilitySignals(posting);
  const matches: JobFitCapabilitySignal[] = [];
  const capabilityGaps: JobFitCapabilitySignal[] = [];
  const evidenceGaps: JobFitCapabilitySignal[] = [];

  for (const signal of signals) {
    const state = profile.competencies.find(
      (candidate) => candidate.competencyId === signal.competencyId,
    );
    if (!state || state.level === null) {
      capabilityGaps.push(signal);
      continue;
    }
    if (state.confidence === "low" || !hasInspectableEvidence(profile, signal.competencyId)) {
      evidenceGaps.push(signal);
      continue;
    }
    matches.push(signal);
  }

  const hardConstraints = posting.structuralRequirements.filter(
    (requirement) => requirement.hard && requirement.status === "unmet",
  );
  const structuralGaps = posting.structuralRequirements.filter(
    (requirement) =>
      requirement.status !== "met" &&
      !(requirement.hard && requirement.status === "unmet"),
  );
  const capabilityCoverage = matches.length + evidenceGaps.length;
  const readinessPercentage =
    signals.length === 0 ? 0 : Math.round((capabilityCoverage / signals.length) * 100);

  return {
    verdict: verdictFor(
      readinessPercentage,
      capabilityGaps,
      evidenceGaps,
      structuralGaps,
      hardConstraints,
    ),
    readinessPercentage,
    matches,
    capabilityGaps,
    evidenceGaps,
    structuralGaps,
    hardConstraints,
  };
}
