"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { baselineAssessmentBlueprints } from "@/lib/career/assessment-blueprints";
import { getLearningNote } from "@/lib/career/learning-catalog";
import { careerLearningCopy } from "@/lib/career/learning-copy";
import {
  completeLearningModule,
  getLearningProgress,
  getLearningState,
  recordLearningReflection,
  startLearningModule,
} from "@/lib/career/learning-progress";
import {
  learningSourceCatalog,
  resolveLearningSourceId,
} from "@/lib/career/learning-source-catalog";
import type { LearningModule, LearningSource } from "@/lib/career/learning-types";
import type { Locale } from "@/lib/locales";
import { useCareerProfile } from "./career-profile-provider";

function sourceFor(sourceId: string): LearningSource | undefined {
  const canonicalId = resolveLearningSourceId(sourceId);
  return learningSourceCatalog.find((source) => source.id === canonicalId);
}

function reviewedDate(value: string): string {
  return value.slice(0, 10);
}

function PracticeResponse({
  locale,
  module,
  savedResponse,
  disabled,
  onSave,
}: Readonly<{
  locale: Locale;
  module: LearningModule;
  savedResponse?: string;
  disabled: boolean;
  onSave: (response: string) => Promise<void>;
}>) {
  const [response, setResponse] = useState(savedResponse ?? "");
  const [saving, setSaving] = useState(false);
  const copy = careerLearningCopy[locale].reader;
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      setSaving(true);
      void onSave(response).finally(() => setSaving(false));
    }}>
      <label htmlFor={`${module.id}-response`}>{copy.practiceResponse}</label>
      <textarea
        id={`${module.id}-response`}
        value={response}
        onChange={(event) => setResponse(event.target.value)}
        maxLength={4000}
        rows={5}
        disabled={disabled || saving}
        required
      />
      <button type="submit" disabled={disabled || saving || !response.trim() || response.trim() === savedResponse}>
        {savedResponse ? copy.updateResponse : copy.saveResponse}
      </button>
      {savedResponse ? <p role="status">{copy.responseSaved}</p> : null}
    </form>
  );
}

