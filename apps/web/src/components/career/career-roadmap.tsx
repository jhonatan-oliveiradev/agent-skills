"use client";

import { useEffect, useMemo } from "react";
import {
  buildRoadmap,
  getRoadmapMilestoneViews,
  type RoadmapMilestoneView,
} from "@/lib/career/roadmap-engine";
import { getRoleMap } from "@/lib/career/role-maps";
import type { CareerProfile, MilestoneStatus, RoadmapState } from "@/lib/career/types";
import type { Locale } from "@/lib/locales";
import { useCareerProfile } from "./career-profile-provider";

const copy = {
  en: {
    now: "NOW",
    next: "NEXT",
    map: "MAP",
    whyNow: "Why now",
    nextTitle: "Next available milestones",
    noNext: "No additional milestone is available until the current dependency is cleared.",
    capabilityGap: "Capability gap",
    evidenceGate: "Evidence gate",
    effort: "Estimated effort",
    noProfile: "Create a Career Profile before generating an adaptive roadmap.",
    noFocus: "All currently applicable milestones are complete.",
    priorityReason: (capabilityCount: number, evidenceCount: number) =>
      `This milestone is the highest-priority dependency for the target role with ${capabilityCount} capability gap${capabilityCount === 1 ? "" : "s"} and ${evidenceCount} evidence gate${evidenceCount === 1 ? "" : "s"} still open.`,
    statuses: {
      locked: "Locked",
      available: "Available",
      "in-progress": "In progress",
      "ready-for-assessment": "Ready for assessment",
      completed: "Completed",
    },
  },
  "pt-BR": {
    now: "Agora",
    next: "Próximos",
    map: "Mapa",
    whyNow: "Por que agora",
    nextTitle: "Próximos marcos disponíveis",
    noNext: "Nenhum marco adicional fica disponível até que a dependência atual seja concluída.",
    capabilityGap: "Lacuna de capacidade",
    evidenceGate: "Gate de evidência",
    effort: "Esforço estimado",
    noProfile: "Crie um Career Profile antes de gerar um roadmap adaptativo.",
    noFocus: "Todos os marcos atualmente aplicáveis estão concluídos.",
    priorityReason: (capabilityCount: number, evidenceCount: number) =>
      `Este marco é a dependência de maior prioridade para o papel-alvo, com ${capabilityCount} lacuna${capabilityCount === 1 ? "" : "s"} de capacidade e ${evidenceCount} gate${evidenceCount === 1 ? "" : "s"} de evidência ainda aberto${evidenceCount === 1 ? "" : "s"}.`,
    statuses: {
      locked: "Bloqueado",
      available: "Disponível",
      "in-progress": "Em andamento",
      "ready-for-assessment": "Pronto para avaliação",
      completed: "Concluído",
    },
  },
} as const;

function roadmapEqual(left: RoadmapState, right: RoadmapState): boolean {
  return (
    left.currentFocusMilestoneId === right.currentFocusMilestoneId &&
    left.supportingActivityId === right.supportingActivityId &&
    left.milestoneIds.length === right.milestoneIds.length &&
    left.milestoneIds.every((id, index) => id === right.milestoneIds[index])
  );
}

function formatEffort(milestone: RoadmapMilestoneView): string {
  return `${milestone.estimatedEffortHours.min}–${milestone.estimatedEffortHours.max} h`;
}

function statusLabel(locale: Locale, status: MilestoneStatus): string {
  return copy[locale].statuses[status];
}

function MilestoneSummary({
  locale,
  milestone,
}: Readonly<{ locale: Locale; milestone: RoadmapMilestoneView }>) {
  return (
    <article className="career-roadmap-card" data-status={milestone.status}>
      <div className="career-roadmap-card__meta">
        <span className="career-roadmap-card__status">{statusLabel(locale, milestone.status)}</span>
        <span>{formatEffort(milestone)}</span>
      </div>
      <h3>{milestone.title[locale]}</h3>
      <p>{milestone.summary[locale]}</p>
    </article>
  );
}

