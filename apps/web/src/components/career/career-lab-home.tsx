"use client";

import type { Route } from "next";
import Link from "next/link";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";
import { CareerOverview } from "./career-overview";
import { useCareerProfile } from "./career-profile-provider";

export function CareerLabHome({ locale }: Readonly<{ locale: Locale }>) {
  const copy = careerLabCopy[locale];
  const { profile } = useCareerProfile();

  if (profile) {
    return <CareerOverview locale={locale} />;
  }

  return (
    <section className="career-lab-empty career-lab-empty--content">
      <p className="career-lab__eyebrow">{copy.eyebrow}</p>
      <h1>{copy.noProfileTitle}</h1>
      <p>{copy.noProfileBody}</p>
      <div className="career-lab-empty__actions">
        <Link href={`/${locale}/career-lab/onboarding` as Route}>{copy.startOnboarding}</Link>
        <Link href={`/${locale}/packs/developer-career` as Route}>{copy.developerCareerPack}</Link>
      </div>
    </section>
  );
}
