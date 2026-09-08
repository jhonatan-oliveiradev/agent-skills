import { deriveEvidenceConfidence, evidenceClassRank, maxLevelAllowedByEvidence } from "./evidence";
import type {
  CompetencyState,
  EvidenceClass,
  EvidenceRecord,
  ProficiencyLevel,
} from "./types";

export const competencyIds = [
  "programming-javascript",
  "programming-typescript",
  "web-platform-foundations",
  "ui-component-modeling",
  "state-data-flow",
  "web-accessibility",
  "http-api-engineering",
  "node-runtime-foundations",
  "relational-data-modeling",
  "testing-behavior",
  "git-collaboration",
  "application-security-foundations",
  "architecture-boundaries",
  "professional-evidence",
] as const;

export type CompetencyId = (typeof competencyIds)[number];

export interface CapabilityCriterion {
  readonly id: string;
  readonly level: ProficiencyLevel;
  readonly description: string;
  readonly minimumEvidenceClass: EvidenceClass;
  readonly blocking: boolean;
}

export interface CompetencyDefinition {
  readonly id: CompetencyId;
  readonly domain: string;
  readonly title: string;
  readonly prerequisites: readonly CompetencyId[];
  readonly criteria: readonly CapabilityCriterion[];
  readonly blockingEvidenceClasses: Readonly<
    Partial<Record<ProficiencyLevel, readonly EvidenceClass[]>>
  >;
}

const proficiencyLevels = [
  "foundation",
  "developing",
  "proficient",
  "advanced",
] as const satisfies readonly ProficiencyLevel[];

const proficiencyRank: Readonly<Record<ProficiencyLevel, number>> = {
  foundation: 0,
  developing: 1,
  proficient: 2,
  advanced: 3,
};

const minimumEvidenceClass: Readonly<Record<ProficiencyLevel, EvidenceClass>> = {
  foundation: "E1",
  developing: "E2",
  proficient: "E3",
  advanced: "E4",
};

interface CompetencyInput {
  readonly id: CompetencyId;
  readonly domain: string;
  readonly title: string;
  readonly prerequisites?: readonly CompetencyId[];
  readonly descriptions: Readonly<Record<ProficiencyLevel, string>>;
}

function defineCompetency(input: CompetencyInput): CompetencyDefinition {
  return {
    id: input.id,
    domain: input.domain,
    title: input.title,
    prerequisites: input.prerequisites ?? [],
    criteria: proficiencyLevels.map((level) => ({
      id: `${input.id}.${level}`,
      level,
      description: input.descriptions[level],
      minimumEvidenceClass: minimumEvidenceClass[level],
      blocking: level === "proficient" || level === "advanced",
    })),
    blockingEvidenceClasses: {
      proficient: ["E3", "E4"],
      advanced: ["E4"],
    },
  };
}

export const programmingJavaScript = defineCompetency({
  id: "programming-javascript",
  domain: "programming",
  title: "JavaScript programming",
  descriptions: {
    foundation: "Explains values, control flow, functions, scope, and asynchronous execution.",
    developing: "Reasons through stateful and asynchronous application behavior with clear failure handling.",
    proficient: "Implements maintainable application logic and diagnoses non-trivial runtime behavior.",
    advanced: "Designs resilient language-level abstractions and explains their trade-offs under production constraints.",
  },
});

const programmingTypeScript = defineCompetency({
  id: "programming-typescript",
  domain: "programming",
  title: "TypeScript application modeling",
  prerequisites: ["programming-javascript"],
  descriptions: {
    foundation: "Uses structural types, unions, narrowing, and function contracts safely.",
    developing: "Models application states so invalid combinations are difficult to represent.",
    proficient: "Designs reusable typed boundaries across application modules and external data.",
    advanced: "Balances type-system precision, inference, maintainability, and API ergonomics across a codebase.",
  },
});

const webPlatformFoundations = defineCompetency({
  id: "web-platform-foundations",
  domain: "web-platform",
  title: "Web platform foundations",
  prerequisites: ["programming-javascript"],
  descriptions: {
    foundation: "Explains document structure, browser execution, events, forms, and network boundaries.",
    developing: "Builds browser-native behavior with semantic markup, resilient events, and explicit lifecycle handling.",
    proficient: "Diagnoses platform behavior across rendering, navigation, storage, and browser APIs.",
    advanced: "Chooses platform primitives deliberately and accounts for compatibility, performance, and progressive enhancement.",
  },
});

