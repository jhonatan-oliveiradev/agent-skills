import type { Route } from "next";
import Link from "next/link";
import {
  getAssessmentBlueprint,
  getAssessmentPresentation,
} from "@/lib/career/assessment-blueprints";
import { getCareerNextAction, type CareerNextAction as NextAction } from "@/lib/career/guidance";
import { careerGuidanceCopy } from "@/lib/career/guidance-copy";
import { getRoadmapMilestone } from "@/lib/career/roadmap-catalog";
import type { CareerProfile } from "@/lib/career/types";
import type { Locale } from "@/lib/locales";

function actionPresentation(action: NextAction, locale: Locale) {
  const copy = careerGuidanceCopy[locale].nextAction;

  switch (action.kind) {
    case "complete-baseline": {
      const blueprint = getAssessmentBlueprint(action.blueprintId);
      const title = blueprint
        ? getAssessmentPresentation(blueprint, locale).title
        : action.blueprintId;
      return copy.completeBaseline(title);
    }
    case "review-roadmap":
      return copy.reviewRoadmap;
    case "produce-evidence":
      return copy.produceEvidence(
        getRoadmapMilestone(action.milestoneId).title[locale],
        action.competencyIds.length,
      );
    case "add-market-sample":
      return copy.addMarketSample;
    case "continue-roadmap":
      return copy.continueRoadmap(getRoadmapMilestone(action.milestoneId).title[locale]);
  }
}

export function CareerNextAction({
  profile,
  locale,
}: Readonly<{ profile: CareerProfile; locale: Locale }>) {
  const action = getCareerNextAction(profile, locale);
  const copy = careerGuidanceCopy[locale].nextAction;
  const presentation = actionPresentation(action, locale);

  return (
    <aside
      className="career-next-action"
      data-kind={action.kind}
      aria-labelledby="career-next-action-title"
    >
      <p className="career-lab__eyebrow">{copy.label}</p>
      <div className="career-next-action__body">
        <h2 id="career-next-action-title">{presentation.title}</h2>
        <p>{presentation.reason}</p>
      </div>
      <Link className="career-next-action__link" href={action.href as Route}>
        {presentation.action}
      </Link>
    </aside>
  );
}
