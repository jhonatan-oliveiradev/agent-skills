import type {
  AssessmentRecord,
  CareerArtifact,
  CareerArtifactType,
  CareerProfile,
  CompetencyState,
  ConfidenceLevel,
  DecisionRecord,
  EvidenceClass,
  EvidenceRecord,
  EvidenceSourceType,
  EvidenceTrust,
  MarketSample,
  ProficiencyLevel,
  RoadmapState,
  TargetRoleId,
} from "./types";

const targetRoles = [
  "frontend-developer",
  "backend-developer",
  "fullstack-developer",
] as const satisfies readonly TargetRoleId[];
const proficiencyLevels = [
  "foundation",
  "developing",
  "proficient",
  "advanced",
] as const satisfies readonly ProficiencyLevel[];
const confidenceLevels = ["low", "medium", "high"] as const satisfies readonly ConfidenceLevel[];
const evidenceClasses = ["E0", "E1", "E2", "E3", "E4"] as const satisfies readonly EvidenceClass[];
const evidenceTrust = [
  "local-deterministic",
  "external-unverified",
  "user-claimed",
] as const satisfies readonly EvidenceTrust[];
const evidenceSourceTypes = [
  "self-report",
  "assessment",
  "portfolio",
  "practice",
] as const satisfies readonly EvidenceSourceType[];
const artifactTypes = [
  "assessment-result",
  "roadmap-update",
  "learning-unit",
  "portfolio-evidence",
  "market-analysis",
] as const satisfies readonly CareerArtifactType[];
const decisionKinds = ["roadmap-recalculation", "target-change", "profile-import"] as const;

export function assertRecord(
  value: unknown,
  label: string,
): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}: expected object`);
  }
}

function assertOnlyKeys(
  value: Record<string, unknown>,
  allowed: readonly string[],
  label: string,
): void {
  const unknownKey = Object.keys(value).find((key) => !allowed.includes(key));
  if (unknownKey) {
    throw new Error(`${label}.${unknownKey}: unexpected field`);
  }
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label}: expected non-empty string`);
  }
}

function assertIsoDateTime(value: unknown, label: string): asserts value is string {
  assertString(value, label);
  if (!Number.isFinite(Date.parse(value))) {
    throw new Error(`${label}: expected ISO date-time string`);
  }
}

function assertOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  label: string,
): asserts value is T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new Error(`${label}: invalid value`);
  }
}

function parseStringArray(value: unknown, label: string, allowEmpty = true): readonly string[] {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
    throw new Error(`${label}: expected ${allowEmpty ? "array" : "non-empty array"}`);
  }

  return value.map((item, index) => {
    assertString(item, `${label}[${index}]`);
    return item;
  });
}

function parseTargetRoles(value: unknown): readonly TargetRoleId[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("targetRoles: expected non-empty array");
  }

  return value.map((item, index) => {
    assertOneOf(item, targetRoles, `targetRoles[${index}]`);
    return item;
  });
}

function parseCompetencyState(value: unknown, label: string): CompetencyState {
  assertRecord(value, label);
  assertOnlyKeys(
    value,
    ["competencyId", "level", "confidence", "evidenceIds", "lastAssessedAt"],
    label,
  );
  assertString(value.competencyId, `${label}.competencyId`);
  if (value.level !== null) {
    assertOneOf(value.level, proficiencyLevels, `${label}.level`);
  }
  assertOneOf(value.confidence, confidenceLevels, `${label}.confidence`);
  const evidenceIds = parseStringArray(value.evidenceIds, `${label}.evidenceIds`);
  if (value.lastAssessedAt !== null) {
    assertIsoDateTime(value.lastAssessedAt, `${label}.lastAssessedAt`);
  }

  return {
    competencyId: value.competencyId,
    level: value.level,
    confidence: value.confidence,
    evidenceIds,
    lastAssessedAt: value.lastAssessedAt,
  };
}

