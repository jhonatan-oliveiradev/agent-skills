import { learningNoteCatalog } from "./learning-catalog";
import type { LearningNote } from "./learning-types";
import type { CareerProfile, LearningProgressRecord } from "./types";

export type LearningState = "not-started" | "in-progress" | "studied";

type LearningCatalog = readonly LearningNote[];

function resolveTimestamp(now: string | undefined): string {
  if (now === undefined) return new Date().toISOString();

  const timestamp = Date.parse(now);
  if (!Number.isFinite(timestamp)) {
    throw new Error("learning progress: expected ISO date-time");
  }

  return new Date(timestamp).toISOString();
}

function requireReviewedModule(
  noteId: string,
  moduleId: string,
  notes: LearningCatalog,
) {
  const note = notes.find((candidate) => candidate.id === noteId);
  if (!note) {
    throw new Error(`Unknown learning note: ${noteId}`);
  }

  const learningModule = note.modules.find((candidate) => candidate.id === moduleId);
  if (!learningModule) {
    throw new Error(`Unknown learning module: ${moduleId}`);
  }
  if (learningModule.reviewStatus !== "reviewed") {
    throw new Error(`Learning module must be reviewed before study: ${moduleId}`);
  }

  return { note, learningModule };
}

function updateLearningProgress(
  profile: CareerProfile,
  noteId: string,
  moduleId: string,
  timestamp: string,
  update: (current: LearningProgressRecord) => LearningProgressRecord,
): CareerProfile {
  const existing = profile.learningProgress.find((record) => record.noteId === noteId);
  const current: LearningProgressRecord = existing ?? {
    noteId,
    startedAt: timestamp,
    updatedAt: timestamp,
    currentModuleId: moduleId,
    completedModuleIds: [],
    completedPracticeIds: [],
    completedAt: null,
  };
  const next = update(current);

  return {
    ...profile,
    learningProgress: existing
      ? profile.learningProgress.map((record) =>
          record.noteId === noteId ? next : record,
        )
      : [...profile.learningProgress, next],
    updatedAt: timestamp,
  };
}

export function getLearningProgress(
  profile: CareerProfile,
  noteId: string,
): LearningProgressRecord | undefined {
  return profile.learningProgress.find((record) => record.noteId === noteId);
}

export function getLearningState(
  profile: CareerProfile,
  note: LearningNote,
): LearningState {
  const progress = getLearningProgress(profile, note.id);
  if (!progress) return "not-started";

  const reviewedModuleIds = note.modules
    .filter((learningModule) => learningModule.reviewStatus === "reviewed")
    .map((learningModule) => learningModule.id);
  const allReviewedComplete =
    reviewedModuleIds.length > 0 &&
    reviewedModuleIds.every((moduleId) => progress.completedModuleIds.includes(moduleId));

  return allReviewedComplete && progress.completedAt !== null
    ? "studied"
    : "in-progress";
}

export function startLearningModule(
  profile: CareerProfile,
  noteId: string,
  moduleId: string,
  now?: string,
  notes: LearningCatalog = learningNoteCatalog,
): CareerProfile {
  requireReviewedModule(noteId, moduleId, notes);
  const timestamp = resolveTimestamp(now);

  return updateLearningProgress(
    profile,
    noteId,
    moduleId,
    timestamp,
    (current) => ({
      ...current,
      updatedAt: timestamp,
      currentModuleId: moduleId,
    }),
  );
}

export function completeLearningPractice(
  profile: CareerProfile,
  noteId: string,
  moduleId: string,
  practiceId: string,
  now?: string,
  notes: LearningCatalog = learningNoteCatalog,
): CareerProfile {
  const { learningModule } = requireReviewedModule(noteId, moduleId, notes);
  if (learningModule.practice.id !== practiceId) {
    throw new Error(`Unknown learning practice: ${practiceId}`);
  }
  const timestamp = resolveTimestamp(now);

  return updateLearningProgress(
    profile,
    noteId,
    moduleId,
    timestamp,
    (current) => ({
      ...current,
      updatedAt: timestamp,
      currentModuleId: moduleId,
      completedPracticeIds: current.completedPracticeIds.includes(practiceId)
        ? current.completedPracticeIds
        : [...current.completedPracticeIds, practiceId],
    }),
  );
}

export function completeLearningModule(
  profile: CareerProfile,
  noteId: string,
  moduleId: string,
  now?: string,
  notes: LearningCatalog = learningNoteCatalog,
): CareerProfile {
  const { note } = requireReviewedModule(noteId, moduleId, notes);
  const timestamp = resolveTimestamp(now);

  return updateLearningProgress(
    profile,
    noteId,
    moduleId,
    timestamp,
    (current) => {
      const completedModuleIds = current.completedModuleIds.includes(moduleId)
        ? current.completedModuleIds
        : [...current.completedModuleIds, moduleId];
      const reviewedModuleIds = note.modules
        .filter((learningModule) => learningModule.reviewStatus === "reviewed")
        .map((learningModule) => learningModule.id);
      const allReviewedComplete =
        reviewedModuleIds.length > 0 &&
        reviewedModuleIds.every((id) => completedModuleIds.includes(id));

      return {
        ...current,
        updatedAt: timestamp,
        currentModuleId: moduleId,
        completedModuleIds,
        completedAt: allReviewedComplete ? current.completedAt ?? timestamp : null,
      };
    },
  );
}
