import { competencyDefinitions, deriveCompetencyState } from "./competencies";
import { deriveEvidenceConfidence } from "./evidence";
import type {
  CareerProfile,
  ConfidenceLevel,
  EvidenceClass,
  EvidenceRecord,
  ProficiencyLevel,
} from "./types";

export type AssessmentChallengeKind =
  | "single-choice"
  | "multi-select"
  | "code-reading-choice"
  | "debugging-choice"
  | "structured-ordering";

export interface AssessmentDimension {
  readonly id: string;
  readonly label: string;
  readonly required: boolean;
}

export interface AssessmentOption {
  readonly id: string;
  readonly label: string;
}

export interface AssessmentChallenge {
  readonly id: string;
  readonly dimensionId: string;
  readonly kind: AssessmentChallengeKind;
  readonly prompt: string;
  readonly options: readonly AssessmentOption[];
  readonly correctOptionIds: readonly string[];
  readonly evidenceClass: EvidenceClass;
  readonly demonstratedLevel: ProficiencyLevel;
  readonly criterionIds: readonly string[];
}

export interface AssessmentGate {
  readonly dimensionId: string;
  readonly minimumPassedChallenges: number;
  readonly requiredForLevel: ProficiencyLevel;
}

export interface AssessmentBlueprint {
  readonly id: string;
  readonly version: "1";
  readonly competencyId: string;
  readonly targetLevel: ProficiencyLevel;
  readonly dimensions: readonly AssessmentDimension[];
  readonly challenges: readonly AssessmentChallenge[];
  readonly gates: readonly AssessmentGate[];
}

export interface PublicAssessmentChallenge {
  readonly id: string;
  readonly dimensionId: string;
  readonly kind: AssessmentChallengeKind;
  readonly prompt: string;
  readonly options: readonly AssessmentOption[];
}

export interface PublicAssessmentBlueprint {
  readonly id: string;
  readonly version: "1";
  readonly competencyId: string;
  readonly targetLevel: ProficiencyLevel;
  readonly dimensions: readonly AssessmentDimension[];
  readonly challenges: readonly PublicAssessmentChallenge[];
}

export interface AssessmentResponses {
  readonly blueprintId: string;
  readonly blueprintVersion: string;
  readonly completedAt: string;
  readonly answers: Readonly<Record<string, readonly string[]>>;
}

export interface ObservedDimension {
  readonly dimensionId: string;
  readonly passed: boolean;
  readonly passedChallengeIds: readonly string[];
  readonly failedChallengeIds: readonly string[];
  readonly observedSignals: readonly string[];
}

export interface AssessmentResultArtifact {
  readonly schemaVersion: "1";
  readonly artifactType: "assessment-result";
  readonly blueprintId: string;
  readonly blueprintVersion: "1";
  readonly competencyId: string;
  readonly completedAt: string;
  readonly level: ProficiencyLevel;
  readonly confidence: ConfidenceLevel;
  readonly dimensions: readonly ObservedDimension[];
  readonly evidence: readonly EvidenceRecord[];
  readonly gaps: readonly string[];
  readonly strongSignals: readonly string[];
  readonly weakSignals: readonly string[];
  readonly recommendedNextEvidence: string;
  readonly provenance: Readonly<{ trust: "local-deterministic" }>;
}

const levelRank: Readonly<Record<ProficiencyLevel, number>> = {
  foundation: 0,
  developing: 1,
  proficient: 2,
  advanced: 3,
};

function assertNonEmpty(value: string, label: string): void {
  if (value.trim() === "") throw new Error(label + ": expected non-empty string");
}

function assertIsoDate(value: string, label: string): void {
  if (!Number.isFinite(Date.parse(value))) {
    throw new Error(label + ": expected ISO date-time string");
  }
}

function assertUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) {
    throw new Error(label + ": duplicate value");
  }
}

