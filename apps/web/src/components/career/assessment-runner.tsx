"use client";

import { useMemo, useState } from "react";
import {
  evaluateAssessment,
  type AssessmentResponses,
  type PublicAssessmentBlueprint,
} from "@/lib/career/assessment";
import { applyCareerAssessmentResult } from "@/lib/career/assessment-application";
import {
  getAssessmentBlueprint,
  getPublicAssessmentBlueprintForLocale,
} from "@/lib/career/assessment-blueprints";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";
import { AssessmentResult } from "./assessment-result";
import { useCareerProfile } from "./career-profile-provider";

export function AssessmentRunner({
  blueprint,
  onComplete,
  locale = "en",
}: Readonly<{
  blueprint: PublicAssessmentBlueprint;
  onComplete: (responses: AssessmentResponses) => void;
  locale?: Locale;
}>) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, readonly string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const challenge = blueprint.challenges[index];
  const copy = careerLabCopy[locale].assessment;

  const progress = copy.progress(index + 1, blueprint.challenges.length);

  function selectOption(optionId: string) {
    if (!challenge) return;
    setError(null);
    setAnswers((current) => {
      const prior = current[challenge.id] ?? [];
      if (challenge.kind === "multi-select" || challenge.kind === "structured-ordering") {
        const next = prior.includes(optionId)
          ? prior.filter((id) => id !== optionId)
          : [...prior, optionId];
        return { ...current, [challenge.id]: next };
      }
      return { ...current, [challenge.id]: [optionId] };
    });
  }

  function finish() {
    const missing = blueprint.challenges.find(
      (candidate) => (answers[candidate.id] ?? []).length === 0,
    );
    if (missing) {
      setError(copy.chooseResponse);
      return;
    }
    onComplete({
      blueprintId: blueprint.id,
      blueprintVersion: blueprint.version,
      completedAt: new Date().toISOString(),
      answers,
    });
  }

  if (!challenge) return null;
  const selected = answers[challenge.id] ?? [];
  const inputType = challenge.kind === "multi-select" ? "checkbox" : "radio";

  return (
    <section className="career-assessment-runner" aria-labelledby="assessment-runner-title">
      <header className="career-assessment-runner__header">
        <p className="career-assessment-runner__progress" role="status" aria-live="polite">
          {progress}
        </p>
        <h1 id="assessment-runner-title">{challenge.prompt}</h1>
      </header>

      {challenge.kind === "structured-ordering" ? (
        <div
          className="career-assessment-runner__options"
          role="group"
          aria-label={copy.arrange}
        >
          {challenge.options.map((option) => {
            const isSelected = selected.includes(option.id);
            return (
              <button
                className="career-assessment-runner__option career-assessment-runner__option--ordering"
                data-selected={isSelected}
                key={option.id}
                type="button"
                onClick={() => selectOption(option.id)}
                aria-pressed={isSelected}
              >
                <span className="career-assessment-runner__option-copy">
                  {isSelected
                    ? (selected.indexOf(option.id) + 1) + ". " + option.label
                    : option.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <fieldset className="career-assessment-runner__options">
          <legend className="sr-only">{challenge.prompt}</legend>
          {challenge.options.map((option) => {
            const isSelected = selected.includes(option.id);
            return (
              <label
                className="career-assessment-runner__option"
                data-selected={isSelected}
                key={option.id}
              >
                <input
                  type={inputType}
                  name={"assessment-" + challenge.id}
                  checked={isSelected}
                  onChange={() => selectOption(option.id)}
                />
                <span className="career-assessment-runner__option-copy">{option.label}</span>
              </label>
            );
          })}
        </fieldset>
      )}

      {error ? (
        <p className="career-assessment-runner__error" role="alert">
          {error}
        </p>
      ) : null}

      <footer className="career-assessment-runner__actions">
        {index > 0 ? (
          <button
            className="career-assessment-runner__action"
            type="button"
            onClick={() => setIndex((value) => value - 1)}
          >
            {copy.previous}
          </button>
        ) : <span />}
        {index < blueprint.challenges.length - 1 ? (
          <button
            className="career-assessment-runner__action career-assessment-runner__action--primary"
            type="button"
            onClick={() => setIndex((value) => value + 1)}
          >
            {copy.next}
          </button>
        ) : (
          <button
            className="career-assessment-runner__action career-assessment-runner__action--primary"
            type="button"
            onClick={finish}
          >
            {copy.complete}
          </button>
        )}
      </footer>
    </section>
  );
}

export function AssessmentDetailSurface({
  locale,
  blueprintId,
}: Readonly<{ locale: Locale; blueprintId: string }>) {
  const { profile, updateProfile } = useCareerProfile();
  const [result, setResult] = useState<ReturnType<typeof evaluateAssessment> | null>(null);
  const blueprint = useMemo(() => getAssessmentBlueprint(blueprintId), [blueprintId]);
  const copy = careerLabCopy[locale].assessment;

  if (!blueprint) return <p role="alert">{copy.notFound}</p>;
  if (result) return <AssessmentResult result={result} locale={locale} />;

  return (
    <div data-locale={locale}>
      <AssessmentRunner
        locale={locale}
        blueprint={getPublicAssessmentBlueprintForLocale(blueprint, locale)}
        onComplete={(responses) => {
          const next = evaluateAssessment(blueprint, responses);
          setResult(next);
          if (profile) {
            void updateProfile((current) => applyCareerAssessmentResult(current, next));
          }
        }}
      />
    </div>
  );
}