export function CareerLearningNote({
  locale,
  noteId,
}: Readonly<{ locale: Locale; noteId: string }>) {
  const { profile, status, updateProfile } = useCareerProfile();
  const copy = careerLearningCopy[locale];
  const note = getLearningNote(noteId);

  if (!note) {
    return <p role="alert">{copy.reader.notFound}</p>;
  }

  if (status === "hydrating") {
    return (
      <p role="status">
        {locale === "pt-BR" ? "Carregando Core Note…" : "Loading Core Note…"}
      </p>
    );
  }

  const reviewedModules = note.modules.filter(
    (learningModule) => learningModule.reviewStatus === "reviewed",
  );
  const hasDraftCoverage = note.modules.some(
    (learningModule) => learningModule.reviewStatus === "draft",
  );
  const noteState = profile ? getLearningState(profile, note) : "not-started";
  const assessment = baselineAssessmentBlueprints.find(
    (blueprint) => blueprint.competencyId === note.competencyId,
  );

  async function recordPractice(learningModule: LearningModule, response: string) {
    if (!profile) return;
    await updateProfile((current) => {
      const started = startLearningModule(current, noteId, learningModule.id);
      return recordLearningReflection(
        started,
        noteId,
        learningModule.id,
        learningModule.practice.id,
        response,
      );
    });
  }

  async function recordModuleStudied(learningModule: LearningModule) {
    if (!profile) return;
    await updateProfile((current) => {
      const started = startLearningModule(current, noteId, learningModule.id);
      return completeLearningModule(started, noteId, learningModule.id);
    });
  }

  return (
    <article className="career-learning-note">
      <header className="career-learning-note__header">
        <p className="career-lab__eyebrow">{copy.reader.eyebrow}</p>
        <h1>{note.title[locale]}</h1>
        <p>{note.summary[locale]}</p>
        <div className="career-learning-meta">
          <span>
            {note.estimatedMinutes} {copy.reader.minutes}
          </span>
          <span>{copy.states[noteState]}</span>
        </div>
        <div className="career-learning-note__objective">
          <strong>{copy.reader.objective}</strong>
          <p>{note.objective[locale]}</p>
        </div>
      </header>

      {hasDraftCoverage ? (
        <aside className="career-learning-note__notice" role="note">
          {copy.reader.incompleteCoverage}
        </aside>
      ) : null}

      {noteState === "studied" ? (
        <aside className="career-learning-note__notice career-learning-note__notice--proof">
          <h2>{copy.reader.studiedTitle}</h2>
          <p>{copy.reader.proofStillRequired}</p>
          <Link href={`/${locale}/career-lab/${assessment ? `assessments/${assessment.id}` : "evidence"}` as Route}>
            {assessment ? copy.reader.reassess : copy.reader.prove}
          </Link>
        </aside>
      ) : null}

      <nav className="career-learning-note__index" aria-label={copy.reader.moduleIndex}>
        <ol>
          {reviewedModules.map((learningModule) => (
            <li key={learningModule.id}>
              <a href={`#${learningModule.id}`}>{learningModule.title[locale]}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="career-learning-note__modules">
        {reviewedModules.map((learningModule) => {
          const progress = profile ? getLearningProgress(profile, note.id) : undefined;
          const practiceComplete =
            progress?.completedPracticeIds.includes(learningModule.practice.id) ?? false;
          const savedResponse = progress?.practiceReflections?.find(
            (item) => item.practiceId === learningModule.practice.id,
          )?.response;
          const moduleComplete =
            progress?.completedModuleIds.includes(learningModule.id) ?? false;
          const sources = learningModule.sourceIds
            .map(sourceFor)
            .filter((source): source is LearningSource => source !== undefined);

          return (
            <section
              className="career-learning-module"
              id={learningModule.id}
              aria-labelledby={`${learningModule.id}-title`}
              key={learningModule.id}
            >
              <header className="career-learning-module__header">
                <div>
                  <p>{copy.reader.reviewed}</p>
                  <h2 id={`${learningModule.id}-title`}>{learningModule.title[locale]}</h2>
                </div>
                <div className="career-learning-meta">
                  <span>{learningModule.level}</span>
                  <span>
                    {learningModule.estimatedMinutes} {copy.reader.minutes}
                  </span>
                </div>
              </header>

              <div className="career-learning-module__block">
                <h3>{copy.reader.understand}</h3>
                <p>{learningModule.understand[locale]}</p>
              </div>

              {learningModule.example ? (
                <div className="career-learning-module__block">
                  <h3>{copy.reader.example}</h3>
                  <pre>
                    <code data-language={learningModule.example.language}>
                      {learningModule.example.code[locale]}
                    </code>
                  </pre>
                </div>
              ) : null}

              <div className="career-learning-module__block">
                <h3>{copy.reader.commonMistake}</h3>
                <p>{learningModule.commonMistake[locale]}</p>
              </div>

              <div className="career-learning-module__block">
                <h3>{copy.reader.practice}</h3>
                <p>{learningModule.practice.prompt[locale]}</p>
                <PracticeResponse
                  locale={locale}
                  module={learningModule}
                  savedResponse={savedResponse}
                  disabled={!profile}
                  onSave={(response) => recordPractice(learningModule, response)}
                />
                <button
                  type="button"
                  disabled={!profile || !practiceComplete || moduleComplete}
                  onClick={() => void recordModuleStudied(learningModule)}
                >
                  {moduleComplete ? copy.reader.moduleStudied : copy.reader.completeModule}
                </button>
              </div>

              <div className="career-learning-module__block">
                <h3>{copy.reader.consolidationCriteria}</h3>
                <ul>
                  {learningModule.consolidationCriteria[locale].map((criterion) => (
                    <li key={criterion}>{criterion}</li>
                  ))}
                </ul>
              </div>

              <div className="career-learning-module__block">
                <h3>{copy.reader.sources}</h3>
                <ul className="career-learning-source-list" aria-label={copy.reader.sources}>
                  {sources.map((source) => (
                    <li key={source.id}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.title}
                      </a>
                      <span>{source.publisher}</span>
                      <span>
                        {copy.reader.authority}: {source.authority}
                      </span>
                      <time dateTime={source.reviewedAt}>{reviewedDate(source.reviewedAt)}</time>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
