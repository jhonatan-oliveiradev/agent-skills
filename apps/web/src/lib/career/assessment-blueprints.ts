import type { Locale } from "@/lib/locales";
import {
  toPublicAssessmentBlueprint,
  type AssessmentBlueprint,
  type PublicAssessmentBlueprint,
} from "./assessment";
export { validateAssessmentBlueprint } from "./assessment";

function baseline(
  id: string,
  competencyId: AssessmentBlueprint["competencyId"],
  prompt: string,
  correct: string,
  incorrect: string,
  criterionIds: readonly string[],
): AssessmentBlueprint {
  return {
    id,
    version: "1",
    competencyId,
    targetLevel: "developing",
    dimensions: [{ id: "reasoning", label: "Baseline reasoning", required: true }],
    challenges: [{
      id: id + "-question",
      dimensionId: "reasoning",
      kind: "code-reading-choice",
      prompt,
      options: [
        { id: "sound", label: correct },
        { id: "unsound", label: incorrect },
      ],
      correctOptionIds: ["sound"],
      evidenceClass: "E2",
      demonstratedLevel: "developing",
      criterionIds,
    }],
    gates: [],
  };
}

export const baselineAssessmentBlueprints = [
  baseline(
    "baseline-javascript",
    "programming-javascript",
    "Which boundary keeps interaction state local?",
    "The component that owns the interaction",
    "A global mutable variable",
    ["programming-javascript.foundation", "programming-javascript.developing"],
  ),
  baseline(
    "baseline-typescript",
    "programming-typescript",
    "Which construct makes impossible state combinations explicit?",
    "A discriminated union",
    "A non-null assertion",
    ["programming-typescript.foundation", "programming-typescript.developing"],
  ),
  baseline(
    "baseline-web-platform",
    "web-platform-foundations",
    "Which HTML primitive gives an action native keyboard semantics?",
    "A button element",
    "A clickable div",
    ["web-platform-foundations.foundation", "web-platform-foundations.developing"],
  ),
  baseline(
    "baseline-testing",
    "testing-behavior",
    "Which assertion best protects observable behavior?",
    "Assert the public outcome",
    "Assert a private helper call",
    ["testing-behavior.foundation", "testing-behavior.developing"],
  ),
  baseline(
    "baseline-http-api",
    "http-api-engineering",
    "Which response describes a malformed client request?",
    "A clear 400 response",
    "A successful 200 response",
    ["http-api-engineering.foundation", "http-api-engineering.developing"],
  ),
  baseline(
    "baseline-git",
    "git-collaboration",
    "What makes a change easier to review?",
    "A focused, coherent commit",
    "An unrelated bulk change",
    ["git-collaboration.foundation", "git-collaboration.developing"],
  ),
] as const satisfies readonly AssessmentBlueprint[];

type AssessmentPresentation = Readonly<{
  title: string;
  dimensionLabel: string;
  prompt: string;
  correct: string;
  incorrect: string;
}>;

const englishTitles: Readonly<Record<string, string>> = {
  "baseline-javascript": "JavaScript",
  "baseline-typescript": "TypeScript",
  "baseline-web-platform": "Web platform",
  "baseline-testing": "Testing behavior",
  "baseline-http-api": "HTTP API",
  "baseline-git": "Git collaboration",
};

const portuguesePresentations: Readonly<Record<string, AssessmentPresentation>> = {
  "baseline-javascript": {
    title: "JavaScript",
    dimensionLabel: "Raciocínio de baseline",
    prompt: "Qual limite mantém o estado da interação local?",
    correct: "O componente que controla a interação",
    incorrect: "Uma variável global mutável",
  },
  "baseline-typescript": {
    title: "TypeScript",
    dimensionLabel: "Raciocínio de baseline",
    prompt: "Qual construção torna explícitas as combinações de estado impossíveis?",
    correct: "Uma união discriminada",
    incorrect: "Uma asserção non-null",
  },
  "baseline-web-platform": {
    title: "Plataforma web",
    dimensionLabel: "Raciocínio de baseline",
    prompt: "Qual primitiva HTML oferece semântica nativa de teclado para uma ação?",
    correct: "Um elemento button",
    incorrect: "Uma div clicável",
  },
  "baseline-testing": {
    title: "Comportamento de testes",
    dimensionLabel: "Raciocínio de baseline",
    prompt: "Qual asserção protege melhor o comportamento observável?",
    correct: "Validar o resultado público",
    incorrect: "Validar uma chamada de helper privado",
  },
  "baseline-http-api": {
    title: "HTTP API",
    dimensionLabel: "Raciocínio de baseline",
    prompt: "Qual resposta descreve uma requisição de cliente malformada?",
    correct: "Uma resposta 400 clara",
    incorrect: "Uma resposta 200 de sucesso",
  },
  "baseline-git": {
    title: "Colaboração com Git",
    dimensionLabel: "Raciocínio de baseline",
    prompt: "O que torna uma mudança mais fácil de revisar?",
    correct: "Um commit focado e coerente",
    incorrect: "Uma alteração em massa sem relação",
  },
};

export function getAssessmentBlueprint(id: string): AssessmentBlueprint | null {
  return baselineAssessmentBlueprints.find((blueprint) => blueprint.id === id) ?? null;
}

export function getAssessmentPresentation(
  blueprint: AssessmentBlueprint,
  locale: Locale,
): Readonly<{ title: string; dimensionLabel: string }> {
  if (locale === "pt-BR") {
    const localized = portuguesePresentations[blueprint.id];
    if (localized) return localized;
  }
  return {
    title: englishTitles[blueprint.id] ?? blueprint.competencyId,
    dimensionLabel: blueprint.dimensions[0]?.label ?? blueprint.competencyId,
  };
}

export function getPublicAssessmentBlueprintForLocale(
  blueprint: AssessmentBlueprint,
  locale: Locale,
): PublicAssessmentBlueprint {
  const publicBlueprint = toPublicAssessmentBlueprint(blueprint);
  if (locale !== "pt-BR") return publicBlueprint;
  const localized = portuguesePresentations[blueprint.id];
  if (!localized) return publicBlueprint;

  return {
    ...publicBlueprint,
    dimensions: publicBlueprint.dimensions.map((dimension) =>
      dimension.id === "reasoning"
        ? { ...dimension, label: localized.dimensionLabel }
        : dimension,
    ),
    challenges: publicBlueprint.challenges.map((challenge) => ({
      ...challenge,
      prompt: localized.prompt,
      options: challenge.options.map((option) => ({
        ...option,
        label: option.id === "sound"
          ? localized.correct
          : option.id === "unsound"
            ? localized.incorrect
            : option.label,
      })),
    })),
  };
}
