import type {
  ConfidenceLevel,
  EvidenceClass,
  EvidenceRecord,
  ProficiencyLevel,
} from "./types";

export const evidenceClassRank: Readonly<Record<EvidenceClass, number>> = {
  E0: 0,
  E1: 1,
  E2: 2,
  E3: 3,
  E4: 4,
};

const proficiencyRank: Readonly<Record<ProficiencyLevel, number>> = {
  foundation: 0,
  developing: 1,
  proficient: 2,
  advanced: 3,
};

function isPerformanceEvidence(record: EvidenceRecord): boolean {
  return record.class === "E3" || record.class === "E4";
}

function isRecent(record: EvidenceRecord, nowMs: number): boolean {
  const observedMs = Date.parse(record.observedAt);
  if (!Number.isFinite(observedMs)) return false;
  const ageDays = Math.max(0, (nowMs - observedMs) / 86_400_000);
  return ageDays <= 365;
}

function hasContradictoryObservations(records: readonly EvidenceRecord[]): boolean {
  const observedLevels = new Map<string, ProficiencyLevel[]>();

  for (const record of records) {
    if (!record.demonstratedLevel || !record.criterionIds) continue;
    for (const criterionId of record.criterionIds) {
      const levels = observedLevels.get(criterionId) ?? [];
      levels.push(record.demonstratedLevel);
      observedLevels.set(criterionId, levels);
    }
  }

  return [...observedLevels.values()].some((levels) => {
    if (levels.length < 2) return false;
    const ranks = levels.map((level) => proficiencyRank[level]);
    return Math.max(...ranks) - Math.min(...ranks) >= 2;
  });
}

export function maxLevelAllowedByEvidence(
  records: readonly EvidenceRecord[],
): ProficiencyLevel | null {
  if (records.length === 0) return null;
  if (records.every((record) => record.class === "E0")) return "developing";
  if (!records.some(isPerformanceEvidence)) return "developing";
  return "advanced";
}

export function deriveEvidenceConfidence(
  records: readonly EvidenceRecord[],
  now = new Date(),
): ConfidenceLevel {
  if (records.length === 0) return "low";

  const performance = records.filter(isPerformanceEvidence);
  const recentPerformance = performance.filter((record) => isRecent(record, now.getTime()));
  const distinctClasses = new Set(records.map((record) => record.class));
  const contradictory = hasContradictoryObservations(records);
  const performanceIsOnlyExternal =
    performance.length > 0 && performance.every((record) => record.trust === "external-unverified");
  const trustedPerformance = performance.filter(
    (record) => record.trust === "local-deterministic",
  );

  if (
    !contradictory &&
    !performanceIsOnlyExternal &&
    trustedPerformance.length >= 2 &&
    recentPerformance.length > 0 &&
    distinctClasses.size >= 2
  ) {
    return "high";
  }

  if (performance.length > 0 && (recentPerformance.length > 0 || distinctClasses.size >= 2)) {
    return "medium";
  }

  return "low";
}
