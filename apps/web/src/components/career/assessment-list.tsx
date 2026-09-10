"use client";

import type { Route } from "next";
import Link from "next/link";
import type { AssessmentBlueprint } from "@/lib/career/assessment";
import { getAssessmentPresentation } from "@/lib/career/assessment-blueprints";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";
import { useCareerProfile } from "./career-profile-provider";

export function AssessmentList({
  locale,
  blueprints,
}: Readonly<{ locale: Locale; blueprints: readonly AssessmentBlueprint[] }>) {
  const labCopy = careerLabCopy[locale];
  const copy = labCopy.assessment;
  const { profile, status } = useCareerProfile();

  if (status === "hydrating") {
    return (
      <section className="career-assessment-list career-assessment-list--state">
        <p role="status">{labCopy.loading}</p>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="career-assessment-list career-assessment-list--state">
        <p role="alert">{labCopy.storageError}</p>
      </section>
    );
  }

  const completedIds = new Set(
    (profile?.assessments ?? []).map(
      (assessment) => `${assessment.blueprintId}@${assessment.blueprintVersion}`,
    ),
  );
  const completedCount = blueprints.filter((blueprint) =>
    completedIds.has(`${blueprint.id}@${blueprint.version}`),
  ).length;

  return (
    <section className="career-assessment-list" aria-labelledby="assessment-list-title">
      <header className="career-assessment-list__hero">
        <div className="career-assessment-list__intro">
          <p className="career-lab__eyebrow">{copy.indexEyebrow}</p>
          <h1 id="assessment-list-title">{copy.listTitle}</h1>
          <p>{copy.indexBody}</p>
        </div>
        <div className="career-assessment-list__progress" role="status">
          <strong>{copy.completedSummary(completedCount, blueprints.length)}</strong>
          <span>{copy.listBody}</span>
        </div>
      </header>

      <ol className="career-assessment-index">
        {blueprints.map((blueprint, index) => {
          const presentation = getAssessmentPresentation(blueprint, locale);
          const completed = completedIds.has(`${blueprint.id}@${blueprint.version}`);
          const href = (`/${locale}/career-lab/assessments/${blueprint.id}`) as Route;

          return (
            <li
              className="career-assessment-index__row"
              data-status={completed ? "completed" : "not-started"}
              data-testid="assessment-index-row"
              key={blueprint.id}
            >
              <span className="career-assessment-index__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="career-assessment-index__meta">
                <div>
                  <h2>{presentation.title}</h2>
                  <p>{presentation.dimensionLabel}</p>
                </div>
                <span>{completed ? copy.completed : copy.notStarted}</span>
              </div>
              <Link className="career-assessment-index__action" href={href}>
                {completed ? copy.review(presentation.title) : copy.start(presentation.title)}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
