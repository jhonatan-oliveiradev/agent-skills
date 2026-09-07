import type { Route } from "next";
import Link from "next/link";
import type { AssessmentBlueprint } from "@/lib/career/assessment";
import { getAssessmentPresentation } from "@/lib/career/assessment-blueprints";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";

export function AssessmentList({
  locale,
  blueprints,
}: Readonly<{ locale: Locale; blueprints: readonly AssessmentBlueprint[] }>) {
  const copy = careerLabCopy[locale].assessment;

  return (
    <section className="career-assessment-list" aria-labelledby="assessment-list-title">
      <header>
        <p className="career-lab__eyebrow">{copy.eyebrow}</p>
        <h1 id="assessment-list-title">{copy.listTitle}</h1>
        <p>{copy.listBody}</p>
      </header>
      <ol>
        {blueprints.map((blueprint) => {
          const presentation = getAssessmentPresentation(blueprint, locale);
          return (
            <li key={blueprint.id}>
              <Link
                href={("/" + locale + "/career-lab/assessments/" + blueprint.id) as Route}
              >
                {presentation.title} {copy.itemSuffix}
              </Link>
              <p>{presentation.dimensionLabel}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
