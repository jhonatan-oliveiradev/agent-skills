import { competencyIds } from "./competencies";
import { extractExplicitJobSignals } from "./market-extractor";
import { recalculateRoadmap } from "./roadmap-engine";
import { assertRecord, parseCareerArtifact } from "./schema";
import type {
  CareerProfile,
  JobCapabilitySignal,
  JobSourceType,
  JobWorkMode,
  MarketSample,
  MarketSignal,
  NormalizedJobPosting,
  StructuralRequirement,
  StructuralRequirementKind,
  StructuralRequirementStatus,
  TargetRoleId,
} from "./types";

export type { MarketSignal, NormalizedJobPosting } from "./types";

const jobSourceTypes = ["url", "pasted", "agent-import"] as const satisfies readonly JobSourceType[];
const workModes = ["remote", "hybrid", "onsite", "unknown"] as const satisfies readonly JobWorkMode[];
const requirementKinds = [
  "experience",
  "location",
  "work-authorization",
  "language",
  "work-mode",
  "credential",
  "availability",
  "other",
] as const satisfies readonly StructuralRequirementKind[];
const requirementStatuses = ["met", "unmet", "unknown"] as const satisfies readonly StructuralRequirementStatus[];
const targetRoles = [
  "frontend-developer",
  "backend-developer",
  "fullstack-developer",
] as const satisfies readonly TargetRoleId[];

export interface JobPostingInput {
  readonly id?: string;
  readonly title: string;
  readonly company: string;
  readonly source: {
    readonly type: JobSourceType;
    readonly url?: string;
    readonly capturedAt: string;
  };
  readonly postedAt?: string | null;
  readonly deadline?: string | null;
  readonly location?: string | null;
  readonly workMode?: JobWorkMode;
  readonly explicitSignals?: readonly JobCapabilitySignal[];
  readonly inferredSignals?: readonly JobCapabilitySignal[];
  readonly structuralRequirements?: readonly StructuralRequirement[];
  readonly rawSnapshot: string;
}

export interface MarketSampleContext {
  readonly targetRole?: TargetRoleId;
  readonly targetMarket?: string;
  readonly capturedAt?: string;
}

export interface ParsedMarketAnalysisArtifact {
  readonly trust: "external-unverified";
  readonly postings: readonly NormalizedJobPosting[];
}