export function validateAssessmentBlueprint(
  blueprint: AssessmentBlueprint,
): AssessmentBlueprint {
  assertNonEmpty(blueprint.id, "blueprint.id");
  if (blueprint.version !== "1") throw new Error("blueprint.version: unsupported");
  assertNonEmpty(blueprint.competencyId, "blueprint.competencyId");
  if (!competencyDefinitions.some((definition) => definition.id === blueprint.competencyId)) {
    throw new Error("blueprint.competencyId: unknown competency");
  }
  if (blueprint.dimensions.length === 0) throw new Error("blueprint.dimensions: expected non-empty");
  if (blueprint.challenges.length === 0) throw new Error("blueprint.challenges: expected non-empty");

  const dimensionIds = blueprint.dimensions.map((dimension) => dimension.id);
  assertUnique(dimensionIds, "blueprint.dimensions");
  for (const dimension of blueprint.dimensions) {
    assertNonEmpty(dimension.id, "dimension.id");
    assertNonEmpty(dimension.label, "dimension.label");
  }

  const challengeIds = blueprint.challenges.map((challenge) => challenge.id);
  if (new Set(challengeIds).size !== challengeIds.length) {
    throw new Error("blueprint: duplicate challenge id");
  }

  for (const challenge of blueprint.challenges) {
    assertNonEmpty(challenge.id, "challenge.id");
    assertNonEmpty(challenge.prompt, "challenge.prompt");
    if (!dimensionIds.includes(challenge.dimensionId)) {
      throw new Error("challenge.dimensionId: unknown dimension");
    }
    if (challenge.options.length < 2) {
      throw new Error("challenge.options: expected at least two options");
    }
    const optionIds = challenge.options.map((option) => option.id);
    assertUnique(optionIds, "challenge.options");
    for (const option of challenge.options) {
      assertNonEmpty(option.id, "option.id");
      assertNonEmpty(option.label, "option.label");
    }
    if (challenge.correctOptionIds.length === 0) {
      throw new Error("challenge.correctOptionIds: expected non-empty");
    }
    assertUnique(challenge.correctOptionIds, "challenge.correctOptionIds");
    if (challenge.correctOptionIds.some((id) => !optionIds.includes(id))) {
      throw new Error("challenge.correct option: option not found");
    }
    if (challenge.kind !== "multi-select" && challenge.correctOptionIds.length !== 1 && challenge.kind !== "structured-ordering") {
      throw new Error("challenge.correctOptionIds: invalid evidence requirement");
    }
    if (challenge.criterionIds.length === 0) {
      throw new Error("challenge.criterionIds: expected non-empty evidence requirement");
    }
    assertUnique(challenge.criterionIds, "challenge.criterionIds");
  }

  for (const gate of blueprint.gates) {
    if (!dimensionIds.includes(gate.dimensionId)) {
      throw new Error("gate.dimensionId: unknown dimension");
    }
    if (!Number.isInteger(gate.minimumPassedChallenges) || gate.minimumPassedChallenges < 1) {
      throw new Error("gate.minimumPassedChallenges: expected positive integer");
    }
    const challengesInDimension = blueprint.challenges.filter(
      (challenge) => challenge.dimensionId === gate.dimensionId,
    );
    if (gate.minimumPassedChallenges > challengesInDimension.length) {
      throw new Error("gate.minimumPassedChallenges: exceeds dimension challenges");
    }
  }

  return blueprint;
}

function sameSet(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((id) => right.includes(id));
}

function responsePasses(
  challenge: AssessmentChallenge,
  answer: readonly string[],
): boolean {
  if (challenge.kind === "structured-ordering") {
    return answer.every((id, index) => id === challenge.correctOptionIds[index]) &&
      answer.length === challenge.correctOptionIds.length;
  }
  if (challenge.kind === "multi-select") {
    return sameSet(answer, challenge.correctOptionIds);
  }
  return answer.length === 1 && answer[0] === challenge.correctOptionIds[0];
}

function gateLevel(
  blueprint: AssessmentBlueprint,
  observations: readonly ObservedDimension[],
): ProficiencyLevel {
  const gatesPass = blueprint.gates.every((gate) => {
    const observed = observations.find((dimension) => dimension.dimensionId === gate.dimensionId);
    return (observed?.passedChallengeIds.length ?? 0) >= gate.minimumPassedChallenges;
  });
  if (gatesPass) return blueprint.targetLevel;
  return levelRank[blueprint.targetLevel] > levelRank.developing
    ? "developing"
    : "foundation";
}

function evidenceId(
  blueprint: AssessmentBlueprint,
  completedAt: string,
  challenge: AssessmentChallenge,
): string {
  return "assessment:" + blueprint.id + ":" + completedAt + ":" + challenge.id;
}

