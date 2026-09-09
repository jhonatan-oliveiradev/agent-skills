"use client";

import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";
import { CareerDataControls } from "./career-data-controls";
import { useCareerProfile } from "./career-profile-provider";

const navigationSegments = ["", "roadmap", "assessments", "evidence", "market"] as const;

export function CareerLabShell({
  locale,
  children,
}: Readonly<{ locale: Locale; children?: ReactNode }>) {
  const copy = careerLabCopy[locale];
  const { profile, status } = useCareerProfile();

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

  return (
    <main className="career-lab-shell">
      <header className="career-lab-rail">
        <div className="career-lab-rail__brand">
          <span>Agent Skills Studio</span>
          <strong>Career Lab</strong>
          <Link
            className="career-lab-rail__pack-link"
            href={`/${locale}/packs/developer-career` as Route}
            title={copy.developerCareerPackHint}
          >
            {copy.developerCareerPack}
          </Link>
        </div>
        <nav aria-label="Career Lab">
          <ol>
            {copy.navigation.map((label, index) => {
              const segment = navigationSegments[index];
              const href = `/${locale}/career-lab${segment ? `/${segment}` : ""}` as Route;
              const available = index <= 4;
              return (
                <li key={label}>
                  {available ? (
                    <Link href={href}>
                      <span>0{index + 1}</span>
                      {label}
                    </Link>
                  ) : (
                    <span aria-disabled="true">
                      <span>0{index + 1}</span>
                      {label}
                    </span>
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
        {children}
      </div>
    </main>
  );
}
