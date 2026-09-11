import type { LearningSource } from "./learning-types";

export const LEARNING_REVIEW_WINDOWS_DAYS = {
  high: 90,
  medium: 180,
  low: 365,
} as const;

export const learningSourceCatalog: readonly LearningSource[] = [];