function nonEmpty(value: string, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label}: expected non-empty string`);
  }
  return value.trim();
}

function isoDate(value: string, label: string): string {
  const normalized = nonEmpty(value, label);
  if (!Number.isFinite(Date.parse(normalized))) {
    throw new Error(`${label}: expected ISO date-time string`);
  }
  return new Date(normalized).toISOString();
}

function nullableIsoDate(value: string | null | undefined, label: string): string | null {
  if (value === undefined || value === null) return null;
  return isoDate(value, label);
}

function httpUrl(value: string, label: string): string {
  const normalized = nonEmpty(value, label);
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(`${label}: expected valid HTTP(S) URL`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`${label}: expected valid HTTP(S) URL`);
  }
  return parsed.toString();
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function canonicalDedupText(value: string): string {
  return normalizeWhitespace(value).toLocaleLowerCase("en-US");
}

function deriveWorkMode(text: string): JobWorkMode {
  if (/\bhybrid\b/i.test(text)) return "hybrid";
  if (/\b(?:on[- ]?site|onsite)\b/i.test(text)) return "onsite";
  if (/\bremote\b/i.test(text)) return "remote";
  return "unknown";
}

function assertCompetencyId(value: string, label: string): void {
  if (!competencyIds.includes(value as (typeof competencyIds)[number])) {
    throw new Error(`${label}: unknown competency`);
  }
}

function normalizeSignals(
  signals: readonly JobCapabilitySignal[],
  expectedProvenance: "explicit" | "inferred",
  label: string,
): readonly JobCapabilitySignal[] {
  const unique = new Map<string, JobCapabilitySignal>();
  for (const [index, signal] of signals.entries()) {
    assertCompetencyId(signal.competencyId, `${label}[${index}].competencyId`);
    if (signal.provenance !== expectedProvenance) {
      throw new Error(`${label}[${index}].provenance: expected ${expectedProvenance}`);
    }
    const signalLabel = nonEmpty(signal.label, `${label}[${index}].label`);
    const key = `${signal.competencyId}:${signalLabel.toLowerCase()}`;
    unique.set(key, {
      competencyId: signal.competencyId,
      label: signalLabel,
      provenance: expectedProvenance,
    });
  }
  return [...unique.values()];
}

function normalizeRequirements(
  requirements: readonly StructuralRequirement[],
  label: string,
): readonly StructuralRequirement[] {
  const unique = new Map<string, StructuralRequirement>();
  for (const [index, requirement] of requirements.entries()) {
    if (!requirementKinds.includes(requirement.kind)) {
      throw new Error(`${label}[${index}].kind: invalid value`);
    }
    if (!requirementStatuses.includes(requirement.status)) {
      throw new Error(`${label}[${index}].status: invalid value`);
    }
    if (typeof requirement.hard !== "boolean") {
      throw new Error(`${label}[${index}].hard: expected boolean`);
    }
    const requirementLabel = nonEmpty(requirement.label, `${label}[${index}].label`);
    unique.set(`${requirement.kind}:${requirementLabel.toLowerCase()}`, {
      kind: requirement.kind,
      label: requirementLabel,
      hard: requirement.hard,
      status: requirement.status,
    });
  }
  return [...unique.values()];
}

function mergeRequirements(
  extracted: readonly StructuralRequirement[],
  supplied: readonly StructuralRequirement[],
): readonly StructuralRequirement[] {
  const merged = new Map<string, StructuralRequirement>();
  for (const requirement of extracted) {
    merged.set(`${requirement.kind}:${requirement.label.toLowerCase()}`, requirement);
  }
  for (const requirement of supplied) {
    merged.set(`${requirement.kind}:${requirement.label.toLowerCase()}`, requirement);
  }
  return [...merged.values()];
}

export function normalizeJobPosting(input: JobPostingInput): NormalizedJobPosting {
  const title = nonEmpty(input.title, "job.title");
  const company = nonEmpty(input.company, "job.company");
  const rawSnapshot = nonEmpty(input.rawSnapshot, "job.rawSnapshot");
  if (!jobSourceTypes.includes(input.source.type)) {
    throw new Error("job.source.type: invalid value");
  }
  const capturedAt = isoDate(input.source.capturedAt, "job.source.capturedAt");
  const sourceUrl = input.source.url ? httpUrl(input.source.url, "job.source.url") : undefined;
  if (input.source.type === "url" && !sourceUrl) {
    throw new Error("job.source.url: URL source requires a URL");
  }

  const extracted = extractExplicitJobSignals(rawSnapshot);
  const explicitSignals = normalizeSignals(
    [...extracted.signals, ...(input.explicitSignals ?? [])],
    "explicit",
    "job.explicitSignals",
  );
  const inferredSignals = normalizeSignals(
    input.inferredSignals ?? [],
    "inferred",
    "job.inferredSignals",
  );
  const suppliedRequirements = normalizeRequirements(
    input.structuralRequirements ?? [],
    "job.structuralRequirements",
  );
  const structuralRequirements = mergeRequirements(
    extracted.structuralRequirements,
    suppliedRequirements,
  );
  const location = input.location === undefined || input.location === null
    ? null
    : nonEmpty(input.location, "job.location");
  const workMode = input.workMode ?? deriveWorkMode(rawSnapshot);
  if (!workModes.includes(workMode)) throw new Error("job.workMode: invalid value");
  const postedAt = nullableIsoDate(input.postedAt, "job.postedAt");
  const deadline = nullableIsoDate(input.deadline, "job.deadline");
  const id = input.id?.trim() || `job:${stableHash(
    `${canonicalDedupText(company)}|${canonicalDedupText(title)}|${canonicalDedupText(rawSnapshot)}`,
  )}`;

  return {
    id,
    title,
    company,
    source: {
      type: input.source.type,
      ...(sourceUrl ? { url: sourceUrl } : {}),
      capturedAt,
    },
    postedAt,
    deadline,
    location,
    workMode,
    explicitSignals,
    inferredSignals,
    structuralRequirements,
    rawSnapshot,
  };
}

function postingDedupKey(posting: NormalizedJobPosting): string {
  return [posting.company, posting.title, posting.rawSnapshot]
    .map(canonicalDedupText)
    .join("|");
}

export function deduplicateJobPostings(
  postings: readonly NormalizedJobPosting[],
): NormalizedJobPosting[] {
  const unique = new Map<string, NormalizedJobPosting>();
  for (const posting of postings) {
    const key = postingDedupKey(posting);
    if (!unique.has(key)) unique.set(key, posting);
  }
  return [...unique.values()];
}

function resolveSampleCapture(
  postings: readonly NormalizedJobPosting[],
  requested?: string,
): string {
  if (requested) return isoDate(requested, "marketSample.capturedAt");
  const latest = postings
    .map((posting) => posting.source.capturedAt)
    .sort((left, right) => right.localeCompare(left))[0];
  return latest ?? new Date().toISOString();
}

function freshnessBucket(
  postedAt: string | null,
  capturedAt: string,
): "fresh" | "recent" | "historical" | "unknown" {
  if (!postedAt) return "unknown";
  const ageDays = Math.max(0, (Date.parse(capturedAt) - Date.parse(postedAt)) / 86_400_000);
  if (ageDays <= 7) return "fresh";
  if (ageDays <= 30) return "recent";
  return "historical";
}

function aggregateSignals(postings: readonly NormalizedJobPosting[]): readonly MarketSignal[] {
  const aggregate = new Map<
    string,
    { explicit: Set<string>; inferred: Set<string>; postings: Set<string> }
  >();

  for (const posting of postings) {
    for (const signal of posting.explicitSignals) {
      const entry = aggregate.get(signal.competencyId) ?? {
        explicit: new Set<string>(),
        inferred: new Set<string>(),
        postings: new Set<string>(),
      };
      entry.explicit.add(posting.id);
      entry.postings.add(posting.id);
      aggregate.set(signal.competencyId, entry);
    }
    for (const signal of posting.inferredSignals) {
      const entry = aggregate.get(signal.competencyId) ?? {
        explicit: new Set<string>(),
        inferred: new Set<string>(),
        postings: new Set<string>(),
      };
      entry.inferred.add(posting.id);
      entry.postings.add(posting.id);
      aggregate.set(signal.competencyId, entry);
    }
  }

  return [...aggregate.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([competencyId, counts]) => ({
      competencyId,
      provenance: "market-derived" as const,
      explicitCount: counts.explicit.size,
      inferredCount: counts.inferred.size,
      postingCount: counts.postings.size,
    }));
}

export function buildMarketSample(
  postings: readonly NormalizedJobPosting[],
  context: MarketSampleContext = {},
): MarketSample {
  const unique = deduplicateJobPostings(postings);
  const capturedAt = resolveSampleCapture(unique, context.capturedAt);
  if (context.targetRole && !targetRoles.includes(context.targetRole)) {
    throw new Error("marketSample.targetRole: invalid value");
  }
  const targetMarket = context.targetMarket?.trim();
  if (context.targetMarket !== undefined && !targetMarket) {
    throw new Error("marketSample.targetMarket: expected non-empty string");
  }

  const freshness = { fresh: 0, recent: 0, historical: 0, unknown: 0 };
  for (const posting of unique) {
    freshness[freshnessBucket(posting.postedAt, capturedAt)] += 1;
  }
  const sourceKeys = new Set(
    unique.map((posting) => posting.source.url?.toLowerCase() ?? `type:${posting.source.type}`),
  );
  const companyKeys = new Set(unique.map((posting) => canonicalDedupText(posting.company)));
  const postingIds = unique.map((posting) => posting.id).sort().join("|");

  return {
    id: `market:${capturedAt}:${stableHash(postingIds)}`,
    ...(context.targetRole ? { targetRole: context.targetRole } : {}),
    ...(targetMarket ? { targetMarket } : {}),
    capturedAt,
    postingCount: unique.length,
    distinctCompanyCount: companyKeys.size,
    distinctSourceCount: sourceKeys.size,
    deduplicatedCount: postings.length - unique.length,
    freshCount: freshness.fresh,
    recentCount: freshness.recent,
    historicalCount: freshness.historical,
    unknownDateCount: freshness.unknown,
    signals: aggregateSignals(unique),
    postings: unique,
  };
}

function readImportedSignal(
  value: unknown,
  expected: "explicit" | "inferred",
  label: string,
): JobCapabilitySignal {
  assertRecord(value, label);
  const competencyId = nonEmpty(String(value.competencyId ?? ""), `${label}.competencyId`);
  assertCompetencyId(competencyId, `${label}.competencyId`);
  const signalLabel = nonEmpty(String(value.label ?? ""), `${label}.label`);
  if (value.provenance !== expected) {
    throw new Error(`${label}.provenance: expected ${expected}`);
  }
  return { competencyId, label: signalLabel, provenance: expected };
}

function readImportedRequirement(value: unknown, label: string): StructuralRequirement {
  assertRecord(value, label);
  const kind = String(value.kind ?? "") as StructuralRequirementKind;
  const status = String(value.status ?? "unknown") as StructuralRequirementStatus;
  if (!requirementKinds.includes(kind)) throw new Error(`${label}.kind: invalid value`);
  if (!requirementStatuses.includes(status)) throw new Error(`${label}.status: invalid value`);
  if (typeof value.hard !== "boolean") throw new Error(`${label}.hard: expected boolean`);
  return {
    kind,
    label: nonEmpty(String(value.label ?? ""), `${label}.label`),
    hard: value.hard,
    status,
  };
}

function importedPosting(value: unknown, index: number): NormalizedJobPosting {
  const label = `careerArtifact.postings[${index}]`;
  assertRecord(value, label);
  const source = value.source;
  let sourceUrl: string | undefined;
  let capturedAt = value.capturedAt;
  if (source && typeof source === "object" && !Array.isArray(source)) {
    const sourceRecord = source as Record<string, unknown>;
    if (typeof sourceRecord.url === "string") sourceUrl = sourceRecord.url;
    if (capturedAt === undefined) capturedAt = sourceRecord.capturedAt;
  }
  if (typeof value.sourceUrl === "string") sourceUrl = value.sourceUrl;
  if (typeof capturedAt !== "string") {
    throw new Error(`${label}.capturedAt: expected ISO date-time string`);
  }
  const explicitSignals = Array.isArray(value.explicitSignals)
    ? value.explicitSignals.map((signal, signalIndex) =>
        readImportedSignal(signal, "explicit", `${label}.explicitSignals[${signalIndex}]`),
      )
    : [];
  const inferredSignals = Array.isArray(value.inferredSignals)
    ? value.inferredSignals.map((signal, signalIndex) =>
        readImportedSignal(signal, "inferred", `${label}.inferredSignals[${signalIndex}]`),
      )
    : [];
  const structuralRequirements = Array.isArray(value.structuralRequirements)
    ? value.structuralRequirements.map((requirement, requirementIndex) =>
        readImportedRequirement(
          requirement,
          `${label}.structuralRequirements[${requirementIndex}]`,
        ),
      )
    : [];

  return normalizeJobPosting({
    ...(typeof value.id === "string" ? { id: value.id } : {}),
    title: nonEmpty(String(value.title ?? ""), `${label}.title`),
    company: nonEmpty(String(value.company ?? ""), `${label}.company`),
    source: {
      type: "agent-import",
      ...(sourceUrl ? { url: sourceUrl } : {}),
      capturedAt,
    },
    ...(typeof value.postedAt === "string" || value.postedAt === null
      ? { postedAt: value.postedAt }
      : {}),
    ...(typeof value.deadline === "string" || value.deadline === null
      ? { deadline: value.deadline }
      : {}),
    ...(typeof value.location === "string" || value.location === null
      ? { location: value.location }
      : {}),
    ...(typeof value.workMode === "string" && workModes.includes(value.workMode as JobWorkMode)
      ? { workMode: value.workMode as JobWorkMode }
      : {}),
    explicitSignals,
    inferredSignals,
    structuralRequirements,
    rawSnapshot: nonEmpty(String(value.rawSnapshot ?? ""), `${label}.rawSnapshot`),
  });
}

export function parseMarketAnalysisArtifact(value: unknown): ParsedMarketAnalysisArtifact {
  const artifact = parseCareerArtifact(value);
  if (artifact.artifactType !== "market-analysis") {
    throw new Error("Career artifact is not a market-analysis artifact");
  }
  if (artifact.provenance.trust !== "external-unverified") {
    throw new Error("Imported market analysis must remain external-unverified in V1");
  }
  if (!Array.isArray(artifact.postings)) {
    throw new Error("careerArtifact.postings: expected array");
  }
  return {
    trust: "external-unverified",
    postings: artifact.postings.map(importedPosting),
  };
}

export function applyMarketSample(
  profile: CareerProfile,
  sample: MarketSample,
): CareerProfile {
  const capturedAt = isoDate(sample.capturedAt, "marketSample.capturedAt");
  if (profile.marketSamples.some((candidate) => candidate.id === sample.id)) {
    throw new Error(`Duplicate market sample id: ${sample.id}`);
  }
  const updatedProfile: CareerProfile = {
    ...profile,
    marketSamples: [...profile.marketSamples, sample],
    updatedAt: capturedAt,
  };
  const { roadmap, decisionRecord } = recalculateRoadmap(updatedProfile, "market-update");
  return {
    ...updatedProfile,
    roadmap,
    decisionRecords: decisionRecord
      ? [...updatedProfile.decisionRecords, decisionRecord]
      : updatedProfile.decisionRecords,
  };
}
