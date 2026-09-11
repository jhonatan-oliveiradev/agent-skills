import type { LearningSource } from "./learning-types";

export const LEARNING_REVIEW_WINDOWS_DAYS = {
  high: 90,
  medium: 180,
  low: 365,
} as const;

const reviewedAt = "2026-09-11T00:00:00.000Z";

const learningSourceIdAliases = {
  "typescript-handbook-narrowing": "ts-handbook-narrowing",
  "typescript-handbook-type-manipulation": "ts-handbook-type-manipulation",
  "git-commit-reference": "git-commit-docs",
  "aria-authoring-practices": "wai-aria-apg",
} as const;

export function resolveLearningSourceId(sourceId: string): string {
  return (
    learningSourceIdAliases[sourceId as keyof typeof learningSourceIdAliases] ?? sourceId
  );
}

export const learningSourceCatalog = [
  {
    id: "mdn-async-function",
    title: "async function",
    publisher: "MDN Web Docs",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
    authority: "primary",
    volatility: "medium",
    reviewedAt,
    supportsCriterionIds: [
      "programming-javascript.foundation",
      "programming-javascript.developing",
      "programming-javascript.proficient",
      "programming-javascript.advanced",
    ],
  },
  {
    id: "mdn-promise",
    title: "Promise",
    publisher: "MDN Web Docs",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
    authority: "primary",
    volatility: "medium",
    reviewedAt,
    supportsCriterionIds: [
      "programming-javascript.foundation",
      "programming-javascript.developing",
      "programming-javascript.proficient",
      "programming-javascript.advanced",
    ],
  },
  {
    id: "ts-handbook-narrowing",
    title: "Narrowing",
    publisher: "TypeScript",
    url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
    authority: "primary",
    volatility: "medium",
    reviewedAt,
    supportsCriterionIds: [
      "programming-typescript.foundation",
      "programming-typescript.developing",
      "programming-typescript.proficient",
      "programming-typescript.advanced",
    ],
  },
  {
    id: "ts-handbook-type-manipulation",
    title: "Creating Types from Types",
    publisher: "TypeScript",
    url: "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
    authority: "primary",
    volatility: "medium",
    reviewedAt,
    supportsCriterionIds: [
      "programming-typescript.foundation",
      "programming-typescript.developing",
      "programming-typescript.proficient",
      "programming-typescript.advanced",
    ],
  },
  {
    id: "testing-library-guiding-principles",
    title: "Guiding Principles",
    publisher: "Testing Library",
    url: "https://testing-library.com/docs/guiding-principles/",
    authority: "recognized-institutional",
    volatility: "medium",
    reviewedAt,
    supportsCriterionIds: [
      "testing-behavior.foundation",
      "testing-behavior.developing",
      "testing-behavior.proficient",
      "testing-behavior.advanced",
    ],
  },
  {
    id: "rfc-9110-http-semantics",
    title: "RFC 9110: HTTP Semantics",
    publisher: "RFC Editor",
    url: "https://www.rfc-editor.org/rfc/rfc9110.html",
    authority: "primary",
    volatility: "low",
    reviewedAt,
    supportsCriterionIds: [
      "http-api-engineering.foundation",
      "http-api-engineering.developing",
      "http-api-engineering.proficient",
      "http-api-engineering.advanced",
    ],
  },
  {
    id: "git-commit-docs",
    title: "git-commit",
    publisher: "Git",
    url: "https://git-scm.com/docs/git-commit",
    authority: "primary",
    volatility: "low",
    reviewedAt,
    supportsCriterionIds: [
      "git-collaboration.foundation",
      "git-collaboration.developing",
      "git-collaboration.proficient",
      "git-collaboration.advanced",
    ],
  },
  {
    id: "pro-git-distributed-workflows",
    title: "Distributed Git - Distributed Workflows",
    publisher: "Git",
    url: "https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows",
    authority: "primary",
    volatility: "low",
    reviewedAt,
    supportsCriterionIds: [
      "git-collaboration.foundation",
      "git-collaboration.developing",
      "git-collaboration.proficient",
      "git-collaboration.advanced",
    ],
  },
  {
    id: "wcag-22",
    title: "Web Content Accessibility Guidelines (WCAG) 2.2",
    publisher: "W3C",
    url: "https://www.w3.org/TR/WCAG22/",
    authority: "primary",
    volatility: "low",
    reviewedAt,
    supportsCriterionIds: [
      "web-accessibility.foundation",
      "web-accessibility.developing",
      "web-accessibility.proficient",
      "web-accessibility.advanced",
    ],
  },
  {
    id: "wai-aria-apg",
    title: "ARIA Authoring Practices Guide",
    publisher: "W3C Web Accessibility Initiative",
    url: "https://www.w3.org/WAI/ARIA/apg/",
    authority: "primary",
    volatility: "medium",
    reviewedAt,
    supportsCriterionIds: [
      "web-accessibility.foundation",
      "web-accessibility.developing",
      "web-accessibility.proficient",
      "web-accessibility.advanced",
    ],
  },
] as const satisfies readonly LearningSource[];