export function evaluateAssessment(
  blueprint: AssessmentBlueprint,
  responses: AssessmentResponses,
): AssessmentResultArtifact {
  validateAssessmentBlueprint(blueprint);
  if (responses.blueprintId !== blueprint.id) {
    throw new Error("assessment blueprint id mismatch");
  }
  if (responses.blueprintVersion !== blueprint.version) {
    throw new Error("assessment blueprint version mismatch");
  }
  assertIsoDate(responses.completedAt, "responses.completedAt");

  const dimensions = blueprint.dimensions.map((dimension): ObservedDimension => {
    const challenges = blueprint.challenges.filter(
      (challenge) => challenge.dimensionId === dimension.id,
    );
    const passedChallengeIds: string[] = [];
    const failedChallengeIds: string[] = [];
    const observedSignals: string[] = [];

    for (const challenge of challenges) {
      const answer = responses.answers[challenge.id];
      if (answer === undefined) {
        throw new Error("missing response for " + challenge.id);
      }
      if (answer.length === 0) {
        throw new Error("empty response for " + challenge.id);
      }
      if (answer.some((optionId) => !challenge.options.some((option) => option.id === optionId))) {
        throw new Error("invalid response for " + challenge.id);
      }
      if (new Set(answer).size !== answer.length) {
        throw new Error("invalid response for " + challenge.id);
      }
      if (responsePasses(challenge, answer)) {
        passedChallengeIds.push(challenge.id);
        observedSignals.push("Passed " + challenge.kind + " observation");
      } else {
        failedChallengeIds.push(challenge.id);
      }
    }

    return {
      dimensionId: dimension.id,
      passed: failedChallengeIds.length === 0,
      passedChallengeIds,
      failedChallengeIds,
      observedSignals,
    };
  });

  const evidence = blueprint.challenges.flatMap((challenge) => {
    const observed = dimensions.find((dimension) => dimension.dimensionId === challenge.dimensionId);
    if (!observed?.passedChallengeIds.includes(challenge.id)) return [];

    return [{
      id: evidenceId(blueprint, responses.completedAt, challenge),
      competencyId: blueprint.competencyId,
      class: challenge.evidenceClass,
      sourceType: "assessment" as const,
      trust: "local-deterministic" as const,
      observedAt: responses.completedAt,
      summary: "Passed " + challenge.kind + " challenge " + challenge.id,
      demonstratedLevel: challenge.demonstratedLevel,
      criterionIds: challenge.criterionIds,
    } satisfies EvidenceRecord];
  });

  const level = gateLevel(blueprint, dimensions);
  const confidence = evidence.length < 2
    ? "low"
    : deriveEvidenceConfidence(evidence, new Date(responses.completedAt));
  const strongSignals = dimensions.flatMap((dimension) => dimension.observedSignals);
  const weakSignals = dimensions
    .filter((dimension) => !dimension.passed)
    .map((dimension) => "Reassess " + dimension.dimensionId + " with a deterministic challenge");
  const gaps = dimensions.flatMap((dimension) => dimension.failedChallengeIds);

  return {
    schemaVersion: "1",
    artifactType: "assessment-result",
    blueprintId: blueprint.id,
    blueprintVersion: "1",
    competencyId: blueprint.competencyId,
    completedAt: responses.completedAt,
    level,
    confidence,
    dimensions,
    evidence,
    gaps,
    strongSignals,
    weakSignals,
    recommendedNextEvidence: weakSignals[0] ?? "Add another deterministic performance observation.",
    provenance: { trust: "local-deterministic" },
  };
}

export function applyAssessmentResult(
  profile: CareerProfile,
  result: AssessmentResultArtifact,
): CareerProfile {
  if (result.provenance.trust !== "local-deterministic") {
    throw new Error("assessment result: expected local deterministic provenance");
  }
  assertIsoDate(result.completedAt, "result.completedAt");
  const definition = competencyDefinitions.find(
    (candidate) => candidate.id === result.competencyId,
  );
  if (!definition) throw new Error("assessment result: unknown competency");

  const evidence = [...profile.evidence, ...result.evidence];
  const derived = deriveCompetencyState(
    definition,
    evidence,
    new Date(result.completedAt),
  );
  const assessment = {
    id: "assessment:" + result.blueprintId + ":" + result.completedAt,
    blueprintId: result.blueprintId,
    blueprintVersion: result.blueprintVersion,
    competencyId: result.competencyId,
    level: result.level,
    confidence: result.confidence,
    evidenceIds: result.evidence.map((record) => record.id),
    completedAt: result.completedAt,
    trust: "local-deterministic" as const,
  };
  const exists = profile.competencies.some(
    (state) => state.competencyId === result.competencyId,
  );

  return {
    ...profile,
    competencies: exists
      ? profile.competencies.map((state) =>
          state.competencyId === result.competencyId ? derived : state,
        )
      : [...profile.competencies, derived],
    assessments: [...profile.assessments, assessment],
    evidence,
    updatedAt: result.completedAt,
  };
}

export function toPublicAssessmentBlueprint(
  blueprint: AssessmentBlueprint,
): PublicAssessmentBlueprint {
  return {
    id: blueprint.id,
    version: blueprint.version,
    competencyId: blueprint.competencyId,
    targetLevel: blueprint.targetLevel,
    dimensions: blueprint.dimensions,
    challenges: blueprint.challenges.map(({ id, dimensionId, kind, prompt, options }) => ({
      id,
      dimensionId,
      kind,
      prompt,
      options,
    })),
  };
}
