import {
  baselineAssessmentBlueprints,
  getAssessmentBlueprint,
} from "./assessment-blueprints";
import type { AssessmentResultArtifact } from "./assessment";
import {
  competencyDefinitions,
  type CapabilityCriterion,
  type CompetencyId,
} from "./competencies";
import { getLearningModuleByCriterion } from "./learning-catalog";
import { getLearningProgress } from "./learning-progress";
import type { LearningModule, LearningNote } from "./learning-types";
import { getRoadmapMilestone } from "./roadmap-catalog";
import { getRoleMap } from "./role-maps";
import type { CareerProfile, ProficiencyLevel } from "./types";

export type LearningRecommendation =
  | {
      readonly kind: "study";
      readonly competencyId: CompetencyId;
      readonly criterionId: string;
      readonly noteId: string;
      readonly moduleId: string;
      readonly reason:
        | "blocking-gap"
        | "current-milestone"
        | "prerequisite"
        | "next-role-competency";
      readonly priority: number;
    }
  | {
      readonly kind: "prove";
      readonly competencyId: CompetencyId;
      readonly criterionId: string;
      readonly reason: "studied-not-proved";
      readonly priority: number;
      readonly destination: "assessment" | "evidence";
    };

const priority = {
  blockingGap: 500,
  studiedNotProved: 400,
  currentMilestone: 300,
  prerequisite: 200,
  nextRoleCompetency: 100,
} as const;

const proficiencyLevels = [
  "foundation",
  "developing",
  "proficient",
  "advanced",
] as const satisfies readonly ProficiencyLevel[];

const proficiencyRank: Readonly<Record<ProficiencyLevel, number>> = {
  foundation: 0,
  developing: 1,
  proficient: 2,
  advanced: 3,
};

type ModuleState = "not-started" | "in-progress" | "studied";

type ResolvedLearningContext = Readonly<{
  competencyId: CompetencyId;
  criterion: CapabilityCriterion;
  note: LearningNote;
  module: LearningModule;
  state: ModuleState;
}>;

function getCompetencyDefinition(competencyId: CompetencyId) {
  return competencyDefinitions.find((definition) => definition.id === competencyId);
}

function getObservedLevel(
  profile: CareerProfile,
  competencyId: CompetencyId,
): ProficiencyLevel | null {
  return (
    profile.competencies.find((state) => state.competencyId === competencyId)?.level ?? null
  );
}

function getNextCriterion(
  profile: CareerProfile,
  competencyId: CompetencyId,
  targetLevel: ProficiencyLevel,
): CapabilityCriterion | null {
  const definition = getCompetencyDefinition(competencyId);
  if (!definition) return null;

  const observedLevel = getObservedLevel(profile, competencyId);
  const observedRank = observedLevel === null ? -1 : proficiencyRank[observedLevel];
  const targetRank = proficiencyRank[targetLevel];
  if (observedRank >= targetRank) return null;

  const nextLevel = proficiencyLevels[observedRank + 1];
  return definition.criteria.find((criterion) => criterion.level === nextLevel) ?? null;
}

function getModuleState(
  profile: CareerProfile,
  note: LearningNote,
  module: LearningModule,
): ModuleState {
  const progress = getLearningProgress(profile, note.id);
  if (!progress) return "not-started";
  if (progress.completedModuleIds.includes(module.id)) return "studied";
  if (
    progress.currentModuleId === module.id ||
    progress.completedPracticeIds.includes(module.practice.id)
  ) {
    return "in-progress";
  }
  return "not-started";
}

function resolveContext(
  profile: CareerProfile,
  competencyId: CompetencyId,
  criterion: CapabilityCriterion,
): ResolvedLearningContext | null {
  const mapping = getLearningModuleByCriterion(criterion.id);
  if (!mapping || mapping.module.reviewStatus !== "reviewed") return null;

  return {
    competencyId,
    criterion,
    note: mapping.note,
    module: mapping.module,
    state: getModuleState(profile, mapping.note, mapping.module),
  };
}

function toStudyRecommendation(
  context: ResolvedLearningContext,
  reason: Exclude<LearningRecommendation, { kind: "prove" }>["reason"],
  value: number,
): LearningRecommendation {
  return {
    kind: "study",
    competencyId: context.competencyId,
    criterionId: context.criterion.id,
    noteId: context.note.id,
    moduleId: context.module.id,
    reason,
    priority: value,
  };
}

function getProofDestination(
  competencyId: CompetencyId,
  criterionId: string,
): "assessment" | "evidence" {
  const hasAssessmentMapping = baselineAssessmentBlueprints.some(
    (blueprint) =>
      blueprint.competencyId === competencyId &&
      blueprint.challenges.some((challenge) => challenge.criterionIds.includes(criterionId)),
  );
  return hasAssessmentMapping ? "assessment" : "evidence";
}

function uniqueContexts(
  contexts: readonly ResolvedLearningContext[],
): readonly ResolvedLearningContext[] {
  const seen = new Set<string>();
  return contexts.filter((context) => {
    if (seen.has(context.criterion.id)) return false;
    seen.add(context.criterion.id);
    return true;
  });
}

function getCurrentMilestoneContexts(
  profile: CareerProfile,
): readonly ResolvedLearningContext[] {
  const milestoneId = profile.roadmap.currentFocusMilestoneId;
  if (!milestoneId) return [];

  const milestone = getRoadmapMilestone(milestoneId);
  return milestone.requirements.flatMap((requirement) => {
    const criterion = getNextCriterion(
      profile,
      requirement.competencyId,
      requirement.targetLevel,
    );
    if (!criterion) return [];
    const context = resolveContext(profile, requirement.competencyId, criterion);
    return context ? [context] : [];
  });
}

