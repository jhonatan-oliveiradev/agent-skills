import type { CareerProfile, TargetRoleId } from "./types";

export const CAREER_PROFILE_SCHEMA_VERSION = "1" as const;

export interface CreateEmptyCareerProfileInput {
  readonly targetRole: TargetRoleId;
  readonly targetMarket: string;
  readonly weeklyStudyHours?: number;
  readonly now?: string;
}

function resolveTimestamp(now: string | undefined): string {
  if (now === undefined) return new Date().toISOString();

  const timestamp = Date.parse(now);
  if (!Number.isFinite(timestamp)) {
    throw new Error("now: expected ISO date-time string");
  }

  return new Date(timestamp).toISOString();
}

export function createEmptyCareerProfile(
  input: CreateEmptyCareerProfileInput,
): CareerProfile {
  const targetMarket = input.targetMarket.trim();
  if (targetMarket === "") {
    throw new Error("targetMarket: expected non-empty string");
  }

  if (
    input.weeklyStudyHours !== undefined &&
    (!Number.isFinite(input.weeklyStudyHours) || input.weeklyStudyHours <= 0)
  ) {
    throw new Error("weeklyStudyHours: expected a positive finite number");
  }

  const timestamp = resolveTimestamp(input.now);

  return {
    schemaVersion: CAREER_PROFILE_SCHEMA_VERSION,
    targetRoles: [input.targetRole],
    targetMarkets: [targetMarket],
    weeklyStudyHours: input.weeklyStudyHours ?? null,
    competencies: [],
    assessments: [],
    roadmap: {
      milestoneIds: [],
      currentFocusMilestoneId: null,
      supportingActivityId: null,
    },
    evidence: [],
    marketSamples: [],
    decisionRecords: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
