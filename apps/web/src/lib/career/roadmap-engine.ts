import type { CompetencyId } from "./competencies";
import { evidenceClassRank } from "./evidence";
import {
  getRoadmapMilestone,
  roadmapMilestoneCatalog,
  type RoadmapMilestoneDefinition,
} from "./roadmap-catalog";
import { getRoleMap, type RoleCapabilityMap } from "./role-maps";
import type {
  CareerProfile,
  DecisionRecord,
  EvidenceClass,
  EvidenceRecord,
  MarketSample,
  MilestoneStatus,
  ProficiencyLevel,
  RoadmapState,
} from "./types";

export type RoadmapRecalculationReason =
  | "assessment"
  | "portfolio-evidence"
  | "market-update"
  | "target-change";

export interface RoadmapPriorityFactors {
  readonly requiredRoleCompetencies: readonly CompetencyId[];
  readonly capabilityGapCount: number;
  readonly evidenceGapCount: number;
  readonly marketSampleAvailable: boolean;
  readonly marketSignalCount: number;
  readonly estimatedEffortHours: Readonly<{ min: number; max: number }>;
}

export interface RoadmapMilestoneView extends RoadmapMilestoneDefinition {
  readonly status: MilestoneStatus;
  readonly capabilityGaps: readonly CompetencyId[];
  readonly evidenceGaps: readonly CompetencyId[];
  readonly priorityFactors: RoadmapPriorityFactors;
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

function competencyState(profile: CareerProfile, competencyId: CompetencyId) {
  return profile.competencies.find((state) => state.competencyId === competencyId);
}

function relevantEvidence(
  profile: CareerProfile,
  competencyId: CompetencyId,
): readonly EvidenceRecord[] {
  const state = competencyState(profile, competencyId);
  if (!state) return [];
  const evidenceIds = new Set(state.evidenceIds);
  return profile.evidence.filter(
    (record) => record.competencyId === competencyId && evidenceIds.has(record.id),
  );
}

function evidenceMeets(
  profile: CareerProfile,
  competencyId: CompetencyId,
  minimumClass: EvidenceClass,
): boolean {
  return relevantEvidence(profile, competencyId).some(
    (record) =>
      record.trust !== "user-claimed" &&
      evidenceClassRank[record.class] >= evidenceClassRank[minimumClass],
  );
}

function capabilityGaps(
  profile: CareerProfile,
  milestone: RoadmapMilestoneDefinition,
): readonly CompetencyId[] {
  return milestone.requirements
    .filter((requirement) => {
      const state = competencyState(profile, requirement.competencyId);
      return !levelMeets(state?.level ?? null, requirement.targetLevel);
    })
    .map((requirement) => requirement.competencyId);
}

function evidenceGaps(
  profile: CareerProfile,
  milestone: RoadmapMilestoneDefinition,
): readonly CompetencyId[] {
  return milestone.evidenceRequirements
    .filter(
      (requirement) =>
        !evidenceMeets(
          profile,
          requirement.competencyId,
          requirement.minimumClass,
        ),
    )
    .map((requirement) => requirement.competencyId);
}

function milestoneIsComplete(
  profile: CareerProfile,
  milestone: RoadmapMilestoneDefinition,
): boolean {
  return capabilityGaps(profile, milestone).length === 0 && evidenceGaps(profile, milestone).length === 0;
}

function applicableMilestones(roleMap: RoleCapabilityMap) {
  return roadmapMilestoneCatalog.filter((milestone) =>
    milestone.applicableRoles.includes(roleMap.roleId),
  );
}

function roleRequirementRank(
  milestone: RoadmapMilestoneDefinition,
  roleMap: RoleCapabilityMap,
): number {
  const requirementIds = new Set(
    milestone.requirements.map((requirement) => requirement.competencyId),
  );
  const ranks = roleMap.requirements
    .filter((requirement) => requirement.required && requirementIds.has(requirement.competencyId))
    .map((requirement) => proficiencyRank[requirement.requiredLevel]);
  return ranks.length === 0 ? -1 : Math.max(...ranks);
}

function normalizedMarket(value: string): string {
  return value.trim().toLocaleLowerCase("en-US");
}

function marketSampleApplies(profile: CareerProfile, sample: MarketSample): boolean {
  if (sample.targetRole && !profile.targetRoles.includes(sample.targetRole)) return false;
  if (
    sample.targetMarket &&
    !profile.targetMarkets.some(
      (market) => normalizedMarket(market) === normalizedMarket(sample.targetMarket as string),
    )
  ) {
    return false;
  }
  return true;
}

function latestMarketSample(profile: CareerProfile): MarketSample | null {
  return (
    [...profile.marketSamples]
      .sort((left, right) => right.capturedAt.localeCompare(left.capturedAt))
      .find(
        (sample) =>
          marketSampleApplies(profile, sample) && (sample.signals?.length ?? 0) > 0,
      ) ?? null
  );
}

function marketRelevanceScore(
  profile: CareerProfile,
  milestone: RoadmapMilestoneDefinition,
): number {
  const sample = latestMarketSample(profile);
  if (!sample?.signals) return 0;
  const milestoneCompetencies = new Set(
    milestone.requirements.map((requirement) => requirement.competencyId),
  );
  return sample.signals
    .filter((signal) => milestoneCompetencies.has(signal.competencyId as CompetencyId))
    .reduce((sum, signal) => sum + signal.postingCount, 0);
}

function comparePriority(
  left: RoadmapMilestoneDefinition,
  right: RoadmapMilestoneDefinition,
  profile: CareerProfile,
  roleMap: RoleCapabilityMap,
): number {
  const roleRank = roleRequirementRank(right, roleMap) - roleRequirementRank(left, roleMap);
  if (roleRank !== 0) return roleRank;

  const leftGapCount = capabilityGaps(profile, left).length + evidenceGaps(profile, left).length;
  const rightGapCount = capabilityGaps(profile, right).length + evidenceGaps(profile, right).length;
  if (leftGapCount !== rightGapCount) return rightGapCount - leftGapCount;

  const marketRank = marketRelevanceScore(profile, right) - marketRelevanceScore(profile, left);
  if (marketRank !== 0) return marketRank;

  const effort = left.estimatedEffortHours.min - right.estimatedEffortHours.min;
  if (effort !== 0) return effort;

  return (
    roadmapMilestoneCatalog.indexOf(left as (typeof roadmapMilestoneCatalog)[number]) -
    roadmapMilestoneCatalog.indexOf(right as (typeof roadmapMilestoneCatalog)[number])
  );
}

function orderMilestones(
  profile: CareerProfile,
  roleMap: RoleCapabilityMap,
): readonly RoadmapMilestoneDefinition[] {
  const relevant = applicableMilestones(roleMap);
  const relevantIds = new Set(relevant.map((milestone) => milestone.id));
  const remaining = new Map(relevant.map((milestone) => [milestone.id, milestone] as const));
  const ordered: RoadmapMilestoneDefinition[] = [];
  const orderedIds = new Set<string>();

  while (remaining.size > 0) {
    const candidates = [...remaining.values()].filter((milestone) =>
      milestone.prerequisites
        .filter((prerequisiteId) => relevantIds.has(prerequisiteId))
        .every((prerequisiteId) => orderedIds.has(prerequisiteId)),
    );

    if (candidates.length === 0) {
      throw new Error("Career roadmap milestone graph contains a dependency cycle");
    }

    candidates.sort((left, right) => comparePriority(left, right, profile, roleMap));
    const selected = candidates[0];
    if (!selected) throw new Error("Career roadmap could not select a milestone");
    ordered.push(selected);
    orderedIds.add(selected.id);
    remaining.delete(selected.id);
  }

  return ordered;
}

function prerequisitesComplete(
  profile: CareerProfile,
  milestone: RoadmapMilestoneDefinition,
  roleMap: RoleCapabilityMap,
): boolean {
  const applicableIds = new Set(
    applicableMilestones(roleMap).map((candidate) => candidate.id),
  );
  return milestone.prerequisites
    .filter((prerequisiteId) => applicableIds.has(prerequisiteId))
    .every((prerequisiteId) => milestoneIsComplete(profile, getRoadmapMilestone(prerequisiteId)));
}

function nextCurrentFocus(
  profile: CareerProfile,
  roleMap: RoleCapabilityMap,
  ordered: readonly RoadmapMilestoneDefinition[],
): string | null {
  return (
    ordered.find(
      (milestone) =>
        !milestoneIsComplete(profile, milestone) &&
        prerequisitesComplete(profile, milestone, roleMap),
    )?.id ?? null
  );
}

function preservedSupportingActivity(
  profile: CareerProfile,
  milestoneIds: readonly string[],
): string | null {
  const supporting = profile.roadmap.supportingActivityId;
  if (!supporting) return null;
  return milestoneIds.some((milestoneId) => supporting.includes(milestoneId))
    ? supporting
    : null;
}

export function buildRoadmap(
  profile: CareerProfile,
  roleMap: RoleCapabilityMap,
): RoadmapState {
  if (!profile.targetRoles.includes(roleMap.roleId)) {
    throw new Error(`Career roadmap role mismatch: ${roleMap.roleId}`);
  }

  const ordered = orderMilestones(profile, roleMap);
  const milestoneIds = ordered.map((milestone) => milestone.id);
  return {
    milestoneIds,
    currentFocusMilestoneId: nextCurrentFocus(profile, roleMap, ordered),
    supportingActivityId: preservedSupportingActivity(profile, milestoneIds),
  };
}

function requiredRoleCompetencies(
  milestone: RoadmapMilestoneDefinition,
  roleMap: RoleCapabilityMap,
): readonly CompetencyId[] {
  const milestoneCompetencies = new Set(
    milestone.requirements.map((requirement) => requirement.competencyId),
  );
  return roleMap.requirements
    .filter(
      (requirement) =>
        requirement.required && milestoneCompetencies.has(requirement.competencyId),
    )
    .map((requirement) => requirement.competencyId);
}

export function getRoadmapMilestoneViews(
  profile: CareerProfile,
  roleMap: RoleCapabilityMap,
  roadmap: RoadmapState = buildRoadmap(profile, roleMap),
): readonly RoadmapMilestoneView[] {
  const marketSample = latestMarketSample(profile);
  return roadmap.milestoneIds.map((milestoneId) => {
    const milestone = getRoadmapMilestone(milestoneId);
    const openCapabilities = capabilityGaps(profile, milestone);
    const openEvidence = evidenceGaps(profile, milestone);
    const completed = openCapabilities.length === 0 && openEvidence.length === 0;
    const unlocked = prerequisitesComplete(profile, milestone, roleMap);
    const capabilityReady = openCapabilities.length === 0;

    let status: MilestoneStatus;
    if (completed) status = "completed";
    else if (!unlocked) status = "locked";
    else if (capabilityReady && openEvidence.length > 0) status = "ready-for-assessment";
    else if (roadmap.currentFocusMilestoneId === milestone.id) status = "in-progress";
    else status = "available";

    return {
      ...milestone,
      status,
      capabilityGaps: openCapabilities,
      evidenceGaps: openEvidence,
      priorityFactors: {
        requiredRoleCompetencies: requiredRoleCompetencies(milestone, roleMap),
        capabilityGapCount: openCapabilities.length,
        evidenceGapCount: openEvidence.length,
        marketSampleAvailable: marketSample !== null,
        marketSignalCount: marketRelevanceScore(profile, milestone),
        estimatedEffortHours: milestone.estimatedEffortHours,
      },
    };
  });
}

function roadmapEqual(left: RoadmapState, right: RoadmapState): boolean {
  return (
    left.currentFocusMilestoneId === right.currentFocusMilestoneId &&
    left.supportingActivityId === right.supportingActivityId &&
    left.milestoneIds.length === right.milestoneIds.length &&
    left.milestoneIds.every((id, index) => id === right.milestoneIds[index])
  );
}

function decisionForRecalculation(
  profile: CareerProfile,
  reason: RoadmapRecalculationReason,
  roadmap: RoadmapState,
): DecisionRecord {
  const beforeFocus = profile.roadmap.currentFocusMilestoneId ?? "none";
  const afterFocus = roadmap.currentFocusMilestoneId ?? "none";
  return {
    id: `decision:roadmap:${reason}:${profile.updatedAt}`,
    kind: reason === "target-change" ? "target-change" : "roadmap-recalculation",
    reason,
    summary:
      `Roadmap recalculated after ${reason}. ` +
      `Current focus changed from ${beforeFocus} to ${afterFocus}; ` +
      `${profile.competencies.length} competency states and ${profile.evidence.length} evidence records were retained.`,
    createdAt: profile.updatedAt,
    beforeMilestoneIds: profile.roadmap.milestoneIds,
    afterMilestoneIds: roadmap.milestoneIds,
  };
}

export function recalculateRoadmap(
  profile: CareerProfile,
  reason: RoadmapRecalculationReason,
): Readonly<{ roadmap: RoadmapState; decisionRecord: DecisionRecord | null }> {
  const roleId = profile.targetRoles[0];
  if (!roleId) throw new Error("Career roadmap requires a target role");
  const roadmap = buildRoadmap(profile, getRoleMap(roleId));
  return {
    roadmap,
    decisionRecord: roadmapEqual(profile.roadmap, roadmap)
      ? null
      : decisionForRecalculation(profile, reason, roadmap),
  };
}

export function completeMilestoneIfEligible(
  profile: CareerProfile,
  milestoneId: string,
): RoadmapState {
  const roleId = profile.targetRoles[0];
  if (!roleId) throw new Error("Career roadmap requires a target role");
  const roleMap = getRoleMap(roleId);
  const milestone = getRoadmapMilestone(milestoneId);
  if (!milestone.applicableRoles.includes(roleId)) {
    throw new Error(`Roadmap milestone ${milestoneId} is not applicable to ${roleId}`);
  }
  if (!milestoneIsComplete(profile, milestone)) {
    return profile.roadmap;
  }

  const clearedProfile: CareerProfile = {
    ...profile,
    roadmap: {
      ...profile.roadmap,
      supportingActivityId:
        profile.roadmap.supportingActivityId?.includes(milestoneId) === true
          ? null
          : profile.roadmap.supportingActivityId,
    },
  };
  return buildRoadmap(clearedProfile, roleMap);
}
