"use client";

import { useEffect, useMemo } from "react";
import {
  completeLearningUnit,
  getLearningUnitsForMilestone,
  isLearningUnitCompleted,
} from "@/lib/career/learning";
import {
  buildRoadmap,
  getRoadmapMilestoneViews,
  type RoadmapMilestoneView,
} from "@/lib/career/roadmap-engine";
import { getRoleMap } from "@/lib/career/role-maps";
import type { CareerProfile, MilestoneStatus, RoadmapState } from "@/lib/career/types";
import type { Locale } from "@/lib/locales";
import { useCareerProfile } from "./career-profile-provider";
import { LearningUnit } from "./learning-unit";

const copy = {
  en: {
    now: "NOW",
    next: "NEXT",
    map: "MAP",
    currentFocus: "CURRENT FOCUS",
    whyNow: "Why now",
    nextTitle: "Next available milestones",
    noNext: "No additional milestone is available until the current dependency is cleared.",
    capabilityGap: "Capability gap",
    evidenceGate: "Evidence gate",
    effort: "Estimated effort",
    noProfile: "Create a Career Profile before generating an adaptive roadmap.",
    noFocus: "All currently applicable milestones are complete.",
    loading: "Loading roadmap…",
    milestoneCount: (count: number) => `${count.toString().padStart(2, "0")} milestones`,
    priorityReason: (capabilityCount: number, evidenceCount: number) =>
      `This milestone is the highest-priority dependency for the target role with ${capabilityCount} capability gap${capabilityCount === 1 ? "" : "s"} and ${evidenceCount} evidence gate${evidenceCount === 1 ? "" : "s"} still open.`,
    lockedReason: (prerequisites: readonly string[]) =>
      `Dependency gate remains closed${prerequisites.length > 0 ? ` behind ${prerequisites.join(", ")}` : ""}.`,
    availableReason: "Its dependency gates are satisfied, so it is a valid next candidate for the target role.",
    assessmentReason: "The capability target is met; stronger evidence is now required before completion.",
    completedReason: "Required capability and evidence gates are both satisfied, so this milestone is complete.",
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
    currentFocus: "FOCO ATUAL",
    whyNow: "Por que agora",
    nextTitle: "Próximos marcos disponíveis",
    noNext: "Nenhum marco adicional fica disponível até que a dependência atual seja concluída.",
    capabilityGap: "Lacuna de capacidade",
    evidenceGate: "Gate de evidência",
    effort: "Esforço estimado",
    noProfile: "Crie um Career Profile antes de gerar um roadmap adaptativo.",
    noFocus: "Todos os marcos atualmente aplicáveis estão concluídos.",
    loading: "Carregando roadmap…",
    milestoneCount: (count: number) => `${count.toString().padStart(2, "0")} marcos`,
    priorityReason: (capabilityCount: number, evidenceCount: number) =>
      `Este marco é a dependência de maior prioridade para o papel-alvo, com ${capabilityCount} lacuna${capabilityCount === 1 ? "" : "s"} de capacidade e ${evidenceCount} gate${evidenceCount === 1 ? "" : "s"} de evidência ainda aberto${evidenceCount === 1 ? "" : "s"}.`,
    lockedReason: (prerequisites: readonly string[]) =>
      `O gate de dependência continua fechado${prerequisites.length > 0 ? ` atrás de ${prerequisites.join(", ")}` : ""}.`,
    availableReason: "Os gates de dependência estão satisfeitos, então este é um candidato válido para o próximo foco.",
    assessmentReason: "O alvo de capacidade foi atingido; agora é necessária evidência mais forte antes da conclusão.",
    completedReason: "Os gates obrigatórios de capacidade e evidência estão satisfeitos, então este marco está concluído.",
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

function milestoneReason(locale: Locale, milestone: RoadmapMilestoneView): string {
  const localized = copy[locale];
  switch (milestone.status) {
    case "locked":
      return localized.lockedReason(milestone.prerequisites);
    case "available":
      return localized.availableReason;
    case "in-progress":
      return localized.priorityReason(
        milestone.priorityFactors.capabilityGapCount,
        milestone.priorityFactors.evidenceGapCount,
      );
    case "ready-for-assessment":
      return localized.assessmentReason;
    case "completed":
      return localized.completedReason;
  }
}

function MilestoneDetails({
  locale,
  milestone,
}: Readonly<{ locale: Locale; milestone: RoadmapMilestoneView }>) {
  const localized = copy[locale];
  return (
    <details className="career-roadmap-details">
      <summary>{localized.whyNow}</summary>
      <p>{milestoneReason(locale, milestone)}</p>
      <dl>
        <div>
          <dt>{localized.capabilityGap}</dt>
          <dd>{milestone.capabilityGaps.length > 0 ? milestone.capabilityGaps.join(", ") : "—"}</dd>
        </div>
        <div>
          <dt>{localized.evidenceGate}</dt>
          <dd>
            {milestone.evidenceRequirements.length > 0
              ? milestone.evidenceRequirements
                  .map((requirement) => `${requirement.competencyId}: ${requirement.minimumClass}`)
                  .join(" · ")
              : "—"}
          </dd>
        </div>
        <div>
          <dt>{localized.effort}</dt>
          <dd>{formatEffort(milestone)}</dd>
        </div>
      </dl>
    </details>
  );
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
      <MilestoneDetails locale={locale} milestone={milestone} />
    </article>
  );
}

export function CareerRoadmap({
  locale,
  profile,
  onCompleteLearningUnit,
}: Readonly<{
  locale: Locale;
  profile: CareerProfile;
  onCompleteLearningUnit?: (milestoneId: string, unitId: string) => void;
}>) {
  const localized = copy[locale];
  const roleId = profile.targetRoles[0];
  if (!roleId) return <p role="alert">{localized.noProfile}</p>;

  const roleMap = getRoleMap(roleId);
  const roadmap = buildRoadmap(profile, roleMap);
  const milestones = getRoadmapMilestoneViews(profile, roleMap, roadmap);
  const current = milestones.find((milestone) => milestone.id === roadmap.currentFocusMilestoneId) ?? null;
  const currentLearningUnit = current ? getLearningUnitsForMilestone(current.id)[0] ?? null : null;
  const nextMilestones = milestones
    .filter(
      (milestone) =>
        milestone.id !== current?.id &&
        (milestone.status === "available" || milestone.status === "ready-for-assessment"),
    )
    .slice(0, 3);

  return (
    <div className="career-roadmap" data-locale={locale}>
      <section className="career-roadmap-now" role="region" aria-label={localized.now}>
        <header className="career-roadmap-section-heading">
          <p>{localized.now}</p>
          {current ? <span className="career-roadmap-card__status">{statusLabel(locale, current.status)}</span> : null}
        </header>
        {current ? (
          <>
            <div className="career-roadmap-now__grid">
              <div className="career-roadmap-now__identity">
                <p className="career-roadmap-now__index">01 / {localized.currentFocus}</p>
                <h1>{current.title[locale]}</h1>
                <p>{current.summary[locale]}</p>
              </div>
              <div className="career-roadmap-now__rationale">
                <h2>{localized.whyNow}</h2>
                <p>{milestoneReason(locale, current)}</p>
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
            {currentLearningUnit ? (
              <LearningUnit
                unit={currentLearningUnit}
                locale={locale}
                completed={isLearningUnitCompleted(profile, current.id, currentLearningUnit.id)}
                onComplete={
                  onCompleteLearningUnit
                    ? (unitId) => onCompleteLearningUnit(current.id, unitId)
                    : undefined
                }
              />
            ) : null}
          </>
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
          <strong>{localized.milestoneCount(milestones.length)}</strong>
        </header>
        <div className="career-roadmap-map__sequence">
          {milestones.map((milestone, index) => (
            <article
              key={milestone.id}
              className="career-roadmap-map__milestone"
              data-status={milestone.status}
            >
              <span className="career-roadmap-map__number">{String(index + 1).padStart(2, "0")}</span>
              <div className="career-roadmap-map__body">
                <h3>{milestone.title[locale]}</h3>
                <p>{milestone.summary[locale]}</p>
                <MilestoneDetails locale={locale} milestone={milestone} />
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

    void updateProfile((current) => {
      const currentRoleId = current.targetRoles[0];
      if (!currentRoleId) return current;
      return {
        ...current,
        roadmap: buildRoadmap(current, getRoleMap(currentRoleId)),
      };
    });
  }, [derivedRoadmap, profile, status, updateProfile]);

  if (status === "hydrating") return <p role="status">{copy[locale].loading}</p>;
  if (status === "error") return <p role="alert">{copy[locale].noProfile}</p>;
  if (!profile) return <p className="career-roadmap-empty">{copy[locale].noProfile}</p>;

  return (
    <CareerRoadmap
      locale={locale}
      profile={profile}
      onCompleteLearningUnit={(milestoneId, unitId) => {
        void updateProfile((current) => completeLearningUnit(current, milestoneId, unitId));
      }}
    />
  );
}