function parseEvidenceRecord(value: unknown, label: string): EvidenceRecord {
  assertRecord(value, label);
  assertOnlyKeys(
    value,
    [
      "id",
      "competencyId",
      "class",
      "sourceType",
      "trust",
      "observedAt",
      "summary",
      "sourceUrl",
      "demonstratedLevel",
      "criterionIds",
    ],
    label,
  );
  assertString(value.id, `${label}.id`);
  assertString(value.competencyId, `${label}.competencyId`);
  assertOneOf(value.class, evidenceClasses, `${label}.class`);
  assertOneOf(value.sourceType, evidenceSourceTypes, `${label}.sourceType`);
  assertOneOf(value.trust, evidenceTrust, `${label}.trust`);
  assertIsoDateTime(value.observedAt, `${label}.observedAt`);
  assertString(value.summary, `${label}.summary`);
  if (value.sourceUrl !== undefined) {
    assertString(value.sourceUrl, `${label}.sourceUrl`);
  }

  let demonstratedLevel: ProficiencyLevel | undefined;
  if (value.demonstratedLevel !== undefined) {
    assertOneOf(value.demonstratedLevel, proficiencyLevels, `${label}.demonstratedLevel`);
    demonstratedLevel = value.demonstratedLevel;
  }

  const criterionIds =
    value.criterionIds === undefined
      ? undefined
      : parseStringArray(value.criterionIds, `${label}.criterionIds`, false);

  if ((demonstratedLevel === undefined) !== (criterionIds === undefined)) {
    throw new Error(
      `${label}: demonstratedLevel and criterionIds must be supplied together`,
    );
  }

  return {
    id: value.id,
    competencyId: value.competencyId,
    class: value.class,
    sourceType: value.sourceType,
    trust: value.trust,
    observedAt: value.observedAt,
    summary: value.summary,
    ...(value.sourceUrl === undefined ? {} : { sourceUrl: value.sourceUrl }),
    ...(demonstratedLevel === undefined ? {} : { demonstratedLevel }),
    ...(criterionIds === undefined ? {} : { criterionIds }),
  };
}

function parseAssessmentRecord(value: unknown, label: string): AssessmentRecord {
  assertRecord(value, label);
  assertOnlyKeys(
    value,
    [
      "id",
      "blueprintId",
      "blueprintVersion",
      "competencyId",
      "level",
      "confidence",
      "evidenceIds",
      "completedAt",
      "trust",
    ],
    label,
  );
  assertString(value.id, `${label}.id`);
  assertString(value.blueprintId, `${label}.blueprintId`);
  assertString(value.blueprintVersion, `${label}.blueprintVersion`);
  assertString(value.competencyId, `${label}.competencyId`);
  assertOneOf(value.level, proficiencyLevels, `${label}.level`);
  assertOneOf(value.confidence, confidenceLevels, `${label}.confidence`);
  const evidenceIds = parseStringArray(value.evidenceIds, `${label}.evidenceIds`);
  assertIsoDateTime(value.completedAt, `${label}.completedAt`);
  assertOneOf(value.trust, evidenceTrust, `${label}.trust`);

  return {
    id: value.id,
    blueprintId: value.blueprintId,
    blueprintVersion: value.blueprintVersion,
    competencyId: value.competencyId,
    level: value.level,
    confidence: value.confidence,
    evidenceIds,
    completedAt: value.completedAt,
    trust: value.trust,
  };
}

function parseRoadmapState(value: unknown): RoadmapState {
  assertRecord(value, "roadmap");
  assertOnlyKeys(
    value,
    ["milestoneIds", "currentFocusMilestoneId", "supportingActivityId"],
    "roadmap",
  );
  const milestoneIds = parseStringArray(value.milestoneIds, "roadmap.milestoneIds");
  if (value.currentFocusMilestoneId !== null) {
    assertString(value.currentFocusMilestoneId, "roadmap.currentFocusMilestoneId");
  }
  if (value.supportingActivityId !== null) {
    assertString(value.supportingActivityId, "roadmap.supportingActivityId");
  }

  return {
    milestoneIds,
    currentFocusMilestoneId: value.currentFocusMilestoneId,
    supportingActivityId: value.supportingActivityId,
  };
}

function assertNonNegativeInteger(value: unknown, label: string): asserts value is number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new Error(`${label}: expected non-negative integer`);
  }
}

function parseMarketSample(value: unknown, label: string): MarketSample {
  assertRecord(value, label);
  assertOnlyKeys(
    value,
    [
      "id",
      "targetRole",
      "targetMarket",
      "capturedAt",
      "postingCount",
      "distinctCompanyCount",
      "distinctSourceCount",
    ],
    label,
  );
  assertString(value.id, `${label}.id`);
  assertOneOf(value.targetRole, targetRoles, `${label}.targetRole`);
  assertString(value.targetMarket, `${label}.targetMarket`);
  assertIsoDateTime(value.capturedAt, `${label}.capturedAt`);
  assertNonNegativeInteger(value.postingCount, `${label}.postingCount`);
  assertNonNegativeInteger(value.distinctCompanyCount, `${label}.distinctCompanyCount`);
  assertNonNegativeInteger(value.distinctSourceCount, `${label}.distinctSourceCount`);

  return {
    id: value.id,
    targetRole: value.targetRole,
    targetMarket: value.targetMarket,
    capturedAt: value.capturedAt,
    postingCount: value.postingCount,
    distinctCompanyCount: value.distinctCompanyCount,
    distinctSourceCount: value.distinctSourceCount,
  };
}

