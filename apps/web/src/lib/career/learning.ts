import {
  getLearningModuleByCriterion,
  getLearningNote,
} from "./learning-catalog";
import {
  completeLearningModule,
  completeLearningPractice,
  getLearningProgress,
} from "./learning-progress";
import { buildRoadmap } from "./roadmap-engine";
import { getRoadmapMilestone } from "./roadmap-catalog";
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
  readonly prompt: Readonly<{ en: string; "pt-BR": string }>;
}

export interface LearningUnit {
  readonly id: string;
  readonly competencyId: string;
  readonly title: Readonly<{ en: string; "pt-BR": string }>;
  readonly objective: Readonly<{ en: string; "pt-BR": string }>;
  readonly explanation: Readonly<{ en: string; "pt-BR": string }>;
  readonly practice: readonly PracticePrompt[];
  readonly estimatedMinutes: number;
}

type CompatibilityTarget = Readonly<{
  unitId: string;
  noteId: string;
  criterionId: string;
}>;

const compatibilityTargets: Readonly<Record<string, readonly CompatibilityTarget[]>> = {
  "programming-foundations": [
    {
      unitId: "async-js-control-flow",
      noteId: "javascript-programming",
      criterionId: "programming-javascript.foundation",
    },
  ],
  "async-application-control-flow": [
    {
      unitId: "async-js-control-flow",
      noteId: "javascript-programming",
      criterionId: "programming-javascript.proficient",
    },
  ],
  "typed-application-modeling": [
    {
      unitId: "typescript-application-modeling",
      noteId: "typescript-application-modeling",
      criterionId: "programming-typescript.proficient",
    },
  ],
  "testing-real-behavior": [
    {
      unitId: "testing-observable-behavior",
      noteId: "testing-observable-behavior",
      criterionId: "testing-behavior.proficient",
    },
  ],
  "http-api-boundaries": [
    {
      unitId: "http-api-boundaries",
      noteId: "http-api-boundaries",
      criterionId: "http-api-engineering.proficient",
    },
  ],
  "accessible-web-interfaces": [
    {
      unitId: "accessible-interface-fundamentals",
      noteId: "accessible-interface-fundamentals",
      criterionId: "web-accessibility.developing",
    },
  ],
  "portfolio-proof": [
    {
      unitId: "git-collaboration-workflow",
      noteId: "git-collaboration-workflow",
      criterionId: "git-collaboration.developing",
    },
  ],
};

function targetFor(milestoneId: string, unitId: string): CompatibilityTarget | undefined {
  return compatibilityTargets[milestoneId]?.find((target) => target.unitId === unitId);
}

function projectCompatibilityUnit(target: CompatibilityTarget): LearningUnit | null {
  const note = getLearningNote(target.noteId);
  const resolved = getLearningModuleByCriterion(target.criterionId);
  if (!note || !resolved || resolved.note.id !== note.id || resolved.module.reviewStatus !== "reviewed") {
    return null;
  }

  const learningModule = resolved.module;
  const firstCriterion = {
    en: learningModule.consolidationCriteria.en[0] ?? learningModule.understand.en,
    "pt-BR":
      learningModule.consolidationCriteria["pt-BR"][0] ?? learningModule.understand["pt-BR"],
  };
  const secondCriterion = {
    en: learningModule.consolidationCriteria.en[1] ?? firstCriterion.en,
    "pt-BR": learningModule.consolidationCriteria["pt-BR"][1] ?? firstCriterion["pt-BR"],
  };

  return {
    id: target.unitId,
    competencyId: note.competencyId,
    title: note.title,
    objective: note.objective,
    explanation: learningModule.understand,
    estimatedMinutes: learningModule.estimatedMinutes,
    practice: [
      {
        id: `${target.unitId}:example`,
        kind: "example",
        prompt: learningModule.understand,
      },
      {
        id: `${target.unitId}:problem`,
        kind: "problem",
        prompt: learningModule.commonMistake,
      },
      {
        id: learningModule.practice.id,
        kind: "practice",
        prompt: learningModule.practice.prompt,
      },
      {
        id: `${target.unitId}:checkpoint`,
        kind: "checkpoint",
        prompt: firstCriterion,
      },
      {
        id: `${target.unitId}:handoff`,
        kind: "handoff",
        prompt: secondCriterion,
      },
    ],
  };
}

export function getLearningUnitsForMilestone(milestoneId: string): readonly LearningUnit[] {
  getRoadmapMilestone(milestoneId);
  return (compatibilityTargets[milestoneId] ?? [])
    .map(projectCompatibilityUnit)
    .filter((unit): unit is LearningUnit => unit !== null);
}

export function isLearningUnitCompleted(
  profile: CareerProfile,
  milestoneId: string,
  unitId: string,
): boolean {
  const target = targetFor(milestoneId, unitId);
  if (!target) return false;
  const resolved = getLearningModuleByCriterion(target.criterionId);
  if (!resolved || resolved.note.id !== target.noteId || resolved.module.reviewStatus !== "reviewed") {
    return false;
  }

  return (
    getLearningProgress(profile, target.noteId)?.completedModuleIds.includes(resolved.module.id) === true
  );
}

export function completeLearningUnit(
  profile: CareerProfile,
  milestoneId: string,
  unitId: string,
  now?: string,
): CareerProfile {
  const roleId = profile.targetRoles[0];
  if (!roleId) throw new Error("Career learning requires a target role");

  const activeRoadmap = buildRoadmap(profile, getRoleMap(roleId));
  if (!activeRoadmap.milestoneIds.includes(milestoneId)) {
    throw new Error(`Learning milestone is not active for target role: ${milestoneId}`);
  }

  const target = targetFor(milestoneId, unitId);
  if (!target) {
    throw new Error(`Learning unit is not available for milestone: ${milestoneId}/${unitId}`);
  }

  const resolved = getLearningModuleByCriterion(target.criterionId);
  if (!resolved || resolved.note.id !== target.noteId || resolved.module.reviewStatus !== "reviewed") {
    throw new Error(`Learning unit has no reviewed module: ${milestoneId}/${unitId}`);
  }

  const afterPractice = completeLearningPractice(
    profile,
    target.noteId,
    resolved.module.id,
    resolved.module.practice.id,
    now,
  );
  return completeLearningModule(afterPractice, target.noteId, resolved.module.id, now);
}
