import type { Route } from "next";
import Link from "next/link";
import type { AssessmentBlueprint } from "@/lib/career/assessment";
import type { Locale } from "@/lib/locales";

function labelFor(blueprint: AssessmentBlueprint): string {
  return blueprint.competencyId
    .replace("programming-", "")
    .replace("web-platform-foundations", "web platform")
    .replace("http-api-engineering", "HTTP API")
    .replace("git-collaboration", "Git collaboration")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function AssessmentList({
  locale,
  blueprints,
}: Readonly<{ locale: Locale; blueprints: readonly AssessmentBlueprint[] }>) {
  return (
    <section className="career-assessment-list" aria-labelledby="assessment-list-title">
      <header>
        <p className="career-lab__eyebrow">Skill Assessment</p>
        <h1 id="assessment-list-title">Baseline assessments</h1>
        <p>Short, deterministic probes establish an evidence-aware baseline.</p>
      </header>
      <ol>
        {blueprints.map((blueprint) => (
          <li key={blueprint.id}>
            <Link
              href={("/" + locale + "/career-lab/assessments/" + blueprint.id) as Route}
            >
              {labelFor(blueprint)} baseline assessment
            </Link>
            <p>{blueprint.dimensions.map((dimension) => dimension.label).join(" · ")}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
