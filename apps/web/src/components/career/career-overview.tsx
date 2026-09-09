"use client";

import { baselineAssessmentBlueprints } from "@/lib/career/assessment-blueprints";
import { careerLabCopy, careerLabRoleLabels } from "@/lib/career/copy";
import { calculateRoleReadiness } from "@/lib/career/readiness";
import { buildRoadmap, getRoadmapMilestoneViews } from "@/lib/career/roadmap-engine";
import { getRoleMap } from "@/lib/career/role-maps";
import type { Locale } from "@/lib/locales";
import { useCareerProfile } from "./career-profile-provider";

export function CareerOverview({ locale }: Readonly<{ locale: Locale }>) {
  const { profile } = useCareerProfile();
  if (!profile) return null;

  const roleId = profile.targetRoles[0];
  if (!roleId) return null;

  const copy = careerLabCopy[locale];
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
          <strong>{effectiveRoadmap.currentFocusMilestoneId ?? copy.noCurrentFocus}</strong>
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

      {baselineIncomplete ? (
        <p className="career-overview__baseline">{copy.baselineIncomplete}</p>
      ) : null}

      <section className="career-overview__competencies" aria-labelledby="career-competencies-title">
        <div className="career-overview__section-heading">
          <p className="career-lab__eyebrow">{copy.competencyStates}</p>
          <h2 id="career-competencies-title">{profile.competencies.length}</h2>
        </div>
        <ul>
          {profile.competencies.map((competency) => (
            <li key={competency.competencyId}>
              <code>{competency.competencyId}</code>
              <span>{copy.competencyState(competency.level, competency.confidence)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="career-overview__gaps" aria-labelledby="career-gaps-title">
        <div className="career-overview__section-heading">
          <p className="career-lab__eyebrow">{copy.blockingGaps}</p>
          <h2 id="career-gaps-title">{copy.openGaps(readiness.blockingGaps.length)}</h2>
        </div>
        {readiness.blockingGaps.length > 0 ? (
          <ul>
            {readiness.blockingGaps.map((competencyId) => (
              <li key={competencyId}>
                <code>{competencyId}</code>
                <span>{readiness.evidenceGaps.includes(competencyId) ? copy.evidenceGap : copy.capabilityGap}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>—</p>
        )}
      </section>
    </section>
  );
}
