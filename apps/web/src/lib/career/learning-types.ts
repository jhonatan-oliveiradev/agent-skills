import type { Locale } from "../locales";
import type { CompetencyId } from "./competencies";
import type { ProficiencyLevel } from "./types";

export type LocalizedText = Readonly<Record<Locale, string>>;
export type LocalizedList = Readonly<Record<Locale, readonly string[]>>;

export interface LocalizedCodeExample {
  readonly language: string;
  readonly code: LocalizedText;
}

export interface LocalizedPractice {
  readonly id: string;
  readonly prompt: LocalizedText;
}

export interface LearningModule {
  readonly id: string;
  readonly criterionId: string;
  readonly level: ProficiencyLevel;
  readonly title: LocalizedText;
  readonly estimatedMinutes: number;
  readonly contentVersion: string;
  readonly reviewStatus: "draft" | "reviewed";
  readonly reviewedAt: string;
  readonly primarySourcePolicy: "required" | "not-available";
  readonly primarySourceReason?: LocalizedText;
  readonly understand: LocalizedText;
  readonly example?: LocalizedCodeExample;
  readonly commonMistake: LocalizedText;
  readonly practice: LocalizedPractice;
  readonly consolidationCriteria: LocalizedList;
  readonly sourceIds: readonly string[];
}

export interface LearningNote {
  readonly id: string;
  readonly competencyId: CompetencyId;
  readonly title: LocalizedText;
  readonly summary: LocalizedText;
  readonly objective: LocalizedText;
  readonly estimatedMinutes: number;
  readonly modules: readonly LearningModule[];
}

export interface LearningSource {
  readonly id: string;
  readonly title: string;
  readonly publisher: string;
  readonly url: string;
  readonly authority:
    | "primary"
    | "recognized-institutional"
    | "recognized-pedagogical";
  readonly volatility: "high" | "medium" | "low";
  readonly reviewedAt: string;
  readonly supportsCriterionIds: readonly string[];
}
