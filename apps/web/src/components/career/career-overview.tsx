"use client";

import { baselineAssessmentBlueprints } from "@/lib/career/assessment-blueprints";
import { careerLabCopy, careerLabRoleLabels } from "@/lib/career/copy";
import { getCompetencyLabel } from "@/lib/career/presentation";
import { calculateRoleReadiness } from "@/lib/career/readiness";
import { getRoadmapMilestone } from "@/lib/career/roadmap-catalog";
import { buildRoadmap, getRoadmapMilestoneViews } from "@/lib/career/roadmap-engine";
import { getRoleMap } from "@/lib/career/role-maps";
import type { Locale } from "@/lib/locales";
import { CareerNextAction } from "./career-next-action";
import { useCareerProfile } from "./career-profile-provider";

const capabilityLedgerCopy = {
  en: {
    eyebrow: "Capability system",
    title: "Capability map",
    aligned: "aligned",
  },
  "pt-BR": {
    eyebrow: "Sistema de capacidades",
    title: "Mapa de capacidades",
    aligned: "alinhada",
  },
} as const satisfies Record<Locale, { eyebrow: string; title: string; aligned: string }>;

export function CareerOverview({ locale }: Readonly<{ locale: Locale }>) {
  const { profile } = useCareerProfile();
  if (!profile) return null;

  const roleId = profile.targetRoles[0];
  if (!roleId) return null;

  const copy = careerLabCopy[locale];
  const ledgerCopy = capabilityLedgerCopy[locale];
  const roleMap = getRoleMap(roleId);
  const readiness = calculateRoleReadiness(profile, roleMap);
  const effectiveRoadmap = buildRoadmap(profile, roleMap);
  const milestoneViews = getRoadmapMilestoneViews(profile, roleMap, effectiveRoadmap);
  const targetMarket = profile.targetMarkets[0] ?? "—";
  const totalMilestones = milestoneViews.length;
  const completedMilestones = milestoneViews.filter(
    (milestone) => milestone.status === "completed",
  ).length;
  const latestMarket = [...profile.marketSamples].sort((a, b) =>
    b.capturedAt.localeCompare(a.capturedAt),
  )[0];
  const baselineIncomplete = baselineAssessmentBlueprints.some((blueprint) =>
    !profile.assessments.some(
      (assessment) =>
        assessment.blueprintId === blueprint.id &&
        assessment.blueprintVersion === blueprint.version,
    ),
  );
  const currentFocusTitle = effectiveRoadmap.currentFocusMilestoneId
    ? getRoadmapMilestone(effectiveRoadmap.currentFocusMilestoneId).title[locale]
    : copy.noCurrentFocus;
  const capabilityRows = roleMap.requirements.map((requirement) => {
    const state = profile.competencies.find(
      (candidate) => candidate.competencyId === requirement.competencyId,
    );
    const gap = readiness.blockingGaps.includes(requirement.competencyId)
      ? readiness.evidenceGaps.includes(requirement.competencyId)
        ? copy.evidenceGap
        : copy.capabilityGap
      : null;

    return {
      requirement,
      state,
      gap,
    };
  });

  return (
    <section className="career-overview" aria-labelledby="career-overview-title">
      <header className="career-overview__hero">
        <div>
          <p className="career-lab__eyebrow">{copy.readiness}</p>
          <h1 id="career-overview-title">{careerLabRoleLabels[locale][roleId]}</h1>
          <p className="career-overview__market">{copy.targetMarket(targetMarket)}</p>
        </div>
        <div className="career-overview__score" aria-label={`${copy.readiness}: ${readiness.percentage}%`}>
          <strong>{readiness.percentage}%</strong>
          <span>{copy.readiness}</span>
        </div>
      </header>

      <div className="career-overview__grid">
        <article className="career-card career-card--focus">
          <p className="career-card__label">{copy.currentFocus}</p>
          <strong>{currentFocusTitle}</strong>
          <p>{profile.weeklyStudyHours ? copy.weeklyCapacity(profile.weeklyStudyHours) : "—"}</p>
        </article>

        <article className="career-card">
          <p className="career-card__label">{copy.roadmapProgress}</p>
          <strong>{copy.milestoneProgress(completedMilestones, totalMilestones)}</strong>
        </article>

        <article className="career-card">
          <p className="career-card__label">{copy.evidence}</p>
          <strong>{profile.evidence.length > 0 ? profile.evidence.length : copy.noEvidenceYet}</strong>
          <p>
            {profile.assessments.length > 0
              ? `${profile.assessments.length} ${copy.assessments}`
              : copy.noAssessmentsYet}
          </p>
        </article>

        <article className="career-card">
          <p className="career-card__label">{copy.latestMarket}</p>
          {latestMarket ? (
            <>
              <strong>{latestMarket.postingCount} {copy.postings}</strong>
              <p>{latestMarket.distinctCompanyCount} {copy.companies} · {latestMarket.distinctSourceCount} {copy.sources}</p>
            </>
          ) : (
            <strong>{copy.noMarketSample}</strong>
          )}
        </article>
      </div>

      <CareerNextAction profile={profile} locale={locale} />

      {baselineIncomplete ? (
        <p className="career-overview__baseline">{copy.baselineIncomplete}</p>
      ) : null}

      <section
        className="career-overview__capability-ledger"
        aria-labelledby="career-capability-ledger-title"
      >
        <div className="career-overview__section-heading career-overview__capability-heading">
          <div>
            <p className="career-lab__eyebrow">{ledgerCopy.eyebrow}</p>
            <h2 id="career-capability-ledger-title">{ledgerCopy.title}</h2>
          </div>
          <p className="career-overview__capability-summary">
            {copy.openGaps(readiness.blockingGaps.length)}
          </p>
        </div>

        <ul>
          {capabilityRows.map(({ requirement, state, gap }) => (
            <li key={requirement.competencyId} data-gap={gap ? "blocking" : "clear"}>
              <div className="career-overview__capability-name">
                <strong>{getCompetencyLabel(requirement.competencyId, locale)}</strong>
                <code>{requirement.competencyId}</code>
              </div>
              <span className="career-overview__capability-state">
                {copy.competencyState(state?.level ?? null, state?.confidence ?? "low")}
              </span>
              <span className="career-overview__capability-gap">{gap ?? ledgerCopy.aligned}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
