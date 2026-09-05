import type { CompetencyId } from "./competencies";
import type { RoleCapabilityMap, RoleRequirement } from "./role-maps";
import type { CareerProfile, EvidenceRecord, ProficiencyLevel, TargetRoleId } from "./types";

export interface RoleReadiness {
  readonly roleId: TargetRoleId;
  readonly percentage: number;
  readonly demonstrated: readonly CompetencyId[];
  readonly capabilityGaps: readonly CompetencyId[];
  readonly evidenceGaps: readonly CompetencyId[];
  readonly blockingGaps: readonly CompetencyId[];
}

const proficiencyRank: Readonly<Record<ProficiencyLevel, number>> = {
  foundation: 0,
  developing: 1,
  proficient: 2,
  advanced: 3,
};

function levelMeets(
  observed: ProficiencyLevel | null,
  required: ProficiencyLevel,
): boolean {
  return observed !== null && proficiencyRank[observed] >= proficiencyRank[required];
}

function evidenceForRequirement(
  profile: CareerProfile,
  requirement: RoleRequirement,
  evidenceIds: readonly string[],
): readonly EvidenceRecord[] {
  const ids = new Set(evidenceIds);
  return profile.evidence.filter(
    (record) => record.competencyId === requirement.competencyId && ids.has(record.id),
  );
}

function evidenceIsSufficient(
  requirement: RoleRequirement,
  records: readonly EvidenceRecord[],
  confidence: "low" | "medium" | "high",
): boolean {
  if (records.length === 0 || confidence === "low") return false;

  if (requirement.requiredLevel === "advanced") {
    return records.some((record) => record.class === "E4" && record.trust !== "user-claimed");
  }

  if (requirement.requiredLevel === "proficient") {
    const performance = records.filter((record) => record.class === "E3" || record.class === "E4");
    if (performance.length === 0) return false;
    return !performance.every((record) => record.trust === "external-unverified");
  }

  return records.some(
    (record) => record.class !== "E0" && record.trust !== "user-claimed",
  );
}

function unique(values: readonly CompetencyId[]): readonly CompetencyId[] {
  return [...new Set(values)];
}

export function calculateRoleReadiness(
  profile: CareerProfile,
  roleMap: RoleCapabilityMap,
): RoleReadiness {
  const demonstrated: CompetencyId[] = [];
  const capabilityGaps: CompetencyId[] = [];
  const evidenceGaps: CompetencyId[] = [];
  const blockingGaps: CompetencyId[] = [];

  for (const requirement of roleMap.requirements) {
    const state = profile.competencies.find(
      (candidate) => candidate.competencyId === requirement.competencyId,
    );
    const hasCapability = state ? levelMeets(state.level, requirement.requiredLevel) : false;

    if (!hasCapability) {
      capabilityGaps.push(requirement.competencyId);
      if (requirement.required) blockingGaps.push(requirement.competencyId);
      continue;
    }

    const records = evidenceForRequirement(profile, requirement, state?.evidenceIds ?? []);
    const hasEvidence = evidenceIsSufficient(
      requirement,
      records,
      state?.confidence ?? "low",
    );

    if (!hasEvidence) {
      evidenceGaps.push(requirement.competencyId);
      if (requirement.required) blockingGaps.push(requirement.competencyId);
      continue;
    }

    demonstrated.push(requirement.competencyId);
  }

  const percentage =
    roleMap.requirements.length === 0
      ? 0
      : Math.round((demonstrated.length / roleMap.requirements.length) * 100);

  return {
    roleId: roleMap.roleId,
    percentage,
    demonstrated: unique(demonstrated),
    capabilityGaps: unique(capabilityGaps),
    evidenceGaps: unique(evidenceGaps),
    blockingGaps: unique(blockingGaps),
  };
}