const uiComponentModeling = defineCompetency({
  id: "ui-component-modeling",
  domain: "frontend",
  title: "UI component modeling",
  prerequisites: ["web-platform-foundations"],
  descriptions: {
    foundation: "Identifies component boundaries, inputs, outputs, and presentation responsibilities.",
    developing: "Composes reusable interface units without leaking unrelated state or behavior.",
    proficient: "Designs component APIs and composition boundaries that remain maintainable as interfaces evolve.",
    advanced: "Shapes scalable UI architecture with explicit ownership, extension points, and migration paths.",
  },
});

const stateDataFlow = defineCompetency({
  id: "state-data-flow",
  domain: "frontend",
  title: "State and data flow",
  prerequisites: ["programming-javascript"],
  descriptions: {
    foundation: "Distinguishes local, derived, remote, and persisted state.",
    developing: "Models predictable state transitions and asynchronous data flow.",
    proficient: "Chooses state ownership and synchronization boundaries that avoid duplication and race conditions.",
    advanced: "Designs complex state systems with explicit consistency, invalidation, and recovery strategies.",
  },
});

const webAccessibility = defineCompetency({
  id: "web-accessibility",
  domain: "frontend",
  title: "Web accessibility",
  prerequisites: ["web-platform-foundations", "ui-component-modeling"],
  descriptions: {
    foundation: "Recognizes semantic, keyboard, labeling, focus, and contrast requirements.",
    developing: "Implements keyboard-operable and semantically exposed interactive interfaces.",
    proficient: "Diagnoses accessibility failures across structure, interaction, focus, and assistive-technology semantics.",
    advanced: "Builds accessibility into interface architecture, review criteria, and regression prevention.",
  },
});

const httpApiEngineering = defineCompetency({
  id: "http-api-engineering",
  domain: "backend",
  title: "HTTP and API engineering",
  prerequisites: ["web-platform-foundations"],
  descriptions: {
    foundation: "Explains requests, responses, methods, status semantics, headers, and resource boundaries.",
    developing: "Designs clear request validation, error semantics, and idempotent behavior where required.",
    proficient: "Implements and diagnoses robust API boundaries including failure, authorization, and concurrency cases.",
    advanced: "Evolves API contracts with compatibility, observability, performance, and distributed failure trade-offs.",
  },
});

const nodeRuntimeFoundations = defineCompetency({
  id: "node-runtime-foundations",
  domain: "backend",
  title: "Server runtime foundations",
  prerequisites: ["programming-javascript", "http-api-engineering"],
  descriptions: {
    foundation: "Explains runtime modules, asynchronous I/O, environment configuration, and process lifecycle.",
    developing: "Builds services with explicit resource, error, and shutdown handling.",
    proficient: "Diagnoses runtime behavior across concurrency, I/O, memory, and service lifecycle boundaries.",
    advanced: "Designs runtime architecture for resilience, operability, workload characteristics, and controlled failure.",
  },
});

const relationalDataModeling = defineCompetency({
  id: "relational-data-modeling",
  domain: "data",
  title: "Relational data modeling",
  descriptions: {
    foundation: "Models entities, relationships, keys, constraints, and normalized data shapes.",
    developing: "Designs queries and schema changes around integrity, access patterns, and transactional behavior.",
    proficient: "Diagnoses correctness and performance across indexes, transactions, constraints, and evolving schemas.",
    advanced: "Designs durable relational boundaries for scale, migration safety, consistency, and operational trade-offs.",
  },
});

export const testingBehavior = defineCompetency({
  id: "testing-behavior",
  domain: "quality",
  title: "Testing behavior",
  prerequisites: ["programming-javascript"],
  descriptions: {
    foundation: "Distinguishes observable behavior from implementation detail and chooses meaningful assertions.",
    developing: "Designs tests around boundaries, failure modes, and user-visible or contract-visible outcomes.",
    proficient: "Builds reliable test strategies that catch regressions without coupling to incidental implementation.",
    advanced: "Shapes verification architecture across layers, risk classes, determinism, and diagnostic quality.",
  },
});

const gitCollaboration = defineCompetency({
  id: "git-collaboration",
  domain: "engineering-workflow",
  title: "Version-control collaboration",
  descriptions: {
    foundation: "Uses commits, branches, history inspection, and basic conflict resolution safely.",
    developing: "Creates reviewable changes with coherent history and handles collaboration conflicts deliberately.",
    proficient: "Operates branching and review workflows with rollback, traceability, and integration risk in mind.",
    advanced: "Designs collaboration conventions and recovery practices for multi-contributor repositories.",
  },
});

