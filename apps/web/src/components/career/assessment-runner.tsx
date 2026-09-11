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
import {
  getAssessmentLearningFeedbackForLocale,
  type AssessmentLearningFeedback,
} from "@/lib/career/assessment-learning-feedback";
import { careerLabCopy } from "@/lib/career/copy";
import type { Locale } from "@/lib/locales";
import { AssessmentResult } from "./assessment-result";
import { useCareerProfile } from "./career-profile-provider";

const learningCopy = {
  en: {
    answer: "Answer",
    correct: "Correct answer",
    incorrect: "Incorrect answer",
    answerFeedback: "Answer feedback",
    reveal: "Reveal answer",
    selectCount: (count: number) => `Select ${count} answers`,
    orderCount: (count: number) => `Select all ${count} steps in the order you believe is correct`,
    chooseExact: (count: number) => `Select exactly ${count} responses before answering.`,
    correctAnswer: "The correct answer is",
    correctAnswers: "The correct answers are",
    correctOrder: "The correct order is",
    whyCorrect: "Why is this the right answer?",
    whyOthers: "Why are the other options wrong?",
    explanation: "Answer explanation",
  },
  "pt-BR": {
    answer: "Responder",
    correct: "Resposta correta",
    incorrect: "Resposta incorreta",
    answerFeedback: "Feedback da resposta",
    reveal: "Revelar resposta",
    selectCount: (count: number) => `Selecione ${count} respostas`,
    orderCount: (count: number) => `Selecione as ${count} etapas na ordem que você considera correta`,
    chooseExact: (count: number) => `Selecione exatamente ${count} respostas antes de responder.`,
    correctAnswer: "A alternativa correta é",
    correctAnswers: "As alternativas corretas são",
    correctOrder: "A ordem correta é",
    whyCorrect: "Por que essa é a resposta certa?",
    whyOthers: "Por que as outras estão erradas?",
    explanation: "Explicação da resposta",
  },
} as const;

function shuffledIds(options: readonly { id: string }[]): readonly string[] {
  const original = options.map((option) => option.id);
  if (original.length < 2) return original;

  const next = [...original];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }

  if (next.every((id, index) => id === original[index])) {
    next.push(next.shift() as string);
  }
  return next;
}

function isCorrectSelection(
  kind: PublicAssessmentBlueprint["challenges"][number]["kind"],
  selected: readonly string[],
  correct: readonly string[],
): boolean {
  if (kind === "structured-ordering") {
    return selected.length === correct.length && selected.every((id, index) => id === correct[index]);
  }
  if (selected.length !== correct.length) return false;
  const selectedSet = new Set(selected);
  return correct.every((id) => selectedSet.has(id));
}

