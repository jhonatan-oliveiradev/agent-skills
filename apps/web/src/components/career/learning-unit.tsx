"use client";

import type { LearningUnit as LearningUnitDefinition, PracticePromptKind } from "@/lib/career/learning";
import type { Locale } from "@/lib/locales";

const copy = {
  en: {
    eyebrow: "Supporting practice",
    objective: "Objective",
    mentalModel: "Mental model",
    estimated: (minutes: number) => `${minutes} min`,
    complete: "Mark practice complete",
    completed: "Practice logged",
    note: "Learning progress does not count as proficiency evidence. Demonstrate the capability through assessment or portfolio evidence.",
    kinds: {
      example: "Minimal example",
      problem: "Problem",
      practice: "Practice",
      checkpoint: "Checkpoint",
      handoff: "Next evidence",
    },
  },
  "pt-BR": {
    eyebrow: "Prática de apoio",
    objective: "Objetivo",
    mentalModel: "Modelo mental",
    estimated: (minutes: number) => `${minutes} min`,
    complete: "Marcar prática como concluída",
    completed: "Prática registrada",
    note: "Progresso de estudo não conta como evidência de proficiência. Demonstre a capacidade por avaliação ou evidência de portfólio.",
    kinds: {
      example: "Exemplo mínimo",
      problem: "Problema",
      practice: "Prática",
      checkpoint: "Checkpoint",
      handoff: "Próxima evidência",
    },
  },
} as const;

export function LearningUnit({
  unit,
  locale,
  completed,
  onComplete,
}: Readonly<{
  unit: LearningUnitDefinition;
  locale: Locale;
  completed: boolean;
  onComplete?: (unitId: string) => void;
}>) {
  const localized = copy[locale];

  return (
    <article className="career-learning-unit" data-learning-unit={unit.id}>
      <header className="career-learning-unit__header">
        <div>
          <p className="career-lab__eyebrow">{localized.eyebrow}</p>
          <h2>{unit.title[locale]}</h2>
        </div>
        <span>{localized.estimated(unit.estimatedMinutes)}</span>
      </header>

      <dl className="career-learning-unit__model">
        <div>
          <dt>{localized.objective}</dt>
          <dd>{unit.objective[locale]}</dd>
        </div>
        <div>
          <dt>{localized.mentalModel}</dt>
          <dd>{unit.explanation[locale]}</dd>
        </div>
      </dl>

      <ol className="career-learning-unit__practice">
        {unit.practice.map((prompt) => (
          <li key={prompt.id}>
            <span>{localized.kinds[prompt.kind as PracticePromptKind]}</span>
            <p>{prompt.prompt[locale]}</p>
          </li>
        ))}
      </ol>

      <footer className="career-learning-unit__footer">
        <p>{localized.note}</p>
        {onComplete ? (
          <button type="button" disabled={completed} onClick={() => onComplete(unit.id)}>
            {completed ? localized.completed : localized.complete}
          </button>
        ) : (
          <span role="status">{completed ? localized.completed : null}</span>
        )}
      </footer>
    </article>
  );
}
