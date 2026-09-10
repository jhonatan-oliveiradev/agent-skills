import type { Locale } from "@/lib/locales";
import { baselineAssessmentBlueprints } from "./assessment-blueprints";
import { buildRoadmap, getRoadmapMilestoneViews } from "./roadmap-engine";
import { getRoleMap } from "./role-maps";
import type { CareerProfile } from "./types";

export type CareerNextAction =
  | { kind: "complete-baseline"; blueprintId: string; href: string }
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
