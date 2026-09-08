import type { Locale } from "../locales";
import type { CompetencyId } from "./competencies";
import { learningUnitCatalog } from "./learning-catalog";
import { getRoadmapMilestone } from "./roadmap-catalog";
import { buildRoadmap } from "./roadmap-engine";
import { getRoleMap } from "./role-maps";
import type { CareerProfile } from "./types";

export type PracticePromptKind =
  | "example"
  | "problem"
  | "practice"
  | "checkpoint"
  | "handoff";

export interface PracticePrompt {
  readonly id: string;
  readonly kind: PracticePromptKind;
  readonly prompt: Readonly<Record<Locale, string>>;
}

export interface LearningUnit {
  readonly id: string;
  readonly competencyId: CompetencyId;
  readonly title: Readonly<Record<Locale, string>>;
  readonly objective: Readonly<Record<Locale, string>>;
  readonly explanation: Readonly<Record<Locale, string>>;
  readonly practice: readonly PracticePrompt[];
  readonly estimatedMinutes: number;
}

const milestoneUnitIds: Readonly<Record<string, readonly string[]>> = {
  "programming-foundations": ["async-js-control-flow"],
  "async-application-control-flow": ["async-js-control-flow"],
  "typed-application-modeling": ["typescript-application-modeling"],
  "testing-real-behavior": ["testing-observable-behavior"],
  "http-api-boundaries": ["http-api-boundaries"],
  "accessible-web-interfaces": ["accessible-interface-fundamentals"],
  "portfolio-proof": ["git-collaboration-workflow"],
};

const unitById = new Map<string, LearningUnit>(
  learningUnitCatalog.map((unit) => [unit.id, unit] as const),
);

export function getLearningUnitsForMilestone(milestoneId: string): readonly LearningUnit[] {
  getRoadmapMilestone(milestoneId);
  const ids = milestoneUnitIds[milestoneId] ?? [];
  return ids.map((id) => {
    const unit = unitById.get(id);
    if (!unit) throw new Error(`Unknown learning unit: ${id}`);
    return unit;
  });
}

function activityId(milestoneId: string, unitId: string): string {
  return `learning:${milestoneId}:${unitId}:completed`;
}

export function isLearningUnitCompleted(
  profile: CareerProfile,
  milestoneId: string,
  unitId: string,
): boolean {
  return profile.roadmap.supportingActivityId === activityId(milestoneId, unitId);
}

export function completeLearningUnit(
  profile: CareerProfile,
  milestoneId: string,
  unitId: string,
  now = new Date().toISOString(),
): CareerProfile {
  if (!Number.isFinite(Date.parse(now))) {
    throw new Error("Learning completion requires a valid observed time");
  }

  const roleId = profile.targetRoles[0];
  if (!roleId) throw new Error("Learning completion requires a target role");
  const roadmap = buildRoadmap(profile, getRoleMap(roleId));
  if (!roadmap.milestoneIds.includes(milestoneId)) {
    throw new Error(`Learning milestone is not part of the active roadmap: ${milestoneId}`);
  }

  const allowedUnit = getLearningUnitsForMilestone(milestoneId).find((unit) => unit.id === unitId);
  if (!allowedUnit) {
    throw new Error(`Learning unit ${unitId} is not assigned to milestone ${milestoneId}`);
  }

  return {
    ...profile,
    roadmap: {
      ...roadmap,
      supportingActivityId: activityId(milestoneId, unitId),
    },
    updatedAt: now,
  };
}