export function AssessmentRunner({
  blueprint,
  onComplete,
  locale = "en",
  learningFeedback = [],
}: Readonly<{
  blueprint: PublicAssessmentBlueprint;
  onComplete: (responses: AssessmentResponses) => void;
  locale?: Locale;
  learningFeedback?: readonly AssessmentLearningFeedback[];
}>) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, readonly string[]>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [optionOrder] = useState<Record<string, readonly string[]>>(() =>
    Object.fromEntries(
      blueprint.challenges.map((candidate) => [candidate.id, shuffledIds(candidate.options)]),
    ),
  );
  const challenge = blueprint.challenges[index];
  const copy = careerLabCopy[locale].assessment;
  const pedagogyCopy = learningCopy[locale];

  const progress = copy.progress(index + 1, blueprint.challenges.length);

  if (!challenge) return null;

  const selected = answers[challenge.id] ?? [];
  const feedback = learningFeedback.find((candidate) => candidate.challengeId === challenge.id);
  const isLearningMode = Boolean(feedback);
  const isSubmitted = submitted[challenge.id] ?? false;
  const isRevealed = revealed[challenge.id] ?? false;
  const requiredCount = feedback?.correctOptionIds.length ?? 1;
  const orderedOptions = (optionOrder[challenge.id] ?? challenge.options.map((option) => option.id))
    .map((id) => challenge.options.find((option) => option.id === id))
    .filter((option): option is (typeof challenge.options)[number] => Boolean(option));
  const inputType = challenge.kind === "multi-select" ? "checkbox" : "radio";
  const submittedCorrect =
    isSubmitted && feedback
      ? isCorrectSelection(challenge.kind, selected, feedback.correctOptionIds)
      : null;

  function selectOption(optionId: string) {
    if (isSubmitted) return;
    setError(null);
    setAnswers((current) => {
      const prior = current[challenge.id] ?? [];
      if (challenge.kind === "multi-select" || challenge.kind === "structured-ordering") {
        if (!prior.includes(optionId) && prior.length >= requiredCount) return current;
        const next = prior.includes(optionId)
          ? prior.filter((id) => id !== optionId)
          : [...prior, optionId];
        return { ...current, [challenge.id]: next };
      }
      return { ...current, [challenge.id]: [optionId] };
    });
  }

  function submitCurrent() {
    const needed = challenge.kind === "single-choice" || challenge.kind === "code-reading-choice" || challenge.kind === "debugging-choice"
      ? 1
      : requiredCount;
    if (selected.length !== needed) {
      setError(needed === 1 ? copy.chooseResponse : pedagogyCopy.chooseExact(needed));
      return;
    }
    setError(null);
    setSubmitted((current) => ({ ...current, [challenge.id]: true }));
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

  function answerState(optionId: string): "correct" | "incorrect" | undefined {
    if (!isRevealed || !feedback) return undefined;
    if (challenge.kind === "structured-ordering") {
      return selected.indexOf(optionId) === feedback.correctOptionIds.indexOf(optionId)
        ? "correct"
        : "incorrect";
    }
    if (feedback.correctOptionIds.includes(optionId)) return "correct";
    if (selected.includes(optionId)) return "incorrect";
    return undefined;
  }

  const correctLabels = feedback?.correctOptionIds.map(
    (id) => challenge.options.find((option) => option.id === id)?.label ?? id,
  ) ?? [];

  return (
    <section className="career-assessment-runner" aria-labelledby="assessment-runner-title">
      <header className="career-assessment-runner__header">
        <p className="career-assessment-runner__progress" role="status" aria-live="polite">
          {progress}
        </p>
        <h1 id="assessment-runner-title">{challenge.prompt}</h1>
      </header>

      {isLearningMode && challenge.kind === "multi-select" ? (
        <p className="career-assessment-runner__instruction">{pedagogyCopy.selectCount(requiredCount)}</p>
      ) : null}
      {isLearningMode && challenge.kind === "structured-ordering" ? (
        <p className="career-assessment-runner__instruction">{pedagogyCopy.orderCount(requiredCount)}</p>
      ) : null}

      {challenge.kind === "structured-ordering" ? (
        <div
          className="career-assessment-runner__options"
          role="group"
          aria-label={copy.arrange}
        >
          {orderedOptions.map((option) => {
            const isSelected = selected.includes(option.id);
            const state = answerState(option.id);
            return (
              <button
                className="career-assessment-runner__option career-assessment-runner__option--ordering"
                data-selected={isSelected}
                data-answer-state={state}
                key={option.id}
                type="button"
                onClick={() => selectOption(option.id)}
                aria-pressed={isSelected}
                disabled={isSubmitted}
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
          {orderedOptions.map((option) => {
            const isSelected = selected.includes(option.id);
            const state = answerState(option.id);
            return (
              <label
                className="career-assessment-runner__option"
                data-selected={isSelected}
                data-answer-state={state}
                key={option.id}
              >
                <input
                  type={inputType}
                  name={"assessment-" + challenge.id}
                  checked={isSelected}
                  onChange={() => selectOption(option.id)}
                  disabled={isSubmitted}
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

      {isSubmitted && feedback ? (
        <section className="career-assessment-learning" aria-label={pedagogyCopy.explanation}>
          <p
            className="career-assessment-learning__feedback"
            role="status"
            aria-label={pedagogyCopy.answerFeedback}
            data-feedback={submittedCorrect ? "correct" : "incorrect"}
          >
            <span aria-hidden="true">{submittedCorrect ? "✓" : "×"}</span>{" "}
            {submittedCorrect ? pedagogyCopy.correct : pedagogyCopy.incorrect}
          </p>

          {!isRevealed ? (
            <div className="career-assessment-learning__veil">
              <div className="career-assessment-learning__blur" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <button
                type="button"
                className="career-assessment-learning__reveal"
                onClick={() => setRevealed((current) => ({ ...current, [challenge.id]: true }))}
              >
                {pedagogyCopy.reveal}
              </button>
            </div>
          ) : (
            <div className="career-assessment-learning__answer">
              <p className="career-assessment-learning__key">
                <strong>
                  {challenge.kind === "structured-ordering"
                    ? pedagogyCopy.correctOrder
                    : correctLabels.length > 1
                      ? pedagogyCopy.correctAnswers
                      : pedagogyCopy.correctAnswer}
                  :
                </strong>{" "}
                {challenge.kind === "structured-ordering"
                  ? correctLabels.map((label, answerIndex) => `${answerIndex + 1}. ${label}`).join(" → ")
                  : correctLabels.join(", ")}
              </p>
              <h2>{pedagogyCopy.whyCorrect}</h2>
              <p>{feedback.rationale}</p>
              {feedback.codeExample ? (
                <pre className="career-assessment-learning__code" data-language={feedback.codeExample.language}>
                  <code>{feedback.codeExample.code}</code>
                </pre>
              ) : null}
              <h3>{pedagogyCopy.whyOthers}</h3>
              <ul className="career-assessment-learning__explanations">
                {challenge.options.map((option) => (
                  <li key={option.id}>
                    <strong>{option.label}:</strong>{" "}
                    {feedback.optionExplanations[option.id]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : null}

      <footer className="career-assessment-runner__actions">
        {index > 0 ? (
          <button
            className="career-assessment-runner__action"
            type="button"
            onClick={() => {
              setError(null);
              setIndex((value) => value - 1);
            }}
          >
            {copy.previous}
          </button>
        ) : <span />}

        {isLearningMode && !isSubmitted ? (
          <button
            className="career-assessment-runner__action career-assessment-runner__action--primary"
            type="button"
            onClick={submitCurrent}
          >
            {pedagogyCopy.answer}
          </button>
        ) : index < blueprint.challenges.length - 1 ? (
          <button
            className="career-assessment-runner__action career-assessment-runner__action--primary"
            type="button"
            onClick={() => {
              setError(null);
              setIndex((value) => value + 1);
            }}
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
        learningFeedback={getAssessmentLearningFeedbackForLocale(blueprint, locale)}
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