export function CareerRoadmap({
  locale,
  profile,
}: Readonly<{ locale: Locale; profile: CareerProfile }>) {
  const localized = copy[locale];
  const roleId = profile.targetRoles[0];
  if (!roleId) return <p role="alert">{localized.noProfile}</p>;

  const roleMap = getRoleMap(roleId);
  const roadmap = buildRoadmap(profile, roleMap);
  const milestones = getRoadmapMilestoneViews(profile, roleMap, roadmap);
  const current = milestones.find((milestone) => milestone.id === roadmap.currentFocusMilestoneId) ?? null;
  const currentIndex = current ? milestones.findIndex((milestone) => milestone.id === current.id) : -1;
  const nextMilestones = milestones
    .slice(currentIndex >= 0 ? currentIndex + 1 : 0)
    .filter((milestone) => milestone.status !== "completed")
    .slice(0, 3);

  return (
    <div className="career-roadmap" data-locale={locale}>
      <section className="career-roadmap-now" role="region" aria-label={localized.now}>
        <header className="career-roadmap-section-heading">
          <p>{localized.now}</p>
          {current ? <span className="career-roadmap-card__status">{statusLabel(locale, current.status)}</span> : null}
        </header>
        {current ? (
          <div className="career-roadmap-now__grid">
            <div className="career-roadmap-now__identity">
              <p className="career-roadmap-now__index">01 / CURRENT FOCUS</p>
              <h1>{current.title[locale]}</h1>
              <p>{current.summary[locale]}</p>
            </div>
            <div className="career-roadmap-now__rationale">
              <h2>{localized.whyNow}</h2>
              <p>
                {localized.priorityReason(
                  current.priorityFactors.capabilityGapCount,
                  current.priorityFactors.evidenceGapCount,
                )}
              </p>
              <dl>
                <div>
                  <dt>{localized.capabilityGap}</dt>
                  <dd>{current.capabilityGaps.length > 0 ? current.capabilityGaps.join(", ") : "—"}</dd>
                </div>
                <div>
                  <dt>{localized.evidenceGate}</dt>
                  <dd>
                    {current.evidenceRequirements.length > 0
                      ? current.evidenceRequirements.map((requirement) => requirement.minimumClass).join(" · ")
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt>{localized.effort}</dt>
                  <dd>{formatEffort(current)}</dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <p className="career-roadmap-empty">{localized.noFocus}</p>
        )}
      </section>

      <section className="career-roadmap-next" role="region" aria-label={localized.next}>
        <header className="career-roadmap-section-heading">
          <p>{localized.next}</p>
          <strong>{localized.nextTitle}</strong>
        </header>
        {nextMilestones.length > 0 ? (
          <div className="career-roadmap-next__grid">
            {nextMilestones.map((milestone) => (
              <MilestoneSummary key={milestone.id} locale={locale} milestone={milestone} />
            ))}
          </div>
        ) : (
          <p className="career-roadmap-empty">{localized.noNext}</p>
        )}
      </section>

      <section className="career-roadmap-map" role="region" aria-label={localized.map}>
        <header className="career-roadmap-section-heading">
          <p>{localized.map}</p>
          <strong>{milestones.length.toString().padStart(2, "0")} milestones</strong>
        </header>
        <div className="career-roadmap-map__sequence">
          {milestones.map((milestone, index) => (
            <article
              key={milestone.id}
              className="career-roadmap-map__milestone"
              data-status={milestone.status}
            >
              <span className="career-roadmap-map__number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{milestone.title[locale]}</h3>
                <p>{milestone.summary[locale]}</p>
              </div>
              <div className="career-roadmap-map__state">
                <strong>{statusLabel(locale, milestone.status)}</strong>
                <span>{formatEffort(milestone)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function CareerRoadmapSurface({ locale }: Readonly<{ locale: Locale }>) {
  const { profile, status, updateProfile } = useCareerProfile();
  const roleId = profile?.targetRoles[0] ?? null;
  const derivedRoadmap = useMemo(() => {
    if (!profile || !roleId) return null;
    return buildRoadmap(profile, getRoleMap(roleId));
  }, [profile, roleId]);

  useEffect(() => {
    if (status !== "ready" || !profile || !derivedRoadmap) return;
    if (roadmapEqual(profile.roadmap, derivedRoadmap)) return;

    void updateProfile((current) => ({
      ...current,
      roadmap: buildRoadmap(current, getRoleMap(current.targetRoles[0])),
    }));
  }, [derivedRoadmap, profile, status, updateProfile]);

  if (status === "hydrating") return <p role="status">Loading roadmap…</p>;
  if (status === "error") return <p role="alert">{copy[locale].noProfile}</p>;
  if (!profile) return <p className="career-roadmap-empty">{copy[locale].noProfile}</p>;

  return <CareerRoadmap locale={locale} profile={profile} />;
}
