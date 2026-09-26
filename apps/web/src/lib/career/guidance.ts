import type { Locale } from "@/lib/locales";
import { baselineAssessmentBlueprints } from "./assessment-blueprints";
import { competencyDefinitions } from "./competencies";
import { getLearningNoteByCompetency } from "./learning-catalog";
import { getLearningProgress } from "./learning-progress";
import { buildRoadmap, getRoadmapMilestoneViews } from "./roadmap-engine";
import { getRoleMap } from "./role-maps";
import type { CareerProfile, ProficiencyLevel } from "./types";

const levels: readonly ProficiencyLevel[] = ["foundation", "developing", "proficient", "advanced"];

export type CareerNextAction =
  | { kind: "complete-baseline"; blueprintId: string; href: string }
  | { kind: "study-assessed-gap"; noteId: string; moduleId: string; href: string }
  | { kind: "prove-studied-gap"; blueprintId: string; href: string }
  | { kind: "review-roadmap"; href: string }
  | {
      kind: "produce-evidence";
      milestoneId: string;
      competencyIds: readonly string[];
      href: string;
    }
  | { kind: "add-market-sample"; href: string }
  | { kind: "continue-roadmap"; milestoneId: string; href: string };

function careerHref(locale: Locale, segment: string): string {
  return `/${locale}/career-lab/${segment}`;
}

export function getCareerNextAction(
  profile: CareerProfile,
  locale: Locale,
): CareerNextAction {
  const missingBaseline = baselineAssessmentBlueprints.find(
    (blueprint) =>
      !profile.assessments.some(
        (assessment) =>
          assessment.blueprintId === blueprint.id &&
          assessment.blueprintVersion === blueprint.version,
      ),
  );

  if (missingBaseline) {
    const latestAssessment = [...profile.assessments].sort(
      (a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt),
    )[0];
    if (latestAssessment) {
      const competency = competencyDefinitions.find(
        (item) => item.id === latestAssessment.competencyId,
      );
      const note = competency ? getLearningNoteByCompetency(competency.id) : undefined;
      const progress = note ? getLearningProgress(profile, note.id) : undefined;
      const requirement = profile.targetRoles[0]
        ? getRoleMap(profile.targetRoles[0]).requirements.find(
            (item) => item.competencyId === latestAssessment.competencyId,
          )
        : undefined;
      const observedRank = levels.indexOf(latestAssessment.level);
      const targetRank = requirement ? levels.indexOf(requirement.requiredLevel) : -1;
      const nextLevel = observedRank < targetRank ? levels[observedRank + 1] : undefined;
      const nextModule = note?.modules.find(
        (module) => module.reviewStatus === "reviewed" && module.level === nextLevel,
      );
      const moduleStudiedAfterAssessment = nextModule &&
        progress?.completedModuleIds.includes(nextModule.id) &&
        Date.parse(progress.updatedAt) > Date.parse(latestAssessment.completedAt);
      if (note && nextModule && !progress?.completedModuleIds.includes(nextModule.id)) {
        return {
          kind: "study-assessed-gap",
          noteId: note.id,
          moduleId: nextModule.id,
          href: careerHref(locale, `learning/${note.id}#${nextModule.id}`),
        };
      }
      const blueprint = baselineAssessmentBlueprints.find(
        (item) => item.competencyId === latestAssessment.competencyId,
      );
      if (note && moduleStudiedAfterAssessment && blueprint) {
        return {
          kind: "prove-studied-gap",
          blueprintId: blueprint.id,
          href: careerHref(locale, `assessments/${blueprint.id}`),
        };
      }
    }
    return {
      kind: "complete-baseline",
      blueprintId: missingBaseline.id,
      href: careerHref(locale, `assessments/${missingBaseline.id}`),
    };
  }

  const roleId = profile.targetRoles[0];
  if (!roleId) {
    return { kind: "review-roadmap", href: careerHref(locale, "roadmap") };
  }

  const roleMap = getRoleMap(roleId);
  const roadmap = buildRoadmap(profile, roleMap);
  const milestoneId = roadmap.currentFocusMilestoneId;

  if (!milestoneId) {
    return { kind: "review-roadmap", href: careerHref(locale, "roadmap") };
  }

  const currentMilestone = getRoadmapMilestoneViews(profile, roleMap, roadmap).find(
    (milestone) => milestone.id === milestoneId,
  );

  if (currentMilestone && currentMilestone.evidenceGaps.length > 0) {
    return {
      kind: "produce-evidence",
      milestoneId,
      competencyIds: currentMilestone.evidenceGaps,
      href: careerHref(locale, "evidence"),
    };
  }

  if (profile.marketSamples.length === 0) {
    return { kind: "add-market-sample", href: careerHref(locale, "market") };
  }

  return {
    kind: "continue-roadmap",
    milestoneId,
    href: careerHref(locale, "roadmap"),
  };
}