const applicationSecurityFoundations = defineCompetency({
  id: "application-security-foundations",
  domain: "security",
  title: "Application security foundations",
  prerequisites: ["http-api-engineering"],
  descriptions: {
    foundation: "Recognizes trust boundaries, input risk, authentication, authorization, and secret-handling concerns.",
    developing: "Applies validation, least privilege, safe data handling, and explicit authorization checks.",
    proficient: "Threat-models application flows and verifies security controls at meaningful boundaries.",
    advanced: "Integrates security review, abuse resistance, dependency risk, and incident-conscious design into architecture.",
  },
});

const architectureBoundaries = defineCompetency({
  id: "architecture-boundaries",
  domain: "architecture",
  title: "Architecture boundaries",
  prerequisites: ["testing-behavior"],
  descriptions: {
    foundation: "Identifies responsibilities, dependencies, interfaces, and sources of coupling.",
    developing: "Separates modules around coherent ownership and explicit contracts.",
    proficient: "Evolves boundaries using dependency direction, failure isolation, and testability as constraints.",
    advanced: "Makes system-level trade-offs across coupling, operability, migration cost, performance, and organizational ownership.",
  },
});

const professionalEvidence = defineCompetency({
  id: "professional-evidence",
  domain: "professional-practice",
  title: "Professional evidence",
  prerequisites: ["git-collaboration"],
  descriptions: {
    foundation: "Describes work with concrete problem, contribution, artifact, and outcome evidence.",
    developing: "Curates verifiable work samples that connect implementation decisions to observable results.",
    proficient: "Presents multiple credible artifacts with provenance, scope, trade-offs, and validation evidence.",
    advanced: "Builds a sustained evidence trail showing ownership, impact, technical judgment, and reusable professional learning.",
  },
});

export const competencyDefinitions = [
  programmingJavaScript,
  programmingTypeScript,
  webPlatformFoundations,
  uiComponentModeling,
  stateDataFlow,
  webAccessibility,
  httpApiEngineering,
  nodeRuntimeFoundations,
  relationalDataModeling,
  testingBehavior,
  gitCollaboration,
  applicationSecurityFoundations,
  architectureBoundaries,
  professionalEvidence,
] as const satisfies readonly CompetencyDefinition[];

function criterionSatisfied(
  criterion: CapabilityCriterion,
  evidence: readonly EvidenceRecord[],
): boolean {
  return evidence.some(
    (record) =>
      record.criterionIds?.includes(criterion.id) === true &&
      record.demonstratedLevel !== undefined &&
      proficiencyRank[record.demonstratedLevel] >= proficiencyRank[criterion.level] &&
      evidenceClassRank[record.class] >= evidenceClassRank[criterion.minimumEvidenceClass],
  );
}

function blockersSatisfied(
  definition: CompetencyDefinition,
  level: ProficiencyLevel,
  evidence: readonly EvidenceRecord[],
): boolean {
  const allowedClasses = definition.blockingEvidenceClasses[level];
  if (!allowedClasses) return true;

  return evidence.some(
    (record) =>
      allowedClasses.includes(record.class) &&
      record.demonstratedLevel !== undefined &&
      proficiencyRank[record.demonstratedLevel] >= proficiencyRank[level],
  );
}

function clampToEvidenceCap(
  level: ProficiencyLevel | null,
  cap: ProficiencyLevel | null,
): ProficiencyLevel | null {
  if (level === null || cap === null) return null;
  return proficiencyRank[level] <= proficiencyRank[cap] ? level : cap;
}

export function deriveCompetencyState(
  definition: CompetencyDefinition,
  evidence: readonly EvidenceRecord[],
  now = new Date(),
): CompetencyState {
  const relevant = evidence.filter((record) => record.competencyId === definition.id);
  let demonstrated: ProficiencyLevel | null = null;

  for (const level of proficiencyLevels) {
    const requiredCriteria = definition.criteria.filter(
      (criterion) => proficiencyRank[criterion.level] <= proficiencyRank[level],
    );
    const criteriaPass = requiredCriteria.every((criterion) =>
      criterionSatisfied(criterion, relevant),
    );
    if (!criteriaPass || !blockersSatisfied(definition, level, relevant)) break;
    demonstrated = level;
  }

  const level = clampToEvidenceCap(demonstrated, maxLevelAllowedByEvidence(relevant));
  const assessmentDates = relevant
    .filter((record) => record.sourceType === "assessment")
    .map((record) => record.observedAt)
    .sort((left, right) => Date.parse(right) - Date.parse(left));

  return {
    competencyId: definition.id,
    level,
    confidence: deriveEvidenceConfidence(relevant, now),
    evidenceIds: relevant.map((record) => record.id),
    lastAssessedAt: assessmentDates[0] ?? null,
  };
}
