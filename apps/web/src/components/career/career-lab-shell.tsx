"use client";

import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";
import { CareerDataControls } from "./career-data-controls";
import { CareerOverview } from "./career-overview";
import { useCareerProfile } from "./career-profile-provider";

const navigationSegments = ["", "roadmap", "assessments", "evidence", "market"] as const;

export function CareerLabShell({
  locale,
  children,
}: Readonly<{ locale: Locale; children?: ReactNode }>) {
  const copy = careerLabCopy[locale];
  const { profile, status } = useCareerProfile();
  const hasRouteContent = children !== undefined && children !== null;

  if (status === "hydrating") {
    return (
      <main className="career-lab-shell career-lab-shell--state">
        <p role="status">{copy.loading}</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="career-lab-shell career-lab-shell--state">
        <p role="alert">{copy.storageError}</p>
      </main>
    );
  }

  if (!profile && !hasRouteContent) {
    return (
      <main className="career-lab-shell career-lab-shell--empty">
        <section className="career-lab-empty">
          <p className="career-lab__eyebrow">{copy.eyebrow}</p>
          <h1>{copy.noProfileTitle}</h1>
          <p>{copy.noProfileBody}</p>
          <Link href={`/${locale}/career-lab/onboarding` as Route}>{copy.startOnboarding}</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="career-lab-shell">
      <header className="career-lab-rail">
        <div className="career-lab-rail__brand">
          <span>Agent Skills Studio</span>
          <strong>Career Lab</strong>
        </div>
        <nav aria-label="Career Lab">
          <ol>
            {copy.navigation.map((label, index) => {
              const segment = navigationSegments[index];
              const href = `/${locale}/career-lab${segment ? `/${segment}` : ""}` as Route;
              const available = index === 0 || index === 2;
              return (
                <li key={label}>
                  {available ? (
                    <Link href={href}><span>0{index + 1}</span>{label}</Link>
                  ) : (
                    <span aria-disabled="true"><span>0{index + 1}</span>{label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        {profile ? <CareerDataControls locale={locale} /> : null}
      </header>

      <div className="career-lab-content">
        <header className="career-lab-content__masthead">
          <p className="career-lab__eyebrow">{copy.eyebrow}</p>
          <p>{copy.summary}</p>
        </header>
        {hasRouteContent ? children : <CareerOverview locale={locale} />}
      </div>
    </main>
  );
}
