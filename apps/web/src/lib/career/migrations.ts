import { parseCareerProfile } from "./schema";
import type { CareerProfile } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Career profile migration: expected object");
  }
  return value as Record<string, unknown>;
}

export function migrateCareerProfile(value: unknown): CareerProfile {
  const record = asRecord(value);
  if (record.schemaVersion === "1") return parseCareerProfile(record);
  throw new Error(`Unsupported career profile schema: ${String(record.schemaVersion)}`);
}
