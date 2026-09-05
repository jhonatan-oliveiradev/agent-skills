"use client";

import { useMemo, useState } from "react";
import {
  applyAssessmentResult,
  evaluateAssessment,
  toPublicAssessmentBlueprint,
  type AssessmentResponses,
  type PublicAssessmentBlueprint,
} from "@/lib/career/assessment";
import type { Locale } from "@/lib/locales";
import { AssessmentResult } from "./assessment-result";
import { useCareerProfile } from "./career-profile-provider";
import { getAssessmentBlueprint } from "@/lib/career/assessment-blueprints";

export function AssessmentRunner({
  blueprint,
  onComplete,
}: Readonly<{
  blueprint: PublicAssessmentBlueprint;
  onComplete: (responses: AssessmentResponses) => void;
}>) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, readonly string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const challenge = blueprint.challenges[index];

  const progress = "Challenge " + (index + 1) + " of " + blueprint.challenges.length;

  function selectOption(optionId: string) {
    if (!challenge) return;
    setError(null);
    setAnswers((current) => {
      const prior = current[challenge.id] ?? [];
      if (challenge.kind === "multi-select") {
        const next = prior.includes(optionId)
          ? prior.filter((id) => id !== optionId)
          : [...prior, optionId];
        return { ...current, [challenge.id]: next };
      }
      if (challenge.kind === "structured-ordering") {
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
      setError("Choose a response before completing the assessment.");
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
        <div aria-label="Arrange the steps in order">
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
            Previous challenge
          </button>
        ) : <span />}
        {index < blueprint.challenges.length - 1 ? (
          <button type="button" onClick={() => setIndex((value) => value + 1)}>
            Next challenge
          </button>
        ) : (
          <button type="button" onClick={finish}>Complete assessment</button>
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

  if (!blueprint) return <p role="alert">Assessment not found.</p>;
  if (result) return <AssessmentResult result={result} />;

  return (
    <div data-locale={locale}>
      <AssessmentRunner
        blueprint={toPublicAssessmentBlueprint(blueprint)}
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
