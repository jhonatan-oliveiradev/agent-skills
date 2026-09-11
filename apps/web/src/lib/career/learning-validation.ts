import { competencyDefinitions, competencyIds } from "./competencies";
import type {
  LearningModule,
  LearningNote,
  LearningSource,
  LocalizedList,
  LocalizedText,
} from "./learning-types";

const locales = ["en", "pt-BR"] as const;
const levels = ["foundation", "developing", "proficient", "advanced"] as const;
const sourceAuthorities = [
  "primary",
  "recognized-institutional",
  "recognized-pedagogical",
] as const;
const sourceVolatility = ["high", "medium", "low"] as const;
const reviewStatuses = ["draft", "reviewed"] as const;
const primarySourcePolicies = ["required", "not-available"] as const;

function assertNonEmptyString(value: string, label: string): void {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label}: expected non-empty string`);
  }
}

function assertPositiveMinutes(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label}: expected positive minutes`);
  }
}

function assertIsoDateTime(value: string, label: string): void {
  assertNonEmptyString(value, label);
  if (!Number.isFinite(Date.parse(value))) {
    throw new Error(`${label}: expected ISO date-time`);
  }
}

function assertLocalizedText(value: LocalizedText, label: string): void {
  for (const locale of locales) {
    assertNonEmptyString(value[locale], `${label}.${locale}`);
  }
}

function assertLocalizedList(value: LocalizedList, label: string): void {
  for (const locale of locales) {
    const entries = value[locale];
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new Error(`${label}.${locale}: expected non-empty list`);
    }
    entries.forEach((entry, index) =>
      assertNonEmptyString(entry, `${label}.${locale}[${index}]`),
    );
  }
}

function assertUniqueId(seen: Set<string>, id: string, label: string): void {
  assertNonEmptyString(id, `${label} id`);
  if (seen.has(id)) {
    throw new Error(`duplicate ${label} id: ${id}`);
  }
  seen.add(id);
}

function canonicalCriterion(criterionId: string) {
  return competencyDefinitions
    .flatMap((definition) =>
      definition.criteria.map((criterion) => ({ definition, criterion })),
    )
    .find(({ criterion }) => criterion.id === criterionId);
}

function validateSource(source: LearningSource, index: number): void {
  const label = `source[${index}]`;
  assertNonEmptyString(source.title, `${label}.title`);
  assertNonEmptyString(source.publisher, `${label}.publisher`);
  assertNonEmptyString(source.url, `${label}.url`);
  let parsed: URL;
  try {
    parsed = new URL(source.url);
  } catch {
    throw new Error(`${label}.url: expected valid HTTP(S) URL`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`${label}.url: expected valid HTTP(S) URL`);
  }
  if (!sourceAuthorities.includes(source.authority)) {
    throw new Error(`${label}.authority: invalid value`);
  }
  if (!sourceVolatility.includes(source.volatility)) {
    throw new Error(`${label}.volatility: invalid value`);
  }
  assertIsoDateTime(source.reviewedAt, `${label}.reviewedAt`);
  if (!Array.isArray(source.supportsCriterionIds) || source.supportsCriterionIds.length === 0) {
    throw new Error(`${label}.supportsCriterionIds: expected non-empty list`);
  }
  for (const criterionId of source.supportsCriterionIds) {
    if (!canonicalCriterion(criterionId)) {
      throw new Error(`${label}: unknown criterion ${criterionId}`);
    }
  }
}

