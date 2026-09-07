"use client";

import { useMemo, useState } from "react";
import {
  applyAssessmentResult,
  evaluateAssessment,
  type AssessmentResponses,
  type PublicAssessmentBlueprint,
} from "@/lib/career/assessment";
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
      <p role="status" aria-live="polite">{progress}</p>
      <h1 id="assessment-runner-title">{challenge.prompt}</h1>
      {challenge.kind === "structured-ordering" ? (
        <div role="group" aria-label={copy.arrange}>
          {challenge.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => selectOption(option.id)}
              aria-pressed={selected.includes(option.id)}
            >
              {selected.includes(option.id)
                ? (selected.indexOf(option.id) + 1) + ". " + option.label
                : option.label}
            </button>
          ))}
        </div>
      ) : (
        <fieldset>
          <legend className="sr-only">{challenge.prompt}</legend>
          {challenge.options.map((option) => (
            <label key={option.id}>
              <input
                type={inputType}
                name={"assessment-" + challenge.id}
                checked={selected.includes(option.id)}
                onChange={() => selectOption(option.id)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
      )}
      {error ? <p role="alert">{error}</p> : null}
      <footer>
        {index > 0 ? (
          <button type="button" onClick={() => setIndex((value) => value - 1)}>
            {copy.previous}
          </button>
        ) : <span />}
        {index < blueprint.challenges.length - 1 ? (
          <button type="button" onClick={() => setIndex((value) => value + 1)}>
            {copy.next}
          </button>
        ) : (
          <button type="button" onClick={finish}>{copy.complete}</button>
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
            void updateProfile((current) => applyAssessmentResult(current, next));
          }
        }}
      />
    </div>
  );
}