function getRoleContexts(profile: CareerProfile): readonly ResolvedLearningContext[] {
  const roleId = profile.targetRoles[0];
  if (!roleId) return [];

  return getRoleMap(roleId).requirements.flatMap((requirement) => {
    const criterion = getNextCriterion(
      profile,
      requirement.competencyId,
      requirement.requiredLevel,
    );
    if (!criterion) return [];
    const context = resolveContext(profile, requirement.competencyId, criterion);
    return context ? [context] : [];
  });
}

function getPrerequisiteContexts(
  profile: CareerProfile,
): readonly ResolvedLearningContext[] {
  const roleId = profile.targetRoles[0];
  if (!roleId) return [];

  const contexts = getRoleMap(roleId).requirements.flatMap((requirement) => {
    const nextRoleCriterion = getNextCriterion(
      profile,
      requirement.competencyId,
      requirement.requiredLevel,
    );
    if (!nextRoleCriterion) return [];

    const definition = getCompetencyDefinition(requirement.competencyId);
    if (!definition) return [];

    return definition.prerequisites.flatMap((prerequisiteId) => {
      const criterion = getNextCriterion(profile, prerequisiteId, "foundation");
      if (!criterion) return [];
      const context = resolveContext(profile, prerequisiteId, criterion);
      return context ? [context] : [];
    });
  });

  return uniqueContexts(contexts);
}

export function getPrimaryLearningRecommendation(
  profile: CareerProfile,
): LearningRecommendation | null {
  const milestoneContexts = getCurrentMilestoneContexts(profile);
  const prerequisiteContexts = getPrerequisiteContexts(profile);
  const roleContexts = getRoleContexts(profile);
  const relevantContexts = uniqueContexts([
    ...milestoneContexts,
    ...prerequisiteContexts,
    ...roleContexts,
  ]);

  const blockingGap = relevantContexts.find(
    (context) => context.criterion.blocking && context.state !== "studied",
  );
  if (blockingGap) {
    return toStudyRecommendation(blockingGap, "blocking-gap", priority.blockingGap);
  }

  const studiedNotProved = relevantContexts.find((context) => context.state === "studied");
  if (studiedNotProved) {
    return {
      kind: "prove",
      competencyId: studiedNotProved.competencyId,
      criterionId: studiedNotProved.criterion.id,
      reason: "studied-not-proved",
      priority: priority.studiedNotProved,
      destination: getProofDestination(
        studiedNotProved.competencyId,
        studiedNotProved.criterion.id,
      ),
    };
  }

  const currentMilestone = milestoneContexts.find((context) => context.state !== "studied");
  if (currentMilestone) {
    return toStudyRecommendation(
      currentMilestone,
      "current-milestone",
      priority.currentMilestone,
    );
  }

  const prerequisite = prerequisiteContexts.find((context) => context.state !== "studied");
  if (prerequisite) {
    return toStudyRecommendation(prerequisite, "prerequisite", priority.prerequisite);
  }

  const nextRoleCompetency = roleContexts.find((context) => context.state !== "studied");
  if (nextRoleCompetency) {
    return toStudyRecommendation(
      nextRoleCompetency,
      "next-role-competency",
      priority.nextRoleCompetency,
    );
  }

  return null;
}

export function getAssessmentLearningRecommendation(
  result: AssessmentResultArtifact,
): LearningRecommendation | null {
  const blueprint = getAssessmentBlueprint(result.blueprintId);
  if (
    !blueprint ||
    blueprint.version !== result.blueprintVersion ||
    blueprint.competencyId !== result.competencyId
  ) {
    return null;
  }

  const failedChallengeIds = new Set(
    result.dimensions.flatMap((dimension) => dimension.failedChallengeIds),
  );

  for (const challenge of blueprint.challenges) {
    if (!failedChallengeIds.has(challenge.id)) continue;

    for (const criterionId of challenge.criterionIds) {
      const definition = competencyDefinitions.find(
        (candidate) => candidate.id === result.competencyId,
      );
      const criterion = definition?.criteria.find((candidate) => candidate.id === criterionId);
      if (!criterion) continue;

      const context = resolveContext(
        {
          ...({} as CareerProfile),
          competencies: [],
          learningProgress: [],
        },
        definition.id,
        criterion,
      );
      if (!context) continue;

      return {
        kind: "study",
        competencyId: context.competencyId,
        criterionId: context.criterion.id,
        noteId: context.note.id,
        moduleId: context.module.id,
        reason: "blocking-gap",
        priority: priority.blockingGap,
      };
    }
  }

  return null;
}

export function getMilestoneLearningModules(
  profile: CareerProfile,
  milestoneId: string,
): readonly Readonly<{
  note: LearningNote;
  module: LearningModule;
  state: "not-started" | "in-progress" | "studied";
}>[] {
  const milestone = getRoadmapMilestone(milestoneId);

  return milestone.requirements.flatMap((requirement) => {
    const criterion = getNextCriterion(
      profile,
      requirement.competencyId,
      requirement.targetLevel,
    );
    if (!criterion) return [];

    const context = resolveContext(profile, requirement.competencyId, criterion);
    if (!context) return [];

    return [
      {
        note: context.note,
        module: context.module,
        state: context.state,
      },
    ];
  });
}
