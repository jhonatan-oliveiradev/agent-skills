import type { CompetencyId } from "./competencies";
import type { JobCapabilitySignal, StructuralRequirement } from "./types";

export interface ExtractedJobSignals {
  readonly signals: readonly JobCapabilitySignal[];
  readonly structuralRequirements: readonly StructuralRequirement[];
}

export const technologyAliases = [
  { alias: "javascript", competencyId: "programming-javascript" },
  { alias: "typescript", competencyId: "programming-typescript" },
  { alias: "react", competencyId: "ui-component-modeling" },
  { alias: "react.js", competencyId: "ui-component-modeling" },
  { alias: "next.js", competencyId: "ui-component-modeling" },
  { alias: "playwright", competencyId: "testing-behavior" },
  { alias: "vitest", competencyId: "testing-behavior" },
  { alias: "jest", competencyId: "testing-behavior" },
  { alias: "node", competencyId: "node-runtime-foundations" },
  { alias: "node.js", competencyId: "node-runtime-foundations" },
  { alias: "postgres", competencyId: "relational-data-modeling" },
  { alias: "postgresql", competencyId: "relational-data-modeling" },
  { alias: "rest api", competencyId: "http-api-engineering" },
  { alias: "http api", competencyId: "http-api-engineering" },
  { alias: "wcag", competencyId: "web-accessibility" },
  { alias: "accessibility", competencyId: "web-accessibility" },
  { alias: "git", competencyId: "git-collaboration" },
  { alias: "github", competencyId: "git-collaboration" },
  { alias: "owasp", competencyId: "application-security-foundations" },
] as const satisfies readonly { alias: string; competencyId: CompetencyId }[];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phraseOccurs(text: string, phrase: string): boolean {
  const escaped = escapeRegExp(phrase).replace(/\\ /g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i").test(text);
}

function explicitSignals(text: string): readonly JobCapabilitySignal[] {
  const labelsByCompetency = new Map<CompetencyId, string[]>();

  for (const entry of technologyAliases) {
    if (!phraseOccurs(text, entry.alias)) continue;
    const labels = labelsByCompetency.get(entry.competencyId) ?? [];
    if (!labels.includes(entry.alias)) labels.push(entry.alias);
    labelsByCompetency.set(entry.competencyId, labels);
  }

  return [...labelsByCompetency.entries()].map(([competencyId, labels]) => ({
    competencyId,
    label: labels.join(" / "),
    provenance: "explicit" as const,
  }));
}

function pushRequirement(
  requirements: StructuralRequirement[],
  requirement: StructuralRequirement,
): void {
  if (
    requirements.some(
      (candidate) =>
        candidate.kind === requirement.kind &&
        candidate.label.toLowerCase() === requirement.label.toLowerCase(),
    )
  ) {
    return;
  }
  requirements.push(requirement);
}

function extractStructuralRequirements(text: string): readonly StructuralRequirement[] {
  const requirements: StructuralRequirement[] = [];

  const experience = text.match(/\b\d{1,2}\+?\s+years?\s+(?:of\s+)?(?:professional\s+)?experience\b/i);
  if (experience?.[0]) {
    pushRequirement(requirements, {
      kind: "experience",
      label: experience[0],
      hard: false,
      status: "unknown",
    });
  }

  const workAuthorization = text.match(
    /\b(?:must\s+(?:already\s+)?be\s+authorized\s+to\s+work(?:\s+in\s+[^.;\n]+)?|work\s+authorization\s+(?:is\s+)?required)\b/i,
  );
  if (workAuthorization?.[0]) {
    pushRequirement(requirements, {
      kind: "work-authorization",
      label: workAuthorization[0],
      hard: true,
      status: "unknown",
    });
  }

  const location = text.match(
    /\b(?:candidates?\s+)?must\s+(?:be\s+(?:based|located)|reside|live)\s+in\s+[^.;\n]+/i,
  );
  if (location?.[0]) {
    pushRequirement(requirements, {
      kind: "location",
      label: location[0],
      hard: true,
      status: "unknown",
    });
  }

  const language = text.match(
    /\b(?:fluent\s+(?:in\s+)?english|english\s+(?:is\s+)?required|required\s+english)\b/i,
  );
  if (language?.[0]) {
    pushRequirement(requirements, {
      kind: "language",
      label: language[0],
      hard: true,
      status: "unknown",
    });
  }

  const credential = text.match(
    /\b(?:bachelor(?:'s)?\s+degree|university\s+degree|college\s+degree)\s+(?:is\s+)?required\b/i,
  );
  if (credential?.[0]) {
    pushRequirement(requirements, {
      kind: "credential",
      label: credential[0],
      hard: true,
      status: "unknown",
    });
  }

  const onsite = text.match(/\b(?:on[- ]?site|onsite)\s+(?:work\s+)?(?:is\s+)?required\b/i);
  if (onsite?.[0]) {
    pushRequirement(requirements, {
      kind: "work-mode",
      label: onsite[0],
      hard: true,
      status: "unknown",
    });
  }

  const availability = text.match(
    /\bmust\s+be\s+available\s+(?:during|for|to\s+work)\s+[^.;\n]+/i,
  );
  if (availability?.[0]) {
    pushRequirement(requirements, {
      kind: "availability",
      label: availability[0],
      hard: true,
      status: "unknown",
    });
  }

  return requirements;
}

export function extractExplicitJobSignals(text: string): ExtractedJobSignals {
  if (typeof text !== "string") {
    throw new Error("Job posting text must be a string");
  }

  return {
    signals: explicitSignals(text),
    structuralRequirements: extractStructuralRequirements(text),
  };
}
