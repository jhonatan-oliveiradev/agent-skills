"use client";

import type { Route } from "next";
import Link from "next/link";
import { competencyDefinitions } from "@/lib/career/competencies";
import {
  getLearningNote,
  getLearningNoteByCompetency,
  learningNoteCatalog,
} from "@/lib/career/learning-catalog";
import { careerLearningCopy } from "@/lib/career/learning-copy";
import { getLearningProgress, getLearningState } from "@/lib/career/learning-progress";
import {
  getMilestoneLearningModules,
  getPrimaryLearningRecommendation,
} from "@/lib/career/learning-recommendations";
import type { LearningModule, LearningNote } from "@/lib/career/learning-types";
import type { CareerProfile } from "@/lib/career/types";
import type { Locale } from "@/lib/locales";
import { useCareerProfile } from "./career-profile-provider";

type StudyState = "not-started" | "in-progress" | "studied";

function moduleState(
  profile: CareerProfile,
  note: LearningNote,
  module: LearningModule,
): StudyState {
  const progress = getLearningProgress(profile, note.id);
  if (!progress) return "not-started";
  if (progress.completedModuleIds.includes(module.id)) return "studied";
  if (
    progress.currentModuleId === module.id ||
    progress.completedPracticeIds.includes(module.practice.id)
  ) {
    return "in-progress";
  }
  return "not-started";
}

function domainLabel(locale: Locale, domain: string): string {
  const copy = careerLearningCopy[locale].domains;
  if (domain === "programming") return copy.programming;
  if (domain === "frontend") return copy.frontend;
  if (domain === "backend") return copy.backend;
  if (domain === "quality") return copy.quality;
  if (domain === "engineering-workflow") return copy["engineering-workflow"];
  return domain;
}

function noteDomain(note: LearningNote): string {
  return (
    competencyDefinitions.find((definition) => definition.id === note.competencyId)?.domain ??
    "other"
  );
}

export function CareerLearningIndex({ locale }: Readonly<{ locale: Locale }>) {
  const { profile, status } = useCareerProfile();
  const copy = careerLearningCopy[locale];

  if (status === "hydrating") {
    return (
      <p role="status">
        {locale === "pt-BR" ? "Carregando aprendizado…" : "Loading learning…"}
      </p>
    );
  }

  const recommendation = profile ? getPrimaryLearningRecommendation(profile) : null;
  const milestoneId = profile?.roadmap.currentFocusMilestoneId ?? null;
  const currentPath =
    profile && milestoneId ? getMilestoneLearningModules(profile, milestoneId) : [];

  const groups = learningNoteCatalog.reduce<Array<{ domain: string; notes: LearningNote[] }>>(
    (result, note) => {
      const domain = noteDomain(note);
      const existing = result.find((group) => group.domain === domain);
      if (existing) {
        existing.notes.push(note);
      } else {
        result.push({ domain, notes: [note] });
      }
      return result;
    },
    [],
  );

  return (
    <article className="career-learning-index">
      <header className="career-learning-index__intro">
        <p className="career-lab__eyebrow">{copy.index.eyebrow}</p>
        <h1>{copy.index.title}</h1>
        <p>{copy.index.intro}</p>
      </header>

      <section
        className="career-learning-section career-learning-section--recommended"
        aria-labelledby="career-learning-recommended"
      >
        <h2 id="career-learning-recommended">{copy.index.recommendedNow}</h2>
        {!profile ? <p>{copy.index.noPersonalizedRecommendation}</p> : null}
        {profile && !recommendation ? <p>{copy.index.noRecommendation}</p> : null}
        {profile && recommendation?.kind === "study" ? (
          (() => {
            const note = getLearningNote(recommendation.noteId);
            const module = note?.modules.find((item) => item.id === recommendation.moduleId);
            if (!note || !module) return <p>{copy.index.noRecommendation}</p>;
            const state = moduleState(profile, note, module);
            return (
              <div className="career-learning-recommendation">
                <p className="career-learning-recommendation__reason">
                  {copy.reasons[recommendation.reason]}
                </p>
                <h3>{module.title[locale]}</h3>
                <p>{note.title[locale]}</p>
                <div className="career-learning-meta">
                  <span>
                    {module.estimatedMinutes} {copy.index.minutes}
                  </span>
                  <span>{copy.states[state]}</span>
                </div>
                <Link
                  href={`/${locale}/career-lab/learning/${note.id}#${module.id}` as Route}
                >
                  {state === "not-started" ? copy.index.openNote : copy.index.continueStudy}
                </Link>
              </div>
            );
          })()
        ) : null}
        {profile && recommendation?.kind === "prove" ? (
          <div className="career-learning-recommendation">
            <p className="career-learning-recommendation__reason">
              {copy.reasons[recommendation.reason]}
            </p>
            <h3>{getLearningNoteByCompetency(recommendation.competencyId)?.title[locale]}</h3>
            <p>{copy.states.studied}</p>
            <Link
              href={
                `/${locale}/career-lab/${
                  recommendation.destination === "assessment" ? "assessments" : "evidence"
                }` as Route
              }
            >
              {copy.index.prove}
            </Link>
          </div>
        ) : null}
      </section>

      <section
        className="career-learning-section"
        aria-labelledby="career-learning-current-path"
      >
        <h2 id="career-learning-current-path">{copy.index.currentPath}</h2>
        {currentPath.length === 0 ? <p>{copy.index.noCurrentPath}</p> : null}
        {currentPath.length > 0 ? (
          <div className="career-learning-grid">
            {currentPath.map(({ note, module, state }) => (
              <article className="career-learning-card" key={`${note.id}:${module.id}`}>
                <p>{copy.states[state]}</p>
                <h3>{module.title[locale]}</h3>
                <p>{note.title[locale]}</p>
                <span>
                  {module.estimatedMinutes} {copy.index.minutes}
                </span>
                <Link href={`/${locale}/career-lab/learning/${note.id}#${module.id}` as Route}>
                  {state === "not-started" ? copy.index.openNote : copy.index.continueStudy}
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section
        className="career-learning-section"
        aria-labelledby="career-learning-explore"
      >
        <h2 id="career-learning-explore">{copy.index.explore}</h2>
        {!profile ? <p>{copy.index.noProfile}</p> : null}
        <div className="career-learning-domains">
          {groups.map((group) => (
            <div className="career-learning-domain" key={group.domain}>
              <h3>{domainLabel(locale, group.domain)}</h3>
              <div className="career-learning-grid">
                {group.notes.map((note) => {
                  const state = profile ? getLearningState(profile, note) : "not-started";
                  return (
                    <article className="career-learning-card" key={note.id}>
                      <p>{copy.states[state]}</p>
                      <h4>
                        <Link href={`/${locale}/career-lab/learning/${note.id}` as Route}>
                          {note.title[locale]}
                        </Link>
                      </h4>
                      <p>{note.summary[locale]}</p>
                      <span>
                        {note.estimatedMinutes} {copy.index.minutes}
                      </span>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
