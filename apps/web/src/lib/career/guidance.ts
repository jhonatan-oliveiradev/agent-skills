import type { Locale } from "@/lib/locales";
import { baselineAssessmentBlueprints } from "./assessment-blueprints";
import { competencyDefinitions } from "./competencies";
import { getLearningNoteByCompetency } from "./learning-catalog";
import { getLearningProgress } from "./learning-progress";
import { buildRoadmap, getRoadmapMilestoneViews } from "./roadmap-engine";
import { getRoleMap } from "./role-maps";
import type { CareerProfile } from "./types";

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
      const nextModule = note?.modules.find(
        (module) => module.reviewStatus === "reviewed" &&
          !progress?.completedModuleIds.includes(module.id),
      );
      if (note && nextModule && !progress?.completedAt) {
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
      if (note && progress?.completedAt && blueprint && Date.parse(progress.completedAt) > Date.parse(latestAssessment.completedAt)) {
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
