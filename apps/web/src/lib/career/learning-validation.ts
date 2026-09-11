import { competencyDefinitions, competencyIds } from "./competencies";
import { getLearningNote } from "./learning-catalog";
import { resolveLearningSourceId } from "./learning-source-catalog";
import type {
  LearningModule,
  LearningNote,
  LearningSource,
  LocalizedList,
  LocalizedText,
} from "./learning-types";
import type { CareerProfile } from "./types";

export {
  getLearningModuleByCriterion,
  getLearningNote,
  getLearningNoteByCompetency,
  getReviewedLearningModules,
} from "./learning-catalog";

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
  learningModule: LearningModule,
  index: number,
  sourcesById: ReadonlyMap<string, LearningSource>,
): void {
  const label = `note ${note.id} module[${index}]`;
  const canonical = canonicalCriterion(learningModule.criterionId);
  if (!canonical) {
    throw new Error(`${label}: unknown criterion ${learningModule.criterionId}`);
  }
  if (canonical.definition.id !== note.competencyId) {
    throw new Error(
      `${label}: criterion ${learningModule.criterionId} belongs to another competency`,
    );
  }
  if (!levels.includes(learningModule.level) || canonical.criterion.level !== learningModule.level) {
    throw new Error(`${label}: level does not match criterion`);
  }

  assertLocalizedText(learningModule.title, `${label}.title`);
  assertPositiveMinutes(learningModule.estimatedMinutes, `${label}.estimatedMinutes`);
  assertNonEmptyString(learningModule.contentVersion, `${label}.contentVersion`);
  if (!reviewStatuses.includes(learningModule.reviewStatus)) {
    throw new Error(`${label}.reviewStatus: invalid value`);
  }
  assertIsoDateTime(learningModule.reviewedAt, `${label}.reviewedAt`);
  if (!primarySourcePolicies.includes(learningModule.primarySourcePolicy)) {
    throw new Error(`${label}.primarySourcePolicy: invalid value`);
  }
  if (learningModule.primarySourcePolicy === "not-available") {
    if (!learningModule.primarySourceReason) {
      throw new Error(`${label}: primary source reason is required`);
    }
    assertLocalizedText(learningModule.primarySourceReason, `${label}.primarySourceReason`);
  }

  assertLocalizedText(learningModule.understand, `${label}.understand`);
  assertLocalizedText(learningModule.commonMistake, `${label}.commonMistake`);
  assertNonEmptyString(learningModule.practice.id, `${label}.practice.id`);
  assertLocalizedText(learningModule.practice.prompt, `${label}.practice.prompt`);
  assertLocalizedList(learningModule.consolidationCriteria, `${label}.consolidationCriteria`);

  if (learningModule.example) {
    assertNonEmptyString(learningModule.example.language, `${label}.example.language`);
    assertLocalizedText(learningModule.example.code, `${label}.example.code`);
  }

  if (!Array.isArray(learningModule.sourceIds) || learningModule.sourceIds.length === 0) {
    throw new Error(`${label}.sourceIds: expected non-empty list`);
  }

  const resolvedSources = learningModule.sourceIds.map((sourceId) => {
    const canonicalSourceId = resolveLearningSourceId(sourceId);
    const source = sourcesById.get(canonicalSourceId);
    if (!source) throw new Error(`${label}: unknown source ${sourceId}`);
    if (!source.supportsCriterionIds.includes(learningModule.criterionId)) {
      throw new Error(
        `${label}: source ${sourceId} does not support criterion ${learningModule.criterionId}`,
      );
    }
    return source;
  });

  if (
    learningModule.reviewStatus === "reviewed" &&
    learningModule.primarySourcePolicy === "required" &&
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

    note.modules.forEach((learningModule, index) => {
      assertUniqueId(moduleIds, learningModule.id, "module");
      assertUniqueId(practiceIds, learningModule.practice.id, "practice");
      validateModule(note, learningModule, index, sourcesById);
    });
  }

  return notes;
}

export function validateLearningProgressReferences(profile: CareerProfile): CareerProfile {
  for (const record of profile.learningProgress) {
    const note = getLearningNote(record.noteId);
    if (!note) {
      throw new Error(`Unknown learning note: ${record.noteId}`);
    }

    const moduleIds = new Set(note.modules.map((learningModule) => learningModule.id));
    const practiceIds = new Set(
      note.modules.map((learningModule) => learningModule.practice.id),
    );

    if (record.currentModuleId !== null && !moduleIds.has(record.currentModuleId)) {
      throw new Error(`Unknown learning module: ${record.currentModuleId}`);
    }
    for (const moduleId of record.completedModuleIds) {
      if (!moduleIds.has(moduleId)) {
        throw new Error(`Unknown learning module: ${moduleId}`);
      }
    }
    for (const practiceId of record.completedPracticeIds) {
      if (!practiceIds.has(practiceId)) {
        throw new Error(`Unknown learning practice: ${practiceId}`);
      }
    }
  }

  return profile;
}
