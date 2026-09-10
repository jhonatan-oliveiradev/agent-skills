"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";
import { CareerDataControls } from "./career-data-controls";
import { useCareerProfile } from "./career-profile-provider";

const navigationSegments = ["", "roadmap", "assessments", "evidence", "market"] as const;

const shellClosingCopy = {
  en: {
    local: "Local-first workspace",
    methods: "Methods ↗",
    studio: "Agent Skills Studio ↗",
    navigationLabel: "Career Lab ecosystem",
  },
  "pt-BR": {
    local: "Workspace local-first",
    methods: "Métodos ↗",
    studio: "Agent Skills Studio ↗",
    navigationLabel: "Ecossistema do Career Lab",
  },
} as const;

function routeIsCurrent(pathname: string, href: string, index: number): boolean {
  if (index === 0) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CareerLabShell({
  locale,
  children,
}: Readonly<{ locale: Locale; children?: ReactNode }>) {
  const copy = careerLabCopy[locale];
  const closingCopy = shellClosingCopy[locale];
  const { profile, status } = useCareerProfile();
  const pathname = usePathname() ?? "";
  const guideHref = `/${locale}/career-lab/guide` as Route;
  const guideIsCurrent = pathname === guideHref || pathname.startsWith(`${guideHref}/`);

  if (status === "hydrating") {
    return (
      <main id="main-content" className="career-lab-shell career-lab-shell--state">
        <p role="status">{copy.loading}</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main id="main-content" className="career-lab-shell career-lab-shell--state">
        <p role="alert">{copy.storageError}</p>
      </main>
    );
  }

  return (
    <main id="main-content" className="career-lab-shell">
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
              return (
                <li key={label}>
                  <Link
                    href={href}
                    aria-current={routeIsCurrent(pathname, href, index) ? "page" : undefined}
                  >
                    <span>0{index + 1}</span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="career-lab-rail__utilities" aria-label={copy.utilities}>
          <Link
            className="career-lab-rail__guide"
            href={guideHref}
            aria-current={guideIsCurrent ? "page" : undefined}
          >
            {copy.guide}
          </Link>
          <span className="career-lab-rail__local">{copy.localFirstIndicator}</span>
          {profile ? <CareerDataControls locale={locale} /> : null}
        </div>
      </header>

      <div className="career-lab-content">
        <header className="career-lab-content__masthead">
          <p className="career-lab__eyebrow">{copy.eyebrow}</p>
          <p>{copy.summary}</p>
        </header>
        {children}
        <footer className="career-lab-product-footer">
          <div className="career-lab-product-footer__identity">
            <strong>Career Lab</strong>
            <span>{closingCopy.local}</span>
          </div>
          <nav aria-label={closingCopy.navigationLabel}>
            <Link
              href={`/${locale}/packs/developer-career` as Route}
              title={copy.developerCareerPackHint}
            >
              {closingCopy.methods}
            </Link>
            <Link href={`/${locale}` as Route}>{closingCopy.studio}</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