function validateModule(
  note: LearningNote,
  module: LearningModule,
  index: number,
  sourcesById: ReadonlyMap<string, LearningSource>,
): void {
  const label = `note ${note.id} module[${index}]`;
  const canonical = canonicalCriterion(module.criterionId);
  if (!canonical) {
    throw new Error(`${label}: unknown criterion ${module.criterionId}`);
  }
  if (canonical.definition.id !== note.competencyId) {
    throw new Error(
      `${label}: criterion ${module.criterionId} belongs to another competency`,
    );
  }
  if (!levels.includes(module.level) || canonical.criterion.level !== module.level) {
    throw new Error(`${label}: level does not match criterion`);
  }

  assertLocalizedText(module.title, `${label}.title`);
  assertPositiveMinutes(module.estimatedMinutes, `${label}.estimatedMinutes`);
  assertNonEmptyString(module.contentVersion, `${label}.contentVersion`);
  if (!reviewStatuses.includes(module.reviewStatus)) {
    throw new Error(`${label}.reviewStatus: invalid value`);
  }
  assertIsoDateTime(module.reviewedAt, `${label}.reviewedAt`);
  if (!primarySourcePolicies.includes(module.primarySourcePolicy)) {
    throw new Error(`${label}.primarySourcePolicy: invalid value`);
  }
  if (module.primarySourcePolicy === "not-available") {
    if (!module.primarySourceReason) {
      throw new Error(`${label}: primary source reason is required`);
    }
    assertLocalizedText(module.primarySourceReason, `${label}.primarySourceReason`);
  }

  assertLocalizedText(module.understand, `${label}.understand`);
  assertLocalizedText(module.commonMistake, `${label}.commonMistake`);
  assertNonEmptyString(module.practice.id, `${label}.practice.id`);
  assertLocalizedText(module.practice.prompt, `${label}.practice.prompt`);
  assertLocalizedList(module.consolidationCriteria, `${label}.consolidationCriteria`);

  if (module.example) {
    assertNonEmptyString(module.example.language, `${label}.example.language`);
    assertLocalizedText(module.example.code, `${label}.example.code`);
  }

  if (!Array.isArray(module.sourceIds) || module.sourceIds.length === 0) {
    throw new Error(`${label}.sourceIds: expected non-empty list`);
  }

  const resolvedSources = module.sourceIds.map((sourceId) => {
    const source = sourcesById.get(sourceId);
    if (!source) throw new Error(`${label}: unknown source ${sourceId}`);
    if (!source.supportsCriterionIds.includes(module.criterionId)) {
      throw new Error(
        `${label}: source ${sourceId} does not support criterion ${module.criterionId}`,
      );
    }
    return source;
  });

  if (
    module.reviewStatus === "reviewed" &&
    module.primarySourcePolicy === "required" &&
    !resolvedSources.some((source) => source.authority === "primary")
  ) {
    throw new Error(`${label}: reviewed module requires a primary source`);
  }
}

export function validateLearningCatalog(
  notes: readonly LearningNote[],
  sources: readonly LearningSource[],
): readonly LearningNote[] {
  const noteIds = new Set<string>();
  const moduleIds = new Set<string>();
  const practiceIds = new Set<string>();
  const sourceIds = new Set<string>();

  for (const source of sources) {
    assertUniqueId(sourceIds, source.id, "source");
  }
  sources.forEach(validateSource);
  const sourcesById = new Map(sources.map((source) => [source.id, source] as const));

  for (const note of notes) {
    assertUniqueId(noteIds, note.id, "note");
    if (!competencyIds.includes(note.competencyId)) {
      throw new Error(`note ${note.id}: unknown competency ${note.competencyId}`);
    }
    assertLocalizedText(note.title, `note ${note.id}.title`);
    assertLocalizedText(note.summary, `note ${note.id}.summary`);
    assertLocalizedText(note.objective, `note ${note.id}.objective`);
    assertPositiveMinutes(note.estimatedMinutes, `note ${note.id}.estimatedMinutes`);

    if (!Array.isArray(note.modules) || note.modules.length === 0) {
      throw new Error(`note ${note.id}.modules: expected non-empty list`);
    }

    note.modules.forEach((module, index) => {
      assertUniqueId(moduleIds, module.id, "module");
      assertUniqueId(practiceIds, module.practice.id, "practice");
      validateModule(note, module, index, sourcesById);
    });
  }

  return notes;
}
