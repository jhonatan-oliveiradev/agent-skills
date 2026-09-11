import { validateLearningProgressReferences } from "./learning-validation";
import { parseCareerProfile } from "./schema";
import type { CareerProfile } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Career profile migration: expected object");
  }
  return value as Record<string, unknown>;
}

function validateProfile(value: unknown): CareerProfile {
  return validateLearningProgressReferences(parseCareerProfile(value));
}

export function migrateCareerProfile(value: unknown): CareerProfile {
  const record = asRecord(value);

  if (record.schemaVersion === "2") {
    return validateProfile(record);
  }

  if (record.schemaVersion === "1") {
    return validateProfile({
      schemaVersion: "2",
      targetRoles: record.targetRoles,
      targetMarkets: record.targetMarkets,
      weeklyStudyHours: record.weeklyStudyHours,
      competencies: record.competencies,
      assessments: record.assessments,
      roadmap: record.roadmap,
      learningProgress: [],
      evidence: record.evidence,
      marketSamples: record.marketSamples,
      decisionRecords: record.decisionRecords,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  throw new Error(`Unsupported career profile schema: ${String(record.schemaVersion)}`);
}
