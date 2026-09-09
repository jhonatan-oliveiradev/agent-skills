"use client";

import type { Route } from "next";
import Link from "next/link";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";
import { CareerOverview } from "./career-overview";
import { useCareerProfile } from "./career-profile-provider";

export function CareerLabHome({ locale }: Readonly<{ locale: Locale }>) {
  const copy = careerLabCopy[locale];
  const entry = copy.entry;
  const { profile } = useCareerProfile();

  if (profile) {
    return <CareerOverview locale={locale} />;
  }

  return (
    <section className="career-lab-entry" aria-labelledby="career-lab-entry-title">
      <div className="career-lab-entry__hero">
        <div className="career-lab-entry__intro">
          <p className="career-lab__eyebrow">{entry.eyebrow}</p>
          <h1 id="career-lab-entry-title">{entry.title}</h1>
          <p className="career-lab-entry__lede">{entry.body}</p>
          <div className="career-lab-entry__start">
            <Link
              className="career-lab-entry__primary"
              href={`/${locale}/career-lab/onboarding` as Route}
            >
              {entry.cta}
              <span aria-hidden="true">→</span>
            </Link>
            <p>{entry.localNote}</p>
          </div>
        </div>

        <dl className="career-lab-entry__dimensions">
          {entry.dimensions.map((dimension) => (
            <div key={dimension.label}>
              <dt>{dimension.label}</dt>
              <dd>{dimension.body}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="career-lab-entry__journey" aria-labelledby="career-lab-entry-journey">
        <header>
          <p className="career-lab__eyebrow">{entry.journeyEyebrow}</p>
          <h2 id="career-lab-entry-journey">{entry.howItWorks}</h2>
        </header>

        <ol aria-label={entry.howItWorks}>
          {entry.stages.map((stage, index) => (
            <li key={stage.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{stage.title}</h3>
              <p>{stage.body}</p>
            </li>
          ))}
        </ol>

        <div className="career-lab-entry__pack">
          <p>{copy.developerCareerPackHint}</p>
          <Link href={`/${locale}/packs/developer-career` as Route}>
            {copy.developerCareerPack}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </section>
  );
}