function parseDecisionRecord(value: unknown, label: string): DecisionRecord {
  assertRecord(value, label);
  assertOnlyKeys(
    value,
    ["id", "kind", "reason", "summary", "createdAt", "beforeMilestoneIds", "afterMilestoneIds"],
    label,
  );
  assertString(value.id, `${label}.id`);
  assertOneOf(value.kind, decisionKinds, `${label}.kind`);
  assertString(value.reason, `${label}.reason`);
  assertString(value.summary, `${label}.summary`);
  assertIsoDateTime(value.createdAt, `${label}.createdAt`);
  const beforeMilestoneIds =
    value.beforeMilestoneIds === undefined
      ? undefined
      : parseStringArray(value.beforeMilestoneIds, `${label}.beforeMilestoneIds`);
  const afterMilestoneIds =
    value.afterMilestoneIds === undefined
      ? undefined
      : parseStringArray(value.afterMilestoneIds, `${label}.afterMilestoneIds`);

  return {
    id: value.id,
    kind: value.kind,
    reason: value.reason,
    summary: value.summary,
    createdAt: value.createdAt,
    ...(beforeMilestoneIds === undefined ? {} : { beforeMilestoneIds }),
    ...(afterMilestoneIds === undefined ? {} : { afterMilestoneIds }),
  };
}

function parseArray<T>(
  value: unknown,
  label: string,
  parser: (item: unknown, label: string) => T,
): readonly T[] {
  if (!Array.isArray(value)) {
    throw new Error(`${label}: expected array`);
  }
  return value.map((item, index) => parser(item, `${label}[${index}]`));
}

export function parseCareerProfile(value: unknown): CareerProfile {
  assertRecord(value, "careerProfile");

  if (value.schemaVersion !== "1") {
    throw new Error(`Unsupported career profile schema: ${String(value.schemaVersion)}`);
  }

  assertOnlyKeys(
    value,
    [
      "schemaVersion",
      "targetRoles",
      "targetMarkets",
      "weeklyStudyHours",
      "competencies",
      "assessments",
      "roadmap",
      "evidence",
      "marketSamples",
      "decisionRecords",
      "createdAt",
      "updatedAt",
    ],
    "careerProfile",
  );

  const parsedTargetRoles = parseTargetRoles(value.targetRoles);
  const targetMarkets = parseStringArray(value.targetMarkets, "targetMarkets", false);

  if (
    value.weeklyStudyHours !== null &&
    (typeof value.weeklyStudyHours !== "number" ||
      !Number.isFinite(value.weeklyStudyHours) ||
      value.weeklyStudyHours <= 0)
  ) {
    throw new Error("weeklyStudyHours: expected null or positive finite number");
  }

  const competencies = parseArray(value.competencies, "competencies", parseCompetencyState);
  const assessments = parseArray(value.assessments, "assessments", parseAssessmentRecord);
  const roadmap = parseRoadmapState(value.roadmap);
  const evidence = parseArray(value.evidence, "evidence", parseEvidenceRecord);
  const marketSamples = parseArray(value.marketSamples, "marketSamples", parseMarketSample);
  const decisionRecords = parseArray(
    value.decisionRecords,
    "decisionRecords",
    parseDecisionRecord,
  );
  assertIsoDateTime(value.createdAt, "createdAt");
  assertIsoDateTime(value.updatedAt, "updatedAt");

  return {
    schemaVersion: "1",
    targetRoles: parsedTargetRoles,
    targetMarkets,
    weeklyStudyHours: value.weeklyStudyHours,
    competencies,
    assessments,
    roadmap,
    evidence,
    marketSamples,
    decisionRecords,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

export function parseCareerArtifact(value: unknown): CareerArtifact {
  assertRecord(value, "careerArtifact");
  if (value.schemaVersion !== "1") {
    throw new Error(`Unsupported career artifact schema: ${String(value.schemaVersion)}`);
  }
  assertOneOf(value.artifactType, artifactTypes, "careerArtifact.artifactType");
  assertRecord(value.provenance, "careerArtifact.provenance");
  assertOnlyKeys(value.provenance, ["trust"], "careerArtifact.provenance");
  assertOneOf(value.provenance.trust, evidenceTrust, "careerArtifact.provenance.trust");

  return {
    ...value,
    schemaVersion: "1",
    artifactType: value.artifactType,
    provenance: { trust: value.provenance.trust },
  };
}
