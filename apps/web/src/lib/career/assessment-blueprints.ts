import type { AssessmentBlueprint } from "./assessment";
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

export function getAssessmentBlueprint(id: string): AssessmentBlueprint | null {
  return baselineAssessmentBlueprints.find((blueprint) => blueprint.id === id) ?? null;
}
